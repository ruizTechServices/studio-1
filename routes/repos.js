import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import { upload } from "../lib/middleware/index.js";
import {
  validate,
  repoIdParams,
  deleteRepoBody,
  importGithubBody
} from "../lib/validation/index.js";
import {
  db,
  reposDir,
  importsDir,
  createId,
  normalizeNullableString,
  recordEventSafely,
  repoSummary,
  deleteRepo,
  saveRepo,
  detectRepoName,
  shouldKeepPath,
  fileRecord,
  walkRepoFiles,
  assertGitHubUrl,
  repoNameFromUrl,
  cloneGitHubRepo
} from "../lib/index.js";

const router = express.Router();

router.get("/", (_request, response) => {
  const rows = db.prepare("SELECT * FROM repos ORDER BY created_at DESC").all();
  response.json(rows.map(repoSummary));
});

router.post("/upload", upload.array("files"), (request, response) => {
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

router.post("/import-github", validate({ body: importGithubBody }), async (request, response, next) => {
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

router.get("/:id", validate({ params: repoIdParams }), (request, response) => {
  const row = db.prepare("SELECT * FROM repos WHERE id = ?").get(request.params.id);
  if (!row) {
    response.status(404).json({ error: "Repo not found" });
    return;
  }

  response.json(repoSummary(row));
});

router.delete("/:id", validate({ params: repoIdParams, body: deleteRepoBody }), (request, response, next) => {
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

export default router;
