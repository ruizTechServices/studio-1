import { showToast } from "../../core/toast.js";
import { renderHomeStatus } from "./home-render.js";

export function initHomePage() {
  const statusButton = document.querySelector("#homeShowStatusBtn");
  const homePage = document.querySelector(".home-page");

  if (!homePage) {
    return;
  }

  statusButton?.addEventListener("click", () => {
    let statusPanel = document.querySelector("#homeStatusPanel");

    if (!statusPanel) {
      statusPanel = document.createElement("section");
      statusPanel.id = "homeStatusPanel";
      statusPanel.className = "home-status-wrapper";
      statusPanel.setAttribute("aria-label", "Current studio status");
      homePage.appendChild(statusPanel);
    }

    renderHomeStatus(statusPanel);
    showToast("Home status loaded");
  });
}