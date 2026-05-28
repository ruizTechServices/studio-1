import { renderKpis, renderDashboard } from "./dashboard-render.js";
import { icon } from "../../core/icons.js";
import { showToast } from "../../core/toast.js";
import { projects } from "../../data/dashboard-data.js";

export function initDashboardPage() {
  renderKpis();
  renderDashboard();

  const projectNav = document.querySelector("#projectNav");
  if (projectNav) {
    projectNav.innerHTML = projects.map(([label, iconName, active]) => `
      <button class="project-row ${active ? "active" : ""}" type="button" data-project="${label}" data-toast="${label}">
        ${icon(iconName)}
        <span>${label}</span>
        ${active ? `<span class="project-chevron">${icon("chevron-right")}</span>` : ""}
      </button>
    `).join("") + `
      <button class="project-row new-project" type="button" data-toast="New project">
        ${icon("plus")}
        <span>New Project</span>
      </button>
    `;
  }

  document.addEventListener("click", (event) => {
    const navButton = event.target.closest(".nav-item");
    if (navButton && navButton.tagName !== "A") {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      navButton.classList.add("active");
    }

    const projectButton = event.target.closest(".project-row:not(.new-project)");
    if (projectButton) {
      document.querySelectorAll(".project-row").forEach((item) => item.classList.remove("active"));
      projectButton.classList.add("active");
    }
  });

  const researchToggle = document.querySelector("#researchToggle");
  if (researchToggle) {
    researchToggle.addEventListener("click", () => {
      const active = researchToggle.getAttribute("aria-pressed") === "true";
      researchToggle.setAttribute("aria-pressed", String(!active));
      showToast(!active ? "Deep Research on" : "Deep Research off");
    });
  }

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      const searchInput = document.querySelector("#searchInput");
      if (searchInput) {
        searchInput.focus();
      }
    }
  });

  const commandForm = document.querySelector("#commandForm");
  if (commandForm) {
    commandForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.querySelector("#commandInput");
      const value = input.value.trim();
      showToast(value ? `Queued: ${value}` : "Ask studio-1 anything");
      input.value = "";
    });
  }
}
