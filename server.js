import crypto from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import express from "express";
import multer from "multer";
import { z } from "zod";

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

  CREATE TABLE IF NOT EXISTS action_events (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    level TEXT NOT NULL,
    area TEXT NOT NULL,
    source TEXT NOT NULL,
    phase TEXT NOT NULL,
    action TEXT NOT NULL,
    message TEXT NOT NULL,
    details_json TEXT,
    entity_type TEXT,
    entity_id TEXT,
    entity_name TEXT,
    correlation_id TEXT,
    request_id TEXT,
    parent_event_id TEXT
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

const logEventSchema = z.object({
  id: z.string().trim().min(1).optional().nullable(),
  timestamp: z.string().datetime().optional().nullable(),
  level: z.enum(["debug", "info", "success", "warning", "error"]).default("info"),
  area: z.string().trim().min(1),
  source: z.string().trim().min(1),
  phase: z.string().trim().min(1),
  action: z.string().trim().min(1),
  message: z.string().trim().min(1),
  details: z.record(z.string(), z.unknown()).optional().nullable(),
  entity: z
    .object({
      type: z.string().trim().min(1),
      id: z.string().optional().nullable(),
      name: z.string().optional().nullable()
    })
    .optional()
    .nullable(),
  correlationId: z.string().optional().nullable(),
  requestId: z.string().optional().nullable(),
  parentEventId: z.string().optional().nullable()
});

function createId(prefix) {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

function normalizeNullableString(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return String(value);
}

function normalizeLogEvent(input = {}) {
  const parsed = logEventSchema.parse(input);
  const event = {
    id: normalizeNullableString(parsed.id) || createId("evt"),
    timestamp: normalizeNullableString(parsed.timestamp) || new Date().toISOString(),
    level: parsed.level,
    area: parsed.area,
    source: parsed.source,
    phase: parsed.phase,
    action: parsed.action,
    message: parsed.message,
    details: parsed.details || null,
    entity: parsed.entity
      ? {
          type: normalizeNullableString(parsed.entity.type),
          id: normalizeNullableString(parsed.entity.id),
          name: normalizeNullableString(parsed.entity.name)
        }
      : null,
    correlationId: normalizeNullableString(parsed.correlationId),
    requestId: normalizeNullableString(parsed.requestId),
    parentEventId: normalizeNullableString(parsed.parentEventId)
  };

  return event;
}

function rowToEvent(row) {
  return {
    id: row.id,
    timestamp: row.timestamp,
    level: row.level,
    area: row.area,
    source: row.source,
    phase: row.phase,
    action: row.action,
    message: row.message,
    details: row.details_json ? JSON.parse(row.details_json) : null,
    entity: row.entity_type
      ? {
          type: row.entity_type,
          id: row.entity_id,
          name: row.entity_name
        }
      : null,
    correlationId: row.correlation_id,
    requestId: row.request_id,
    parentEventId: row.parent_event_id
  };
}

function recordEvent(input) {
  const event = normalizeLogEvent(input);
  db.prepare(`
    INSERT INTO action_events (
      id,
      timestamp,
      level,
      area,
      source,
      phase,
      action,
      message,
      details_json,
      entity_type,
      entity_id,
      entity_name,
      correlation_id,
      request_id,
      parent_event_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `).run(
    event.id,
    event.timestamp,
    event.level,
    event.area,
    event.source,
    event.phase,
    event.action,
    event.message,
    event.details ? JSON.stringify(event.details) : null,
    event.entity?.type || null,
    event.entity?.id || null,
    event.entity?.name || null,
    event.correlationId,
    event.requestId,
    event.parentEventId
  );
  return event;
}

function recordEventSafely(input) {
  try {
    return recordEvent(input);
  } catch (error) {
    console.error("Failed to record action event:", error.message);
    return null;
  }
}

function eventsForQuery(query) {
  const clauses = [];
  const values = [];
  const filterMap = {
    level: "level",
    area: "area",
    source: "source",
    entityType: "entity_type",
    entityId: "entity_id",
    correlationId: "correlation_id",
    requestId: "request_id"
  };

  for (const [queryKey, column] of Object.entries(filterMap)) {
    if (query[queryKey]) {
      clauses.push(`${column} = ?`);
      values.push(String(query[queryKey]));
    }
  }

  const requestedLimit = Number.parseInt(query.limit, 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 500) : 100;
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT * FROM action_events ${where} ORDER BY timestamp DESC LIMIT ?`)
    .all(...values, limit)
    .map(rowToEvent);
}

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

function assertDataPath(targetPath) {
  const resolvedDataDir = path.resolve(dataDir);
  const resolvedTarget = path.resolve(targetPath);
  const relative = path.relative(resolvedDataDir, resolvedTarget);

  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Refusing to delete a path outside the app data directory.");
  }

  return resolvedTarget;
}

function deleteRepo(row) {
  const repoPath = assertDataPath(row.root_path);
  const importParent = path.dirname(repoPath);
  const shouldRemoveImportParent =
    path.dirname(importParent) === path.resolve(importsDir) &&
    path.basename(importParent) === row.id;

  fs.rmSync(repoPath, { recursive: true, force: true });
  if (shouldRemoveImportParent) {
    fs.rmSync(importParent, { recursive: true, force: true });
  }

  try {
    db.exec("BEGIN");
    db.prepare("DELETE FROM repo_files WHERE repo_id = ?").run(row.id);
    db.prepare("DELETE FROM repos WHERE id = ?").run(row.id);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
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

app.use((request, _response, next) => {
  request.requestId = createId("req");
  next();
});

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

app.get("/api/events", (request, response, next) => {
  try {
    response.json(eventsForQuery(request.query));
  } catch (error) {
    next(error);
  }
});

app.post("/api/events", (request, response, next) => {
  try {
    const event = recordEvent({
      ...request.body,
      requestId: request.body?.requestId || request.requestId
    });
    response.status(201).json(event);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

app.get("/api/entities/:type/:id/events", (request, response, next) => {
  try {
    response.json(eventsForQuery({
      ...request.query,
      entityType: request.params.type,
      entityId: request.params.id
    }));
  } catch (error) {
    next(error);
  }
});

app.get("/api/repos/:id", (request, response) => {
  const row = db.prepare("SELECT * FROM repos WHERE id = ?").get(request.params.id);
  if (!row) {
    response.status(404).json({ error: "Repo not found" });
    return;
  }

  response.json(repoSummary(row));
});

app.delete("/api/repos/:id", (request, response, next) => {
  const correlationId = normalizeNullableString(request.body?.correlationId) || createId("corr");
  const row = db.prepare("SELECT * FROM repos WHERE id = ?").get(request.params.id);
  if (!row) {
    recordEventSafely({
      level: "warning",
      area: "repo_map",
      source: "sqlite",
      phase: "delete",
      action: "repo_delete_missing",
      message: "Repo delete requested for a missing repo.",
      details: { repoId: request.params.id },
      correlationId,
      requestId: request.requestId
    });
    response.status(404).json({ error: "Repo not found" });
    return;
  }

  try {
    deleteRepo(row);
    recordEventSafely({
      level: "success",
      area: "repo_map",
      source: "sqlite",
      phase: "delete",
      action: "repo_deleted",
      message: `${row.name} deleted.`,
      details: {
        repoId: row.id,
        sourceType: row.source_type,
        rootPath: row.root_path
      },
      entity: { type: "repo", id: row.id, name: row.name },
      correlationId,
      requestId: request.requestId
    });
    response.json({ deleted: true, repoId: row.id, name: row.name });
  } catch (error) {
    recordEventSafely({
      level: "error",
      area: "repo_map",
      source: "sqlite",
      phase: "delete",
      action: "repo_delete_failed",
      message: error.message || "Repo delete failed.",
      details: { repoId: row.id, rootPath: row.root_path },
      entity: { type: "repo", id: row.id, name: row.name },
      correlationId,
      requestId: request.requestId
    });
    next(error);
  }
});

app.post("/api/repos/upload", upload.array("files"), (request, response) => {
  const correlationId = normalizeNullableString(request.body.correlationId) || createId("corr");
  const files = request.files || [];
  if (!files.length) {
    recordEventSafely({
      level: "error",
      area: "repo_map",
      source: "local_upload",
      phase: "input",
      action: "local_upload_failed",
      message: "Local upload failed because no files were received.",
      details: { reason: "empty_file_list" },
      correlationId,
      requestId: request.requestId
    });
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
    recordEventSafely({
      level: "error",
      area: "repo_map",
      source: "local_upload",
      phase: "filter",
      action: "local_upload_failed",
      message: "No scannable repo files found after filtering.",
      details: { selectedFiles: files.length, keptFiles: 0, skippedFiles: files.length },
      entity: { type: "repo", id: repoId, name: repoName },
      correlationId,
      requestId: request.requestId
    });
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
  recordEventSafely({
    level: "success",
    area: "repo_map",
    source: "sqlite",
    phase: "save",
    action: "repo_saved",
    message: `${repoName} saved with ${records.length} files.`,
    details: {
      fileCount: records.length,
      totalBytes: records.reduce((sum, file) => sum + file.sizeBytes, 0),
      sourceType: "folder_upload_filtered"
    },
    entity: { type: "repo", id: repoId, name: repoName },
    correlationId,
    requestId: request.requestId
  });

  response.status(201).json(repoSummary(row));
});

app.post("/api/repos/import-github", async (request, response, next) => {
  const correlationId = normalizeNullableString(request.body?.correlationId) || createId("corr");
  let repoName = null;
  let repoId = null;
  try {
    const url = assertGitHubUrl(request.body.repoUrl);
    repoId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    repoName = repoNameFromUrl(url);
    const repoPath = path.join(importsDir, repoId, repoName);

    recordEventSafely({
      level: "info",
      area: "repo_map",
      source: "github",
      phase: "clone",
      action: "github_clone_started",
      message: `Started cloning ${repoName}.`,
      details: { repoUrl: url },
      entity: { type: "repo", id: repoId, name: repoName },
      correlationId,
      requestId: request.requestId
    });
    await cloneGitHubRepo(url, repoPath);
    recordEventSafely({
      level: "success",
      area: "repo_map",
      source: "github",
      phase: "clone",
      action: "github_clone_succeeded",
      message: `${repoName} cloned successfully.`,
      details: { repoUrl: url },
      entity: { type: "repo", id: repoId, name: repoName },
      correlationId,
      requestId: request.requestId
    });

    const records = walkRepoFiles(repoPath).map((record) => ({
      ...record,
      repoId
    }));

    if (!records.length) {
      recordEventSafely({
        level: "error",
        area: "repo_map",
        source: "github",
        phase: "filter",
        action: "github_import_no_scannable_files",
        message: "GitHub import found no scannable files after filtering.",
        details: { repoUrl: url, keptFiles: 0 },
        entity: { type: "repo", id: repoId, name: repoName },
        correlationId,
        requestId: request.requestId
      });
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
    recordEventSafely({
      level: "success",
      area: "repo_map",
      source: "sqlite",
      phase: "save",
      action: "repo_saved",
      message: `${repoName} saved with ${records.length} files.`,
      details: {
        fileCount: records.length,
        totalBytes: records.reduce((sum, file) => sum + file.sizeBytes, 0),
        sourceType: "github_url_filtered"
      },
      entity: { type: "repo", id: repoId, name: repoName },
      correlationId,
      requestId: request.requestId
    });

    response.status(201).json(repoSummary(row));
  } catch (error) {
    recordEventSafely({
      level: "error",
      area: "repo_map",
      source: "github",
      phase: "clone",
      action: "github_clone_failed",
      message: error.message || "GitHub import failed.",
      details: { repoUrl: request.body?.repoUrl || null },
      entity: repoName ? { type: "repo", id: repoId, name: repoName } : null,
      correlationId,
      requestId: request.requestId
    });
    next(error);
  }
});

app.use((error, request, response, _next) => {
  recordEventSafely({
    level: "error",
    area: "system",
    source: "api",
    phase: "error",
    action: "api_request_failed",
    message: error.message || "Server error",
    details: {
      method: request.method,
      path: request.path
    },
    requestId: request.requestId
  });

  if (error instanceof multer.MulterError) {
    response.status(400).json({ error: error.message });
    return;
  }

  response.status(500).json({ error: error.message || "Server error" });
});

app.listen(port, () => {
  console.log(`studio-1 running at http://localhost:${port}`);
  recordEventSafely({
    level: "success",
    area: "system",
    source: "system",
    phase: "startup",
    action: "server_started",
    message: `studio-1 running at http://localhost:${port}`,
    details: { port }
  });
});
