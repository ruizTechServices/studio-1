import { icon } from "../../core/icons.js";
import { escapeHtml, formatBytes, formatEventTime } from "../../core/formatters.js";
import { repoState } from "./repo-state.js";
import { logEvent } from "./repo-events.js";

export function categoryLabel(category) {
  const labels = {
    components: "Components",
    pagesRoutes: "Pages / Routes",
    apiEndpoints: "API Endpoints",
    functions: "Functions",
    classes: "Classes",
    databaseFiles: "Database",
    authLogic: "Auth",
    paymentLogic: "Payments",
    aiLogic: "AI",
    configFiles: "Config",
    documentation: "Docs",
    tests: "Tests",
    problemsTodos: "Problems / TODOs",
    other: "Other"
  };
  return labels[category] || category;
}

export function categoryAccent(category) {
  const accents = {
    components: "#3b82f6",
    pagesRoutes: "#8b5cf6",
    apiEndpoints: "#06b6d4",
    functions: "#10b981",
    databaseFiles: "#f59e0b",
    authLogic: "#22c55e",
    paymentLogic: "#ef4444",
    aiLogic: "#ec4899",
    configFiles: "#94a3b8",
    documentation: "#60a5fa",
    tests: "#84cc16",
    other: "#64748b"
  };
  return accents[category] || "#64748b";
}

export function renderRepoList(repos) {
  const repoList = document.querySelector("#repoList");
  if (!repoList) {
    return;
  }

  if (!repos.length) {
    repoList.innerHTML = `
      <div class="empty-repo-state">
        <span>${icon("folder")}</span>
        <p>No uploaded repos yet.</p>
      </div>
    `;
    renderRepoDetail(null);
    return;
  }

  repoList.innerHTML = repos.map((repo, index) => `
    <button class="repo-row ${index === 0 ? "active" : ""}" type="button" data-repo-id="${escapeHtml(repo.id)}">
      <span class="repo-row-icon">${icon("folder")}</span>
      <span>
        <strong>${escapeHtml(repo.name)}</strong>
        <small>${repo.totalFiles} files · ${formatBytes(repo.totalBytes)}</small>
      </span>
      <span class="repo-row-arrow">${icon("chevron-right")}</span>
    </button>
  `).join("");

  renderRepoDetail(repos[0], { log: false });
}

export function renderRepoDetail(repo, options = {}) {
  const detail = document.querySelector("#repoDetail");
  if (!detail) {
    return;
  }

  if (!repo) {
    detail.innerHTML = `
      <div class="repo-detail-empty">
        <span>${icon("spark")}</span>
        <h2>Upload a repo to inspect its contents.</h2>
      </div>
    `;
    return;
  }

  const categories = Object.entries(repo.categories || {})
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => `
      <div class="repo-category-pill" style="--category-color:${categoryAccent(category)}">
        <span></span>
        <strong>${count}</strong>
        ${escapeHtml(categoryLabel(category))}
      </div>
    `).join("");

  const files = (repo.files || []).slice(0, 80).map((file) => `
    <div class="repo-file-row">
      <span class="repo-file-icon" style="--category-color:${categoryAccent(file.category)}">${icon("file")}</span>
      <span class="repo-file-path">${escapeHtml(file.path)}</span>
      <span class="repo-file-meta">${escapeHtml(categoryLabel(file.category))}</span>
      <span class="repo-file-size">${formatBytes(file.sizeBytes)}</span>
    </div>
  `).join("");

  detail.innerHTML = `
    <div class="repo-detail-head">
      <div>
        <h2>${escapeHtml(repo.name)}</h2>
        <p>${repo.totalFiles} files saved to SQLite · ${formatBytes(repo.totalBytes)}</p>
      </div>
      <div class="repo-detail-actions">
        <span class="repo-saved-badge">${icon("database")} Saved</span>
        <button class="repo-delete-btn" id="deleteRepoBtn" type="button" data-delete-repo-id="${escapeHtml(repo.id)}" data-delete-repo-name="${escapeHtml(repo.name)}">
          ${icon("trash")}
          Delete
        </button>
      </div>
    </div>
    <div class="repo-category-grid">${categories}</div>
    <div class="repo-file-table">
      <div class="repo-file-table-head">
        <span>Path</span>
        <span>Category</span>
        <span>Size</span>
      </div>
      ${files}
    </div>
  `;

  if (options.log !== false) {
    logEvent({
      level: "success",
      area: "repo_map",
      source: "ui",
      phase: "display",
      action: "repo_displayed",
      message: `${repo.name} displayed in Repo Map.`,
      details: {
        totalFiles: repo.totalFiles,
        totalBytes: repo.totalBytes
      },
      entity: { type: "repo", id: repo.id, name: repo.name },
      correlationId: options.correlationId || null
    });
  }
}

function eventMatchesFilter(event, filter) {
  if (filter === "all") {
    return true;
  }

  return event.level === filter;
}

export function actionLogRows(events, emptyMessage) {
  if (!events.length) {
    return `
      <div class="action-log-empty">
        <span>${icon("message")}</span>
        <p>${escapeHtml(emptyMessage)}</p>
      </div>
    `;
  }

  return events.map((event) => {
    const details = event.details ? JSON.stringify(event.details, null, 2) : "";
    return `
      <details class="action-log-row log-${escapeHtml(event.level)}">
        <summary>
          <span class="log-level">${escapeHtml(event.level)}</span>
          <span class="log-time">${formatEventTime(event.timestamp)}</span>
          <span class="log-action">${escapeHtml(event.action)}</span>
          <span class="log-message">${escapeHtml(event.message)}</span>
        </summary>
        <div class="log-meta">
          <span>${escapeHtml(event.area)}</span>
          <span>${escapeHtml(event.source)}</span>
          <span>${escapeHtml(event.phase)}</span>
          ${event.entity?.name ? `<span>${escapeHtml(event.entity.name)}</span>` : ""}
        </div>
        ${details ? `<pre>${escapeHtml(details)}</pre>` : ""}
      </details>
    `;
  }).join("");
}

export function renderActionLogPanel(targetId, events, emptyMessage) {
  const target = document.querySelector(`#${targetId}`);
  if (!target) {
    return;
  }

  const activeFilter = repoState.actionLogFilters[targetId] || "all";
  const filteredEvents = events.filter((event) => eventMatchesFilter(event, activeFilter)).slice(0, 24);
  const filters = [
    ["all", "All"],
    ["error", "Errors"],
    ["warning", "Warnings"],
    ["success", "Success"]
  ];

  target.innerHTML = `
    <div class="action-log-filters">
      ${filters.map(([value, label]) => `
        <button class="${activeFilter === value ? "active" : ""}" type="button" data-action-log="${targetId}" data-action-log-filter="${value}">
          ${escapeHtml(label)}
        </button>
      `).join("")}
    </div>
    <div class="action-log-list">
      ${actionLogRows(filteredEvents, emptyMessage)}
    </div>
  `;
}

export function renderProjectMap(data) {
  const panel = document.querySelector("#projectMapPanel");
  if (!panel) {
    return;
  }

  if (!data) {
    panel.innerHTML = "";
    return;
  }

  const { repo, summary, sections } = data;

  const langTags = summary.primaryLanguages
    .map((lang) => `<span class="project-map-lang-tag">${escapeHtml(lang)}</span>`)
    .join("");

  const sectionItems = Object.entries(sections)
    .filter(([, files]) => files.length > 0)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([category, files]) => {
      const fileRows = files
        .map(
          (file) => `
          <div class="project-map-file-row">
            <span class="repo-file-icon" style="--category-color:${categoryAccent(category)}">${icon("file")}</span>
            <span class="project-map-file-path">${escapeHtml(file.path)}</span>
            <span class="project-map-file-size">${formatBytes(file.sizeBytes)}</span>
          </div>`
        )
        .join("");

      return `
        <details class="project-map-section">
          <summary>
            <span class="project-map-section-dot" style="background:${categoryAccent(category)}"></span>
            <strong>${escapeHtml(categoryLabel(category))}</strong>
            <span class="project-map-section-count">${files.length}</span>
          </summary>
          <div class="project-map-file-list">${fileRows}</div>
        </details>`;
    })
    .join("");

  panel.innerHTML = `
    <div class="project-map-head">
      <div>
        <h2 id="projectMapTitle">Project Map</h2>
        <p>${escapeHtml(repo.name)} · ${repo.totalFiles} files</p>
      </div>
      ${langTags.length ? `<div class="project-map-langs">${langTags}</div>` : ""}
    </div>
    <div class="project-map-sections">
      ${sectionItems || `<p class="project-map-empty">No categorized files found.</p>`}
    </div>
  `;
}

export function renderActionLogs() {
  renderActionLogPanel(
    "repoActionLog",
    repoState.actionEvents.filter((event) => event.area === "repo_map"),
    "Repo map events will appear here."
  );
  renderActionLogPanel("globalActionLog", repoState.actionEvents, "App-wide events will appear here.");
}
