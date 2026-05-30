import fs from "node:fs";
import path from "node:path";
import { db } from "../db.js";

const JS_TS_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const MAX_DEP_FILE_SIZE = 512 * 1024;
const TRY_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

function extractImportSources(content) {
  const sources = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue;

    // ES module with "from": import ... from "source" (covers type imports too)
    const withFrom = t.match(/^import\b.*\bfrom\s+["']([^"']+)["']/);
    if (withFrom) { sources.push(withFrom[1]); continue; }

    // Side-effect import: import "source"
    const sideEffect = t.match(/^import\s+["']([^"']+)["']/);
    if (sideEffect) { sources.push(sideEffect[1]); continue; }

    // Re-exports: export { ... } from "source" or export * from "source"
    const reexport = t.match(/^export\b.*\bfrom\s+["']([^"']+)["']/);
    if (reexport) { sources.push(reexport[1]); continue; }

    // CommonJS require (may appear anywhere on a line)
    const cjs = t.match(/\brequire\s*\(\s*["']([^"']+)["']\s*\)/);
    if (cjs) { sources.push(cjs[1]); }
  }
  return sources;
}

function resolveRelativeImport(fromFilePath, importSource, storedPathSet) {
  const dir = path.posix.dirname(fromFilePath);
  const joined = path.posix.join(dir, importSource);
  const normalized = path.posix.normalize(joined);

  if (storedPathSet.has(normalized)) return normalized;

  // Try appending each JS/TS extension
  for (const ext of TRY_EXTENSIONS) {
    const candidate = normalized + ext;
    if (storedPathSet.has(candidate)) return candidate;
  }

  // Try resolving as a directory index
  for (const ext of TRY_EXTENSIONS) {
    const candidate = path.posix.join(normalized, "index" + ext);
    if (storedPathSet.has(candidate)) return candidate;
  }

  return null;
}

function externalModuleName(source) {
  // Scoped package: @scope/name → @scope/name
  if (source.startsWith("@")) return source.split("/").slice(0, 2).join("/");
  // Regular package: name or name/subpath → name
  return source.split("/")[0];
}

export function dependencyMap(row) {
  const files = db
    .prepare("SELECT path, extension, size_bytes AS sizeBytes FROM repo_files WHERE repo_id = ? ORDER BY path")
    .all(row.id);

  const jsFiles = files.filter((f) => JS_TS_EXTENSIONS.has(f.extension));
  const storedPathSet = new Set(jsFiles.map((f) => f.path));

  const importedByMap = new Map();
  for (const f of jsFiles) importedByMap.set(f.path, new Set());

  const externalCounts = new Map();

  let totalEdges = 0;
  let resolvedEdges = 0;

  const resultFiles = [];

  for (const file of jsFiles) {
    if (file.sizeBytes > MAX_DEP_FILE_SIZE) continue;

    const filePath = path.join(row.root_path, file.path);
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const sources = extractImportSources(content);
    if (!sources.length) continue;

    const imports = [];

    for (const source of sources) {
      totalEdges++;
      const isRelative = source.startsWith(".");
      const resolvedPath = isRelative
        ? resolveRelativeImport(file.path, source, storedPathSet)
        : null;

      if (resolvedPath) {
        resolvedEdges++;
        importedByMap.get(resolvedPath)?.add(file.path);
      } else if (!isRelative) {
        const name = externalModuleName(source);
        externalCounts.set(name, (externalCounts.get(name) || 0) + 1);
      }

      imports.push({ source, resolvedPath: resolvedPath ?? null, resolved: resolvedPath !== null });
    }

    resultFiles.push({
      path: file.path,
      importCount: imports.length,
      resolvedCount: imports.filter((i) => i.resolved).length,
      imports
    });
  }

  // Attach importedBy arrays to result files
  for (const rf of resultFiles) {
    rf.importedBy = [...(importedByMap.get(rf.path) ?? [])];
  }

  const mostImportedInternal = jsFiles
    .map((f) => ({ path: f.path, importedByCount: importedByMap.get(f.path)?.size ?? 0 }))
    .filter((f) => f.importedByCount > 0)
    .sort((a, b) => b.importedByCount - a.importedByCount)
    .slice(0, 15);

  const mostImportedExternal = [...externalCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, count]) => ({ name, count }));

  const orphans = jsFiles
    .filter((f) => (importedByMap.get(f.path)?.size ?? 0) === 0)
    .map((f) => f.path)
    .slice(0, 30);

  return {
    repo: { id: row.id, name: row.name },
    summary: {
      totalFilesScanned: jsFiles.length,
      totalEdges,
      resolvedEdges,
      unresolvedEdges: totalEdges - resolvedEdges,
      orphanCount: jsFiles.filter((f) => (importedByMap.get(f.path)?.size ?? 0) === 0).length
    },
    files: resultFiles,
    mostImportedInternal,
    mostImportedExternal,
    orphans
  };
}
