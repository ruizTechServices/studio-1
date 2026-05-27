import fs from "node:fs";
import path from "node:path";
import { db } from "../db.js";
import { importsDir } from "../paths.js";
import { assertDataPath } from "./assertDataPath.js";

export function deleteRepo(row) {
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
