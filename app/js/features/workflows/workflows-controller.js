import { fetchWorkflowRuns } from "../studio-api.js";
import { renderStudioError, renderStudioLoading } from "../studio-page-renderer.js";
import { renderWorkflowsPage } from "./workflows-render.js";

export function initWorkflowsPage() {
  const target = document.querySelector("#workflowsPage");
  renderStudioLoading(target, "Workflows");

  fetchWorkflowRuns()
    .then((data) => renderWorkflowsPage(target, data))
    .catch((error) => renderStudioError(target, "Workflows", error.message));
}
