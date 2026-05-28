import { repoState } from "./repo-state.js";

export function shouldUploadFile(file) {
  const { filterRules } = repoState;
  const relativePath = file.webkitRelativePath || file.name;
  const parts = relativePath.toLowerCase().split("/");
  const hasExtension = file.name.includes(".");
  const extension = hasExtension ? `.${file.name.split(".").pop()}`.toLowerCase() : "";
  const importantNames = ["dockerfile", "makefile", "readme", "license"];

  if (parts.some((part) => filterRules.ignoredDirs.includes(part))) {
    return false;
  }

  if (file.size > filterRules.maxFileSizeBytes) {
    return false;
  }

  if (!hasExtension) {
    return importantNames.includes(file.name.toLowerCase());
  }

  return filterRules.allowedExtensions.includes(extension);
}

export function filterSelectedFiles(files) {
  const kept = files.filter(shouldUploadFile);
  return {
    kept,
    skipped: files.length - kept.length
  };
}
