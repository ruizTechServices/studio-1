const iconPaths = {
  "arrow-left": '<path d="m14 6-6 6 6 6"/><path d="M20 12H8"/>',
  "arrow-right": '<path d="m10 6 6 6-6 6"/><path d="M4 12h12"/>',
  "arrow-up": '<path d="m12 19V5"/><path d="m5 12 7-7 7 7"/>',
  "bell": '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  "bot": '<path d="M12 8V4H8"/><rect x="5" y="8" width="14" height="10" rx="2"/><path d="M8 18v2"/><path d="M16 18v2"/><path d="M9 13h.01"/><path d="M15 13h.01"/>',
  "calendar": '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  "check": '<path d="m5 12 4 4L19 6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "clipboard": '<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><path d="M8 12h8"/><path d="M8 16h5"/>',
  "code": '<path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/>',
  "document": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/>',
  "eye": '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  "file": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  "folder": '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>',
  "home": '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  "layers": '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  "link": '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/>',
  "lock": '<rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  "message": '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8"/><path d="M8 13h5"/>',
  "paperclip": '<path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  "phone": '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  "plus": '<path d="M12 5v14"/><path d="M5 12h14"/>',
  "refresh": '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
  "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  "settings": '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 .9-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6.9h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
  "share": '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>',
  "spark": '<path d="M13 2 8.5 12H13l-2 10 5.5-12H12l1-8Z"/>',
  "workflow": '<path d="M6 4v6"/><path d="M18 14v6"/><rect x="3" y="10" width="6" height="6" rx="1.5"/><rect x="15" y="8" width="6" height="6" rx="1.5"/><path d="M9 13h2a3 3 0 0 0 3-3V8a4 4 0 0 1 4-4"/><path d="M15 11h-2a3 3 0 0 0-3 3v2a4 4 0 0 1-4 4"/>'
};

function icon(name, className = "") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.file}</svg>`;
}

function studioLogo(className = "") {
  return `<svg class="${className}" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M25.4 4.8 12.2 12.4v5.2l13.2-7.7 4.3 2.5v-5L25.4 4.8Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M10.6 31.2 23.8 23.6v-5.2l-13.2 7.7-4.3-2.5v5l4.3 2.6Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="m6.3 13 11.6-6.8M29.7 23 18.1 29.8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

const navItems = [
  ["Home", "home"],
  ["Projects", "folder"],
  ["Specs", "clipboard"],
  ["Agents", "bot"],
  ["Workflows", "workflow"],
  ["Memory", "layers"],
  ["Files", "file"],
  ["Settings", "settings"]
];

const projects = [
  ["studio-1", "spark", true],
  ["Acme SaaS", "folder", false],
  ["Marketing Site", "file", false],
  ["Mobile App", "phone", false],
  ["Internal Tools", "layers", false]
];

const kpis = [
  { label: "Projects", value: "6", meta: "2 active", color: "blue" },
  { label: "Specs", value: "18", meta: "6 updated", color: "green" },
  { label: "Agents", value: "4", meta: "2 running", color: "orange" },
  { label: "Workflows", value: "7", meta: "3 scheduled", color: "purple" }
];

const subProjects = [
  { title: "Marketing Site Redesign", icon: "clipboard", value: 45, color: "#3b82f6" },
  { title: "Mobile App v2", icon: "phone", value: 20, color: "#8b5cf6" },
  { title: "Internal Tools", icon: "workflow", value: 75, color: "#10b981" }
];

const specs = [
  ["Checkout Redesign", "Updated 2h ago", "v1.3", "document", "#8b5cf6"],
  ["User Authentication Flow", "Updated 5h ago", "v1.1", "file", "#10b981"],
  ["Data Dashboard Spec", "Updated yesterday", "v2.0", "clipboard", "#94a3b8"],
  ["AI Agent Orchestration", "Updated 2d ago", "v1.0", "workflow", "#10b981"],
  ["API Rate Limiting Plan", "Updated 3d ago", "v1.2", "spark", "#f59e0b"]
];

const agents = [
  ["Code Generator", "Implementing user auth...", 75, "document", "#3b82f6"],
  ["Test Runner", "Running test suite...", 45, "code", "#10b981"],
  ["Spec Writer", "Drafting API spec...", 60, "settings", "#ec4899"],
  ["Refactor Agent", "Optimizing components...", 30, "workflow", "#f59e0b"]
];

const quickCreate = [
  ["New Spec", "Define requirements", "document", "#3b82f6"],
  ["New Agent", "Create AI teammate", "bot", "#8b5cf6"],
  ["New Workflow", "Automate tasks", "workflow", "#f59e0b"],
  ["New Project", "Start from scratch", "folder", "#10b981"]
];

const savedPrompts = [
  "Code Review Checklist",
  "PRD Template",
  "Test Plan Generator",
  "UX Critique"
];

const activities = [
  ["Checkout Redesign", "spec updated", "2h ago", "document", "#3b82f6"],
  ["Code Generator", "agent started", "3h ago", "bot", "#06b6d4"],
  ["Test Runner", "completed", "5h ago", "code", "#84cc16"],
  ["User Authentication Flow", "created", "5h ago", "clipboard", "#eab308"],
  ["Refactor Agent", "completed", "1d ago", "workflow", "#22d3ee"]
];

const tasks = [
  ["Review API spec", "Due today", "High", "#ef4444"],
  ["User testing session", "Due tomorrow", "Medium", "#f59e0b"],
  ["Deploy to staging", "Due May 16", "Medium", "#f97316"],
  ["Performance audit", "Due May 18", "Low", "#3b82f6"]
];

const health = [
  ["Specs Coverage", "85%"],
  ["Test Coverage", "78%"],
  ["Task Completion", "62%"],
  ["Code Quality", "90%"]
];

const dashboardGrid = document.querySelector("#dashboardGrid");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderIconPlaceholders() {
  document.querySelectorAll("[data-icon]").forEach((target) => {
    target.innerHTML = icon(target.dataset.icon);
  });
  document.querySelector(".logo-mark").innerHTML = studioLogo();
}

function renderNav() {
  const nav = document.querySelector("#primaryNav");
  nav.innerHTML = navItems.map(([label, iconName], index) => `
    <button class="nav-item ${index === 0 ? "active" : ""}" type="button" data-nav="${label}" data-toast="${label}">
      ${icon(iconName)}
      <span>${label}</span>
    </button>
  `).join("");

  const projectNav = document.querySelector("#projectNav");
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

function renderKpis() {
  document.querySelector("#kpiStrip").innerHTML = kpis.map((item) => `
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
  return `<article class="panel row-one">
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
  return `<article class="panel row-one">
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
  return `<article class="panel row-one">
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
  return `<article class="panel row-one">
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
  return `<article class="panel">
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
  return `<article class="panel">
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
  return `<article class="panel health-panel">
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

function renderDashboard() {
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

function bindInteractions() {
  document.addEventListener("click", (event) => {
    const navButton = event.target.closest(".nav-item");
    if (navButton) {
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
      navButton.classList.add("active");
    }

    const projectButton = event.target.closest(".project-row:not(.new-project)");
    if (projectButton) {
      document.querySelectorAll(".project-row").forEach((item) => item.classList.remove("active"));
      projectButton.classList.add("active");
    }

    const toastTarget = event.target.closest("[data-toast]");
    if (toastTarget) {
      showToast(toastTarget.dataset.toast);
    }
  });

  const researchToggle = document.querySelector("#researchToggle");
  researchToggle.addEventListener("click", () => {
    const active = researchToggle.getAttribute("aria-pressed") === "true";
    researchToggle.setAttribute("aria-pressed", String(!active));
    showToast(!active ? "Deep Research on" : "Deep Research off");
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.querySelector("#searchInput").focus();
    }
  });

  document.querySelector("#commandForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#commandInput");
    const value = input.value.trim();
    showToast(value ? `Queued: ${value}` : "Ask studio-1 anything");
    input.value = "";
  });
}

renderIconPlaceholders();
renderNav();
renderKpis();
renderDashboard();
bindInteractions();
