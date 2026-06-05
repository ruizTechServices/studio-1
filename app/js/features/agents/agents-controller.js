import { fetchAgents } from "../studio-api.js";
import { renderStudioError, renderStudioLoading } from "../studio-page-renderer.js";
import { renderAgentsPage } from "./agents-render.js";

export function initAgentsPage() {
  const target = document.querySelector("#agentsPage");
  renderStudioLoading(target, "Agents");

  fetchAgents()
    .then((data) => renderAgentsPage(target, data))
    .catch((error) => renderStudioError(target, "Agents", error.message));
}
