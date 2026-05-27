import { cleanRelativePath } from "./cleanRelativePath.js";

export function detectRepoName(files, fallback) {
  const firstPath = cleanRelativePath(files[0]?.originalname || "");
  const firstSegment = firstPath.split("/")[0];
  return String(fallback || firstSegment || "uploaded-repo").trim();
}
