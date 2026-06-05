import { fetchMemoryContext } from "../studio-api.js";
import { renderStudioError, renderStudioLoading } from "../studio-page-renderer.js";
import { renderMemoryPage } from "./memory-render.js";

export function initMemoryPage() {
  const target = document.querySelector("#memoryPage");
  renderStudioLoading(target, "Memory");

  fetchMemoryContext()
    .then((data) => renderMemoryPage(target, data))
    .catch((error) => renderStudioError(target, "Memory", error.message));
}
