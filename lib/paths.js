import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), "..");

export const dataDir = path.join(rootDir, "data");
export const reposDir = path.join(dataDir, "repos");
export const importsDir = path.join(dataDir, "imports");
export const tempDir = path.join(dataDir, "tmp");
export const dbPath = path.join(dataDir, "studio-1.sqlite");

fs.mkdirSync(reposDir, { recursive: true });
fs.mkdirSync(importsDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });
