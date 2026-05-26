import crypto from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import express from "express";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execFileAsync = promisify(execFile);
const app = express();
const port = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");
const reposDir = path.join(dataDir, "repos");
const importsDir = path.join(dataDir, "imports");
const tempDir = path.join(dataDir, "tmp");
const dbPath = path.join(dataDir, "studio-1.sqlite");

fs.mkdirSync(reposDir, { recursive: true });
fs.mkdirSync(importsDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS repos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    root_path TEXT NOT NULL,
    total_files INTEGER NOT NULL,
    total_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS repo_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id TEXT NOT NULL,
    path TEXT NOT NULL,
    name TEXT NOT NULL,
    extension TEXT NOT NULL,
    language TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    category TEXT NOT NULL,
    FOREIGN KEY (repo_id) REFERENCES repos(id) ON DELETE CASCADE
  );
`);

db.exec(`
  DELETE FROM repos
  WHERE NOT EXISTS (
    SELECT 1 FROM repo_files WHERE repo_files.repo_id = repos.id
  );
`);

const upload = multer({
  dest: tempDir,
  preservePath: true,
  limits: {
    files: 3000,
    fileSize: 2 * 1024 * 1024
  }
});

const ignoredDirs = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".turbo",
  ".cache",
  ".parcel-cache",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "out",
  "target",
  "vendor",
  ".venv",
  "venv",
  "__pycache__",
  ".idea",
  ".vscode"
]);

const allowedExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".py",
  ".rb",
  ".go",
  ".rs",
  ".java",
  ".php",
  ".cs",
  ".swift",
  ".kt",
  ".html",
  ".css",
  ".scss",
  ".sql",
  ".json",
  ".md",
  ".mdx",
  ".yaml",
  ".yml",
  ".toml"
]);

const importantNames = new Set([
  "dockerfile",
  "makefile",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "requirements.txt",
  "gemfile",
  "cargo.toml",
  "go.mod",
  "readme",
  "license"
]);

function cleanRelativePath(value) {
  const normalized = String(value || "")
    .replaceAll("\\", "/")
    .replace(/^\/+/, "");
  const parts = normalized
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .map((part) => part.replace(/[<>:"|?*]/g, "-"));
  return parts.join("/");
}

function shouldKeepPath(relativePath, sizeBytes = 0) {
  const normalized = cleanRelativePath(relativePath);
  const parts = normalized.toLowerCase().split("/");
  const base = path.basename(normalized).toLowerCase();
  const extension = path.extname(base);

  if (!normalized || parts.some((part) => ignoredDirs.has(part))) {
    return false;
  }

  if (sizeBytes > 2 * 1024 * 1024) {
    return false;
  }

  return allowedExtensions.has(extension) || importantNames.has(base) || importantNames.has(base.replace(/\..*$/, ""));
}

function detectRepoName(files, fallback) {
  const firstPath = cleanRelativePath(files[0]?.originalname || "");
  const firstSegment = firstPath.split("/")[0];
  return String(fallback || firstSegment || "uploaded-repo").trim();
}

function assertGitHubUrl(value) {
  const url = String(value || "").trim();
  if (!/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?$/i.test(url)) {
    throw new Error("Enter a valid GitHub repo URL.");
  }
  return url.endsWith(".git") ? url : `${url}.git`;
}

function repoNameFromUrl(url) {
  return url
    .replace(/\.git$/i, "")
    .split("/")
    .pop()
    .replace(/[^\w.-]/g, "-");
}

function languageFor(extension) {
  const map = {
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".mjs": "javascript",
    ".cjs": "javascript",
    ".py": "python",
    ".rb": "ruby",
    ".go": "go",
    ".rs": "rust",
    ".java": "java",
    ".php": "php",
    ".cs": "csharp",
    ".swift": "swift",
    ".kt": "kotlin",
    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".json": "json",
    ".md": "markdown",
    ".mdx": "markdown",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".sql": "sql"
  };
  return map[extension] || "unknown";
}

function categoryFor(relativePath, extension) {
  const lower = relativePath.toLowerCase();
  const name = path.basename(lower);

  if (lower.includes("/components/")) return "components";
  if (lower.includes("/pages/") || lower.includes("/routes/") || name === "page.tsx" || name === "page.jsx") return "pagesRoutes";
  if (lower.includes("/api/") || name === "route.ts" || name === "route.js") return "apiEndpoints";
  if (lower.includes("/db/") || lower.includes("/database/") || lower.includes("/migrations/") || extension === ".sql") return "databaseFiles";
  if (lower.includes("auth")) return "authLogic";
  if (lower.includes("stripe") || lower.includes("payment") || lower.includes("checkout")) return "paymentLogic";
  if (lower.includes("openai") || lower.includes("ai") || lower.includes("agent")) return "aiLogic";
  if ([".md", ".mdx", ".txt"].includes(extension)) return "documentation";
  if (lower.includes(".test.") || lower.includes(".spec.") || lower.includes("/tests/") || lower.includes("/__tests__/")) return "tests";
  if ([".json", ".yaml", ".yml", ".toml", ".env", ".config", ".lock"].includes(extension) || name.includes("config")) return "configFiles";
  if (allowedExtensions.has(extension)) return "functions";
  return "other";
}

function fileRecord(repoId, relativePath, sizeBytes) {
  const cleanPath = cleanRelativePath(relativePath);
  const extension = path.extname(cleanPath).toLowerCase();
  return {
    repoId,
    path: cleanPath,
    name: path.basename(cleanPath),
    extension,
    language: languageFor(extension),
    sizeBytes,
    category: categoryFor(cleanPath, extension)
  };
}

function repoSummary(row) {
  const files = db
    .prepare("SELECT path, name, extension, language, size_bytes AS sizeBytes, category FROM repo_files WHERE repo_id = ? ORDER BY path")
    .all(row.id);

  const categories = files.reduce((result, file) => {
    result[file.category] = (result[file.category] || 0) + 1;
    return result;
  }, {});

  return {
    id: row.id,
    name: row.name,
    sourceType: row.source_type,
    totalFiles: row.total_files,
    totalBytes: row.total_bytes,
    createdAt: row.created_at,
    categories,
    files
  };
}

function saveRepo({ repoId, repoName, sourceType, repoPath, records }) {
  const now = new Date().toISOString();
  const totalBytes = records.reduce((sum, file) => sum + file.sizeBytes, 0);

  try {
    db.exec("BEGIN");

    db.prepare(`
      INSERT INTO repos (id, name, source_type, root_path, total_files, total_bytes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(repoId, repoName, sourceType, repoPath, records.length, totalBytes, now);

    const insertFile = db.prepare(`
      INSERT INTO repo_files (repo_id, path, name, extension, language, size_bytes, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const file of records) {
      insertFile.run(file.repoId, file.path, file.name, file.extension, file.language, file.sizeBytes, file.category);
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return db.prepare("SELECT * FROM repos WHERE id = ?").get(repoId);
}

function walkRepoFiles(rootDir) {
  const records = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = cleanRelativePath(path.relative(rootDir, fullPath));
      const lowerName = entry.name.toLowerCase();

      if (entry.isDirectory()) {
        if (!ignoredDirs.has(lowerName)) {
          walk(fullPath);
        }
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const stats = fs.statSync(fullPath);
      if (shouldKeepPath(relativePath, stats.size)) {
        records.push(fileRecord("", relativePath, stats.size));
      }
    }
  }

  walk(rootDir);
  return records;
}

async function cloneGitHubRepo(url, destination) {
  await execFileAsync("git", ["clone", "--depth=1", "--single-branch", url, destination], {
    timeout: 120000,
    maxBuffer: 1024 * 1024
  });
}

app.use(express.static(path.join(__dirname, "app")));
app.use(express.json());

app.get("/", (_request, response) => {
  response.sendFile(path.join(__dirname, "app", "index.html"));
});

app.get("/api/filter-rules", (_request, response) => {
  response.json({
    ignoredDirs: Array.from(ignoredDirs),
    allowedExtensions: Array.from(allowedExtensions),
    maxFileSizeBytes: 2 * 1024 * 1024
  });
});

app.get("/api/repos", (_request, response) => {
  const rows = db.prepare("SELECT * FROM repos ORDER BY created_at DESC").all();
  response.json(rows.map(repoSummary));
});

app.get("/api/repos/:id", (request, response) => {
  const row = db.prepare("SELECT * FROM repos WHERE id = ?").get(request.params.id);
  if (!row) {
    response.status(404).json({ error: "Repo not found" });
    return;
  }

  response.json(repoSummary(row));
});

app.post("/api/repos/upload", upload.array("files"), (request, response) => {
  const files = request.files || [];
  if (!files.length) {
    response.status(400).json({ error: "Choose a repo folder to upload." });
    return;
  }

  const repoId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const repoName = detectRepoName(files, request.body.repoName);
  const repoPath = path.join(reposDir, repoId);
  fs.mkdirSync(repoPath, { recursive: true });

  const records = [];
  for (const file of files) {
    if (!shouldKeepPath(file.originalname || file.filename, file.size)) {
      fs.rmSync(file.path, { force: true });
      continue;
    }

    const record = fileRecord(repoId, file.originalname || file.filename, file.size);
    const destination = path.join(repoPath, record.path);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.renameSync(file.path, destination);
    records.push(record);
  }

  if (!records.length) {
    response.status(400).json({ error: "No scannable repo files found after filtering." });
    return;
  }

  const row = saveRepo({
    repoId,
    repoName,
    sourceType: "folder_upload_filtered",
    repoPath,
    records
  });

  response.status(201).json(repoSummary(row));
});

app.post("/api/repos/import-github", async (request, response, next) => {
  try {
    const url = assertGitHubUrl(request.body.repoUrl);
    const repoId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const repoName = repoNameFromUrl(url);
    const repoPath = path.join(importsDir, repoId, repoName);

    await cloneGitHubRepo(url, repoPath);

    const records = walkRepoFiles(repoPath).map((record) => ({
      ...record,
      repoId
    }));

    if (!records.length) {
      response.status(400).json({ error: "No scannable repo files found after filtering." });
      return;
    }

    const row = saveRepo({
      repoId,
      repoName,
      sourceType: "github_url_filtered",
      repoPath,
      records
    });

    response.status(201).json(repoSummary(row));
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) {
    response.status(400).json({ error: error.message });
    return;
  }

  response.status(500).json({ error: error.message || "Server error" });
});

app.listen(port, () => {
  console.log(`studio-1 running at http://localhost:${port}`);
});
