import fs from "node:fs";
import path from "node:path";
import { ignoredDirs } from "../config.js";
import { cleanRelativePath } from "./cleanRelativePath.js";
import { shouldKeepPath } from "./shouldKeepPath.js";
import { fileRecord } from "./fileRecord.js";

export function walkRepoFiles(rootDir) {
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
