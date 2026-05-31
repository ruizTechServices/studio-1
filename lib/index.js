// Barrel module: single import surface for server.js.
// Re-exports the shared db instance, config/path constants, and every helper.

export { db } from "./db.js";

export { ignoredDirs, allowedExtensions, importantNames, MAX_FILE_SIZE_BYTES } from "./config.js";
export { dataDir, reposDir, importsDir, tempDir, dbPath } from "./paths.js";

export { createId } from "./ids/createId.js";
export { normalizeNullableString } from "./ids/normalizeNullableString.js";

export { logEventSchema } from "./events/logEventSchema.js";
export { normalizeLogEvent } from "./events/normalizeLogEvent.js";
export { rowToEvent } from "./events/rowToEvent.js";
export { recordEvent } from "./events/recordEvent.js";
export { recordEventSafely } from "./events/recordEventSafely.js";
export { eventsForQuery } from "./events/eventsForQuery.js";

export { cleanRelativePath } from "./fileFuncs/cleanRelativePath.js";
export { shouldKeepPath } from "./fileFuncs/shouldKeepPath.js";
export { detectRepoName } from "./fileFuncs/detectRepoName.js";
export { languageFor } from "./fileFuncs/languageFor.js";
export { categoryFor } from "./fileFuncs/categoryFor.js";
export { fileRecord } from "./fileFuncs/fileRecord.js";
export { walkRepoFiles } from "./fileFuncs/walkRepoFiles.js";

export { assertGitHubUrl } from "./github/assertGitHubUrl.js";
export { repoNameFromUrl } from "./github/repoNameFromUrl.js";
export { cloneGitHubRepo } from "./github/cloneGitHubRepo.js";

export { repoSummary } from "./repos/repoSummary.js";
export { projectMap } from "./repos/projectMap.js";
export { projectSummary } from "./repos/projectSummary.js";
export { symbolMap } from "./repos/symbolMap.js";
export { dependencyMap } from "./repos/dependencyMap.js";
export { behaviorMap } from "./repos/behaviorMap.js";
export { assertDataPath } from "./repos/assertDataPath.js";
export { deleteRepo } from "./repos/deleteRepo.js";
export { saveRepo } from "./repos/saveRepo.js";
