import { apiGet } from "../core/api.js";

export function fetchProjects() {
  return apiGet("/api/projects");
}

export function fetchSpecs() {
  return apiGet("/api/specs");
}

export function fetchAgents() {
  return apiGet("/api/agents");
}

export function fetchWorkflowRuns() {
  return apiGet("/api/workflows/runs");
}

export function fetchMemoryContext() {
  return apiGet("/api/memory/context");
}

export function fetchSettingsStatus() {
  return apiGet("/api/settings/status");
}

export async function fetchDashboardSummary() {
  const [projects, specs, agents, workflows] = await Promise.all([
    fetchProjects(),
    fetchSpecs(),
    fetchAgents(),
    fetchWorkflowRuns()
  ]);

  return { projects, specs, agents, workflows };
}
