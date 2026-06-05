import { fetchProjects } from "../studio-api.js";
import { renderStudioError, renderStudioLoading } from "../studio-page-renderer.js";
import { renderProjectsPage } from "./projects-render.js";

export function initProjectsPage() {
  const target = document.querySelector("#projectsPage");
  renderStudioLoading(target, "Projects");

  fetchProjects()
    .then((data) => renderProjectsPage(target, data))
    .catch((error) => renderStudioError(target, "Projects", error.message));
}
