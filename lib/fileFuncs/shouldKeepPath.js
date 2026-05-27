import path from "node:path";
import { cleanRelativePath } from "./cleanRelativePath.js";
import { ignoredDirs, allowedExtensions, importantNames, MAX_FILE_SIZE_BYTES } from "../config.js";

export function shouldKeepPath(relativePath, sizeBytes = 0) {
  const normalized = cleanRelativePath(relativePath);
  const parts = normalized.toLowerCase().split("/");
  const base = path.basename(normalized).toLowerCase();
  const extension = path.extname(base);

  if (!normalized || parts.some((part) => ignoredDirs.has(part))) {
    return false;
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return false;
  }

  return allowedExtensions.has(extension) || importantNames.has(base) || importantNames.has(base.replace(/\..*$/, ""));
}
