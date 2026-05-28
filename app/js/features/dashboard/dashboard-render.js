import { icon, studioLogo } from "../../core/icons.js";
import { kpis, subProjects, specs, agents, quickCreate, savedPrompts, activities, tasks, health } from "../../data/dashboard-data.js";

export function renderKpis() {
  const kpiStrip = document.querySelector("#kpiStrip");
  if (!kpiStrip) {
    return;
  }

  kpiStrip.innerHTML = kpis.map((item) => `
    <article class="kpi-card">
      <span class="kpi-label">${item.label}</span>
      <span class="kpi-value">${item.value}</span>
      <span class="kpi-meta text-${item.color}">${item.meta}</span>
    </article>
  `).join("");
}

function header(title, viewAll = true) {
  return `<div class="card-header">
    <h2>${title}</h2>
    ${viewAll ? `<button class="view-link" type="button" data-toast="${title} view">View all</button>` : ""}
  </div>`;
}

function activeProjectsCard() {
  return `<article class="panel row-one" id="projects">
    ${header("Active Projects")}
    <div class="featured-project">
      <div class="feature-title">
        <span class="icon-tile" style="--tile-color:#3b82f6">${studioLogo("mini-logo-svg")}</span>
        <div>
          <div class="title-row">
            <span class="item-title">studio-1</span>
            <span class="badge">Featured</span>
          </div>
          <div class="item-subtitle">AI-powered dev command center for solo builders.</div>
        </div>
      </div>
      <div class="progress-block">
        <div class="progress-meta"><span>Progress</span><span>68%</span></div>
        <div class="progress-track"><span class="progress-fill" style="width:68%;--bar-color:#3b82f6"></span></div>
      </div>
      <div class="feature-stats">
        <div class="stat-box"><span class="stat-label">Specs</span><span class="stat-value">12</span></div>
        <div class="stat-box"><span class="stat-label">Tasks</span><span class="stat-value">24/36</span></div>
        <div class="stat-box"><span class="stat-label">Agents</span><span class="stat-value">2</span></div>
        <div class="stat-box"><span class="stat-label">Updated</span><span class="stat-value">2h ago</span></div>
      </div>
    </div>
    <div class="compact-list sub-project-list">
      ${subProjects.map((item) => `
        <div class="sub-project-row">
          <span class="small-icon" style="--tile-color:${item.color}">${icon(item.icon)}</span>
          <span class="item-title">${item.title}</span>
          <span class="mini-percent">${item.value}%</span>
          <span class="progress-track"><span class="progress-fill" style="width:${item.value}%;--bar-color:${item.color}"></span></span>
          <span class="row-action">${icon("chevron-right")}</span>
        </div>
      `).join("")}
    </div>
    <button class="ghost-button" type="button" data-toast="Create project">${icon("plus")} New Project</button>
  </article>`;
}

function recentSpecsCard() {
  return `<article class="panel row-one" id="specs">
    ${header("Recent Specs")}
    <div class="compact-list">
      ${specs.map(([title, sub, version, iconName, color]) => `
        <div class="list-row">
          <span class="icon-tile" style="--tile-color:${color}">${icon(iconName)}</span>
          <div>
            <div class="item-title">${title}</div>
            <div class="item-subtitle">${sub}</div>
          </div>
          <span class="version">${version}</span>
        </div>
      `).join("")}
    </div>
  </article>`;
}

function agentsCard() {
  return `<article class="panel row-one" id="agents">
    ${header("Running Agents")}
    <div class="compact-list">
      ${agents.map(([title, sub, value, iconName, color]) => `
        <div class="list-row agent-row">
          <span class="icon-tile" style="--tile-color:${color}">${icon(iconName)}</span>
          <div>
            <div class="item-title">${title}</div>
            <div class="item-subtitle">${sub}</div>
          </div>
          <span class="ring" style="--value:${value};--ring-color:${color}"><span>${value}%</span></span>
        </div>
      `).join("")}
    </div>
    <button class="ghost-button" type="button" data-toast="Create agent">${icon("plus")} New Agent</button>
  </article>`;
}

function quickCreateCard() {
  return `<article class="panel row-one" id="workflows">
    ${header("Quick Create", false)}
    <div class="compact-list">
      ${quickCreate.map(([title, sub, iconName, color]) => `
        <button class="quick-row" type="button" data-toast="${title}">
          <span class="icon-tile" style="--tile-color:${color}">${icon(iconName)}</span>
          <span>
            <span class="item-title">${title}</span>
            <span class="item-subtitle">${sub}</span>
          </span>
          ${icon("chevron-right")}
        </button>
      `).join("")}
    </div>
  </article>`;
}

function savedPromptsCard() {
  return `<article class="panel" id="memory">
    ${header("Saved Prompts")}
    <div class="compact-list">
      ${savedPrompts.map((title) => `
        <div class="list-row prompt-row">
          <span class="small-icon">${icon("clipboard")}</span>
          <span class="item-title">${title}</span>
          <span class="tag">prompt</span>
        </div>
      `).join("")}
    </div>
    <button class="ghost-button" type="button" data-toast="Create prompt">${icon("plus")} New Prompt</button>
  </article>`;
}

function activityCard() {
  return `<article class="panel" id="files">
    ${header("Recent Activity")}
    <div class="compact-list">
      ${activities.map(([subject, action, time, iconName, color]) => `
        <div class="activity-row">
          <span class="small-icon" style="--tile-color:${color}">${icon(iconName)}</span>
          <p class="activity-copy"><strong>${subject}</strong> <span>${action}</span></p>
          <span class="time">${time}</span>
        </div>
      `).join("")}
    </div>
  </article>`;
}

function tasksCard() {
  return `<article class="panel">
    ${header("Upcoming Tasks")}
    <div class="compact-list">
      ${tasks.map(([title, due, priority, color]) => `
        <div class="task-row">
          <span class="small-icon">${icon("clipboard")}</span>
          <p class="task-copy"><span class="task-title">${title}</span><span class="due">${due}</span></p>
          <span class="priority" style="--priority-color:${color}">${priority}</span>
        </div>
      `).join("")}
    </div>
  </article>`;
}

function healthCard() {
  return `<article class="panel health-panel" id="settings">
    ${header("Project Health", false)}
    <div class="health-gauge">
      <svg viewBox="0 0 180 108" aria-hidden="true">
        <defs>
          <linearGradient id="gaugeGradient" x1="20" x2="160" y1="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stop-color="#10b981"/>
            <stop offset="1" stop-color="#22c55e"/>
          </linearGradient>
        </defs>
        <path class="gauge-track" pathLength="100" d="M25 88a65 65 0 0 1 130 0"/>
        <path class="gauge-value" pathLength="100" stroke-dasharray="82 100" d="M25 88a65 65 0 0 1 130 0"/>
      </svg>
      <div class="gauge-score"><strong>82</strong><span>Excellent</span></div>
    </div>
    <div class="health-list">
      ${health.map(([label, value]) => `
        <div class="health-row">
          <span class="check-dot">${icon("check")}</span>
          <span>${label}</span>
          <span class="metric-value">${value}</span>
          <span class="tiny-link">${icon("link")}</span>
        </div>
      `).join("")}
    </div>
    <button class="ghost-button" type="button" data-toast="Health report">View Report</button>
  </article>`;
}

export function renderDashboard() {
  const dashboardGrid = document.querySelector("#dashboardGrid");
  if (!dashboardGrid) {
    return;
  }

  dashboardGrid.innerHTML = [
    activeProjectsCard(),
    recentSpecsCard(),
    agentsCard(),
    quickCreateCard(),
    savedPromptsCard(),
    activityCard(),
    tasksCard(),
    healthCard()
  ].join("");
}
