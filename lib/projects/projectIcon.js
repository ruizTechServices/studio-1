import fs from "node:fs";
import path from "node:path";

const SKIP_DIRECTORIES = new Set([".git", "node_modules", ".next", "dist", "build"]);

export function findProjectIcon(rootPath) {
  if (!rootPath || !fs.existsSync(rootPath)) {
    return null;
  }

  const candidates = [];
  const pending = [rootPath];

  while (pending.length) {
    const directory = pending.pop();
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (!SKIP_DIRECTORIES.has(entry.name)) {
          pending.push(entryPath);
        }
        continue;
      }

      if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".ico") {
        candidates.push(entryPath);
      }
    }
  }

  return candidates.sort((left, right) => {
    const leftName = path.basename(left).toLowerCase();
    const rightName = path.basename(right).toLowerCase();
    const leftPriority = leftName === "favicon.ico" ? 0 : 1;
    const rightPriority = rightName === "favicon.ico" ? 0 : 1;
    return leftPriority - rightPriority || left.length - right.length || left.localeCompare(right);
  })[0] || null;
}
