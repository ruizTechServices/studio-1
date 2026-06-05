import { fetchSpecs } from "../studio-api.js";
import { renderStudioError, renderStudioLoading } from "../studio-page-renderer.js";
import { renderSpecsPage } from "./specs-render.js";

export function initSpecsPage() {
  const target = document.querySelector("#specsPage");
  renderStudioLoading(target, "Specs");

  fetchSpecs()
    .then((data) => renderSpecsPage(target, data))
    .catch((error) => renderStudioError(target, "Specs", error.message));
}
