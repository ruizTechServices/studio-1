import { readApiJson } from "../../core/api.js";

export async function fetchRepos() {
  const response = await fetch("/api/repos");
  return readApiJson(response);
}

export async function uploadRepoFiles(formData) {
  const response = await fetch("/api/repos/upload", {
    method: "POST",
    body: formData
  });
  return readApiJson(response);
}

export async function importGithubRepo(repoUrl, correlationId) {
  const response = await fetch("/api/repos/import-github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl, correlationId })
  });
  return readApiJson(response);
}

export async function deleteRepo(repoId, correlationId) {
  const response = await fetch(`/api/repos/${encodeURIComponent(repoId)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correlationId })
  });
  return readApiJson(response);
}

export async function fetchFilterRules() {
  const response = await fetch("/api/filter-rules");
  return readApiJson(response);
}

export async function fetchActionEvents() {
  const response = await fetch("/api/events?limit=100");
  return readApiJson(response);
}

export async function fetchProjectMap(repoId) {
  const response = await fetch(`/api/repos/${encodeURIComponent(repoId)}/project-map`);
  return readApiJson(response);
}

export async function fetchProjectSummary(repoId) {
  const response = await fetch(`/api/repos/${encodeURIComponent(repoId)}/project-summary`);
  return readApiJson(response);
}

export async function fetchSymbolMap(repoId) {
  const response = await fetch(`/api/repos/${encodeURIComponent(repoId)}/symbol-map`);
  return readApiJson(response);
}

export async function fetchDependencyMap(repoId) {
  const response = await fetch(`/api/repos/${encodeURIComponent(repoId)}/dependency-map`);
  return readApiJson(response);
}

export async function fetchBehaviorMap(repoId) {
  const response = await fetch(`/api/repos/${encodeURIComponent(repoId)}/behavior-map`);
  return readApiJson(response);
}

export async function persistActionEvent(event) {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event)
  });
  return readApiJson(response);
}
