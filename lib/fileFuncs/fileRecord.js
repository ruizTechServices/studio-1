import path from "node:path";
import { cleanRelativePath } from "./cleanRelativePath.js";
import { languageFor } from "./languageFor.js";
import { categoryFor } from "./categoryFor.js";

export function fileRecord(repoId, relativePath, sizeBytes) {
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
