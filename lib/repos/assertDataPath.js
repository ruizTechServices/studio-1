import path from "node:path";
import { dataDir } from "../paths.js";

export function assertDataPath(targetPath) {
  const resolvedDataDir = path.resolve(dataDir);
  const resolvedTarget = path.resolve(targetPath);
  const relative = path.relative(resolvedDataDir, resolvedTarget);

  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Refusing to delete a path outside the app data directory.");
  }

  return resolvedTarget;
}
