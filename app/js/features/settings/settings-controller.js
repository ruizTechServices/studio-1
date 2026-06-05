import { fetchSettingsStatus } from "../studio-api.js";
import { renderStudioError, renderStudioLoading } from "../studio-page-renderer.js";
import { renderSettingsPage } from "./settings-render.js";

export function initSettingsPage() {
  const target = document.querySelector("#settingsPage");
  renderStudioLoading(target, "Settings");

  fetchSettingsStatus()
    .then((data) => renderSettingsPage(target, data))
    .catch((error) => renderStudioError(target, "Settings", error.message));
}
