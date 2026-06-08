import { fetchDashboardSummary } from "../studio-api.js";
import { renderKpis, renderKpiError } from "./dashboard-render.js";
import { icon } from "../../core/icons.js";
import { escapeHtml } from "../../core/formatters.js";
import { showToast } from "../../core/toast.js";

function projectIcon(project) {
  if (project.iconUrl) {
    return `<img class="project-logo" src="${escapeHtml(project.iconUrl)}" alt="">`;
  }

  return project.sourceType === "github_url_filtered" ? "code" : "folder";
}

function renderProjectNav(projects = []) {
  const projectNav = document.querySelector("#projectNav");
  if (!projectNav) {
    return;
  }

  projectNav.innerHTML = projects.map((project) => `
    <button class="project-row" type="button" data-project-id="${escapeHtml(project.id)}" title="${escapeHtml(project.name)}">
      ${project.iconUrl ? projectIcon(project) : icon(projectIcon(project))}
      <span>${escapeHtml(project.name)}</span>
    </button>
  `).join("") + `
    <a class="project-row new-project" href="./files.html">
      ${icon("plus")}
      <span>New Project</span>
    </a>
  `;
}

function renderProjectNavError() {
  const projectNav = document.querySelector("#projectNav");
  if (!projectNav) {
    return;
  }

  projectNav.innerHTML = `
    <p class="project-nav-error">Codebases unavailable</p>
    <a class="project-row new-project" href="./files.html">
      ${icon("plus")}
      <span>New Project</span>
    </a>
  `;
}

export function initDashboardPage() {
  renderKpis();
  fetchDashboardSummary()
    .then((data) => {
      renderKpis(data);
      renderProjectNav(data.projects?.projects);
    })
    .catch(() => {
      renderKpiError();
      renderProjectNavError();
    });

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
