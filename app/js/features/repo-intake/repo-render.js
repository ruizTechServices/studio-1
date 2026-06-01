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

export function renderProjectSummary(data) {
  const panel = document.querySelector("#projectSummaryPanel");
  if (!panel) {
    return;
  }

  if (!data) {
    panel.innerHTML = "";
    return;
  }

  const { repo, summary } = data;
  const {
    projectType,
    confidence,
    primaryLanguage,
    frameworks,
    mainAreas,
    detectedCapabilities,
    missingOrLightAreas,
    evidence
  } = summary;

  const confidenceClass = confidence === "high" ? "confidence-high" : confidence === "medium" ? "confidence-medium" : "confidence-low";

  const frameworkTags = frameworks.length
    ? frameworks.map((f) => `<span class="project-summary-tag">${escapeHtml(f)}</span>`).join("")
    : `<span class="project-summary-tag-empty">None detected</span>`;

  const capabilitiesList = detectedCapabilities.length
    ? detectedCapabilities.map((c) => `<li class="project-summary-cap">${icon("check")} ${escapeHtml(c)}</li>`).join("")
    : `<li class="project-summary-empty-item">No capabilities detected</li>`;

  const missingList = missingOrLightAreas.length
    ? missingOrLightAreas.map((m) => `<li class="project-summary-missing">${icon("warning")} ${escapeHtml(m)}</li>`).join("")
    : `<li class="project-summary-empty-item">Nothing obviously missing</li>`;

  const mainAreasList = mainAreas.length
    ? mainAreas.map((a) => `<span class="project-summary-area-tag">${escapeHtml(a)}</span>`).join("")
    : `<span class="project-summary-tag-empty">—</span>`;

  const evidenceRows = evidence.length
    ? evidence.map((e) => `<li>${escapeHtml(e)}</li>`).join("")
    : "";

  panel.innerHTML = `
    <div class="project-summary-head">
      <div>
        <h2 id="projectSummaryTitle">Project Summary</h2>
        <p>${escapeHtml(repo.name)}</p>
      </div>
      <span class="project-summary-confidence ${confidenceClass}">${escapeHtml(confidence)} confidence</span>
    </div>

    <div class="project-summary-type">
      <span class="project-summary-type-label">Project type</span>
      <strong class="project-summary-type-value">${escapeHtml(projectType)}</strong>
    </div>

    <div class="project-summary-row">
      <div class="project-summary-block">
        <span class="project-summary-block-label">Primary language</span>
        <span class="project-summary-tag">${primaryLanguage ? escapeHtml(primaryLanguage) : "—"}</span>
      </div>
      <div class="project-summary-block">
        <span class="project-summary-block-label">Frameworks</span>
        <div class="project-summary-tags">${frameworkTags}</div>
      </div>
      <div class="project-summary-block">
        <span class="project-summary-block-label">Main areas</span>
        <div class="project-summary-tags">${mainAreasList}</div>
      </div>
    </div>

    <div class="project-summary-row">
      <div class="project-summary-block project-summary-block--half">
        <span class="project-summary-block-label">Detected capabilities</span>
        <ul class="project-summary-list">${capabilitiesList}</ul>
      </div>
      <div class="project-summary-block project-summary-block--half">
        <span class="project-summary-block-label">Missing or light</span>
        <ul class="project-summary-list">${missingList}</ul>
      </div>
    </div>

    ${evidenceRows ? `
    <details class="project-summary-evidence">
      <summary>Evidence (${evidence.length})</summary>
      <ul class="project-summary-evidence-list">${evidenceRows}</ul>
    </details>` : ""}
  `;
}

const SYMBOL_COUNT_LABELS = {
  imports: "Imports",
  exports: "Exports",
  functions: "Functions",
  classes: "Classes",
  methods: "Methods",
  constants: "Constants",
  routeHandlers: "Routes",
  schemas: "Schemas"
};

const SYMBOL_BADGE_LABELS = {
  import: "import",
  export: "export",
  function: "fn",
  class: "class",
  method: "method",
  constant: "const",
  routeHandler: "route",
  schema: "schema"
};

export function renderSymbolMap(data) {
  const panel = document.querySelector("#symbolMapPanel");
  if (!panel) {
    return;
  }

  if (!data) {
    panel.innerHTML = "";
    return;
  }

  const { repo, summary, files } = data;

  const countPills = Object.entries(summary.counts)
    .filter(([, n]) => n > 0)
    .map(([key, n]) => `
      <div class="symbol-map-count-pill">
        <span class="symbol-badge symbol-badge--${escapeHtml(key)}">${escapeHtml(SYMBOL_COUNT_LABELS[key] || key)}</span>
        <strong>${n}</strong>
      </div>
    `).join("");

  const fileSections = files
    .map((file) => {
      const symbolRows = file.symbols.map((sym) => `
        <div class="symbol-row">
          <span class="symbol-badge symbol-badge--${escapeHtml(sym.type)}">${escapeHtml(SYMBOL_BADGE_LABELS[sym.type] || sym.type)}</span>
          <span class="symbol-name">${escapeHtml(sym.name)}</span>
          <span class="symbol-line">L${sym.line}</span>
        </div>
      `).join("");

      return `
        <details class="symbol-map-file">
          <summary>
            <span class="symbol-map-file-icon">${icon("file")}</span>
            <span class="symbol-map-file-path">${escapeHtml(file.path)}</span>
            <span class="symbol-map-file-lang">${escapeHtml(file.language)}</span>
            <span class="symbol-map-file-count">${file.symbols.length}</span>
          </summary>
          <div class="symbol-map-file-symbols">${symbolRows}</div>
        </details>
      `;
    }).join("");

  panel.innerHTML = `
    <div class="symbol-map-head">
      <div>
        <h2 id="symbolMapTitle">Symbol Map</h2>
        <p>${escapeHtml(repo.name)} · ${summary.totalFilesScanned} files scanned · ${summary.totalSymbols} symbols</p>
      </div>
    </div>
    ${countPills.length ? `<div class="symbol-map-counts">${countPills}</div>` : ""}
    <div class="symbol-map-files">
      ${fileSections || `<p class="symbol-map-empty">No symbols found in JS/TS files.</p>`}
    </div>
  `;
}

export function renderDependencyMap(data) {
  const panel = document.querySelector("#dependencyMapPanel");
  if (!panel) return;

  if (!data) {
    panel.innerHTML = "";
    return;
  }

  const { repo, summary, files, mostImportedInternal, mostImportedExternal, orphans } = data;

  const statPills = [
    { label: "Files scanned", value: summary.totalFilesScanned },
    { label: "Import edges", value: summary.totalEdges },
    { label: "Resolved", value: summary.resolvedEdges },
    { label: "Unresolved", value: summary.unresolvedEdges },
    { label: "No dependents", value: summary.orphanCount }
  ].map(({ label, value }) => `
    <div class="dep-map-stat-pill">
      <strong>${value}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");

  const internalRows = mostImportedInternal.length
    ? mostImportedInternal.map((f) => `
      <div class="dep-map-hub-row">
        <span class="dep-map-hub-count">${f.importedByCount}</span>
        <span class="dep-map-hub-path">${escapeHtml(f.path)}</span>
      </div>
    `).join("")
    : `<p class="dep-map-empty">No internal imports resolved.</p>`;

  const externalRows = mostImportedExternal.length
    ? mostImportedExternal.map((e) => `
      <div class="dep-map-hub-row">
        <span class="dep-map-hub-count">${e.count}</span>
        <span class="dep-map-hub-path dep-map-hub-external">${escapeHtml(e.name)}</span>
      </div>
    `).join("")
    : `<p class="dep-map-empty">No external modules detected.</p>`;

  const fileSections = files.map((file) => {
    const displayImports = file.imports.slice(0, 20);
    const overflow = file.imports.length - displayImports.length;
    const importRows = displayImports.map((imp) => `
      <div class="dep-map-import-row">
        <span class="dep-map-import-badge ${imp.resolved ? "dep-map-resolved" : "dep-map-unresolved"}">${imp.resolved ? "local" : "ext"}</span>
        <span class="dep-map-import-source">${escapeHtml(imp.source)}</span>
        ${imp.resolvedPath ? `<span class="dep-map-import-resolved">${escapeHtml(imp.resolvedPath)}</span>` : ""}
      </div>
    `).join("");

    return `
      <details class="dep-map-file">
        <summary>
          <span class="dep-map-file-icon">${icon("file")}</span>
          <span class="dep-map-file-path">${escapeHtml(file.path)}</span>
          <span class="dep-map-file-count">${file.importCount}</span>
          ${file.importedBy.length ? `<span class="dep-map-file-imported-by">${file.importedBy.length} dependents</span>` : ""}
        </summary>
        <div class="dep-map-file-imports">
          ${importRows}
          ${overflow > 0 ? `<p class="dep-map-overflow">+${overflow} more imports</p>` : ""}
        </div>
      </details>
    `;
  }).join("");

  const orphanList = orphans.length
    ? orphans.map((p) => `<span class="dep-map-orphan-path">${escapeHtml(p)}</span>`).join("")
    : "";

  panel.innerHTML = `
    <div class="dep-map-head">
      <div>
        <h2 id="dependencyMapTitle">Dependency Map</h2>
        <p>${escapeHtml(repo.name)} · ${summary.totalFilesScanned} JS/TS files scanned</p>
      </div>
    </div>

    <div class="dep-map-stats">${statPills}</div>

    <div class="dep-map-sections">
      <details class="dep-map-section" open>
        <summary><strong>Most imported (internal)</strong><span class="dep-map-section-count">${mostImportedInternal.length}</span></summary>
        <div class="dep-map-hub-list">${internalRows}</div>
      </details>

      <details class="dep-map-section">
        <summary><strong>Most imported (external)</strong><span class="dep-map-section-count">${mostImportedExternal.length}</span></summary>
        <div class="dep-map-hub-list">${externalRows}</div>
      </details>

      ${orphanList ? `
      <details class="dep-map-section">
        <summary><strong>No dependents</strong><span class="dep-map-section-count">${orphans.length}</span></summary>
        <div class="dep-map-orphan-list">${orphanList}</div>
      </details>` : ""}
    </div>

    <div class="dep-map-files">
      ${fileSections || `<p class="dep-map-empty">No import statements found in JS/TS files.</p>`}
    </div>
  `;
}

const BEHAVIOR_LABELS = {
  eventListener: "Event Listener",
  networkCall: "Network Call",
  asyncFlow: "Async / Await",
  domMutation: "DOM Mutation",
  formHandling: "Form / Input",
  navigationFlow: "Navigation",
  crudCreate: "Create",
  crudRead: "Read / Query",
  crudUpdate: "Update",
  crudDelete: "Delete",
  storageOp: "Storage",
  authOp: "Auth",
  errorHandling: "Error Handling",
  timerBased: "Timer",
  fileOp: "File / IO"
};

export function renderBehaviorMap(data) {
  const panel = document.querySelector("#behaviorMapPanel");
  if (!panel) return;

  if (!data) {
    panel.innerHTML = "";
    return;
  }

  const { repo, summary, areas, files, notableFiles } = data;

  const statPills = [
    { label: "Files scanned", value: summary.totalFilesScanned },
    { label: "With behaviors", value: summary.totalFilesWithBehaviors },
    { label: "Total signals", value: summary.totalBehaviors }
  ].map(({ label, value }) => `
    <div class="behavior-stat-pill">
      <strong>${value}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");

  const topBehaviorRows = Object.entries(summary.behaviorCounts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `
      <div class="behavior-type-row">
        <span class="behavior-badge behavior-badge--${escapeHtml(type)}">${escapeHtml(BEHAVIOR_LABELS[type] || type)}</span>
        <strong class="behavior-count">${count}</strong>
      </div>
    `).join("");

  const activeAreaCount = Object.values(areas).filter((a) => a.total > 0).length;
  const areaRows = Object.entries(areas)
    .filter(([, a]) => a.total > 0)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([, a]) => `
      <div class="behavior-area-row">
        <span class="behavior-area-label">${escapeHtml(a.label)}</span>
        <span class="behavior-area-count">${a.total}</span>
        <div class="behavior-area-types">
          ${a.types.map((t) => `<span class="behavior-badge behavior-badge--${escapeHtml(t)}">${escapeHtml(BEHAVIOR_LABELS[t] || t)}</span>`).join("")}
        </div>
      </div>
    `).join("");

  const notableRows = notableFiles.map((f) => `
    <div class="behavior-notable-row">
      <span class="behavior-notable-path">${escapeHtml(f.path)}</span>
      <span class="behavior-notable-count">${f.totalBehaviors}</span>
      <div class="behavior-notable-types">
        ${f.topTypes.map((t) => `<span class="behavior-badge behavior-badge--${escapeHtml(t)}">${escapeHtml(BEHAVIOR_LABELS[t] || t)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  const fileSections = files.map((file) => {
    const signalBlocks = file.behaviors.map((b) => {
      const examples = b.examples.map((ex) => `
        <div class="behavior-example-row">
          <span class="behavior-example-line">L${ex.line}</span>
          <code class="behavior-example-snippet">${escapeHtml(ex.snippet)}</code>
        </div>
      `).join("");

      return `
        <div class="behavior-signal">
          <div class="behavior-signal-head">
            <span class="behavior-badge behavior-badge--${escapeHtml(b.type)}">${escapeHtml(b.label)}</span>
            <span class="behavior-signal-count">${b.count}</span>
          </div>
          ${examples ? `<div class="behavior-examples">${examples}</div>` : ""}
        </div>
      `;
    }).join("");

    return `
      <details class="behavior-file">
        <summary>
          <span class="behavior-file-icon">${icon("file")}</span>
          <span class="behavior-file-path">${escapeHtml(file.path)}</span>
          <span class="behavior-file-count">${file.totalBehaviors}</span>
        </summary>
        <div class="behavior-file-signals">${signalBlocks}</div>
      </details>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="behavior-map-head">
      <div>
        <h2 id="behaviorMapTitle">Behavior Map</h2>
        <p>${escapeHtml(repo.name)} · ${summary.totalFilesScanned} JS/TS files scanned</p>
      </div>
    </div>

    <div class="behavior-stats">${statPills}</div>

    <div class="behavior-sections">
      ${areaRows ? `
      <details class="behavior-section" open>
        <summary><strong>Behavior areas</strong><span class="behavior-section-count">${activeAreaCount}</span></summary>
        <div class="behavior-area-list">${areaRows}</div>
      </details>` : ""}

      ${topBehaviorRows ? `
      <details class="behavior-section">
        <summary><strong>Signal breakdown</strong><span class="behavior-section-count">${Object.values(summary.behaviorCounts).filter((n) => n > 0).length} types</span></summary>
        <div class="behavior-type-list">${topBehaviorRows}</div>
      </details>` : ""}

      ${notableRows ? `
      <details class="behavior-section">
        <summary><strong>Most active files</strong><span class="behavior-section-count">${notableFiles.length}</span></summary>
        <div class="behavior-notable-list">${notableRows}</div>
      </details>` : ""}
    </div>

    <div class="behavior-files">
      ${fileSections || `<p class="behavior-empty">No behavior signals found in JS/TS files.</p>`}
    </div>
  `;
}

const ALGORITHM_LABELS = {
  sorting: "Sorting",
  searching: "Searching",
  filtering: "Filtering",
  mapping: "Mapping / Transform",
  reduction: "Reduction / Accumulation",
  grouping: "Grouping / Aggregation",
  counting: "Counting / Scoring",
  validation: "Validation",
  parsing: "Parsing / Extraction",
  matching: "Matching / Resolution",
  errorHandling: "Error Handling",
  safetyGuard: "Safety Guard",
  fileProcessing: "File Processing",
  graphBuild: "Graph / Dependency",
  workflow: "State / Update Workflow",
  recursion: "Recursion (candidate)"
};

export function renderAlgorithmMap(data) {
  const panel = document.querySelector("#algorithmMapPanel");
  if (!panel) return;

  if (!data) {
    panel.innerHTML = "";
    return;
  }

  const { repo, summary, categories, files, notableFiles } = data;

  const statPills = [
    { label: "Files scanned", value: summary.totalFilesScanned },
    { label: "With signals", value: summary.totalFilesWithSignals },
    { label: "Total signals", value: summary.totalSignals }
  ].map(({ label, value }) => `
    <div class="algorithm-stat-pill">
      <strong>${value}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");

  const topSignalRows = Object.entries(summary.signalCounts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `
      <div class="algorithm-type-row">
        <span class="algorithm-badge algorithm-badge--${escapeHtml(type)}">${escapeHtml(ALGORITHM_LABELS[type] || type)}</span>
        <strong class="algorithm-count">${count}</strong>
      </div>
    `).join("");

  const activeCategoryCount = Object.values(categories).filter((c) => c.total > 0).length;
  const categoryRows = Object.entries(categories)
    .filter(([, c]) => c.total > 0)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([, c]) => `
      <div class="algorithm-category-row">
        <span class="algorithm-category-label">${escapeHtml(c.label)}</span>
        <span class="algorithm-category-count">${c.total}</span>
        <div class="algorithm-category-types">
          ${c.types.map((t) => `<span class="algorithm-badge algorithm-badge--${escapeHtml(t)}">${escapeHtml(ALGORITHM_LABELS[t] || t)}</span>`).join("")}
        </div>
      </div>
    `).join("");

  const notableRows = notableFiles.map((f) => `
    <div class="algorithm-notable-row">
      <span class="algorithm-notable-path">${escapeHtml(f.path)}</span>
      <span class="algorithm-notable-count">${f.totalSignals}</span>
      <div class="algorithm-notable-types">
        ${f.topTypes.map((t) => `<span class="algorithm-badge algorithm-badge--${escapeHtml(t)}">${escapeHtml(ALGORITHM_LABELS[t] || t)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  const fileSections = files.map((file) => {
    const signalBlocks = file.signals.map((s) => {
      const examples = s.examples.map((ex) => `
        <div class="algorithm-example-row">
          <span class="algorithm-example-line">L${ex.line}</span>
          <code class="algorithm-example-snippet">${escapeHtml(ex.snippet)}</code>
        </div>
      `).join("");

      return `
        <div class="algorithm-signal">
          <div class="algorithm-signal-head">
            <span class="algorithm-badge algorithm-badge--${escapeHtml(s.type)}">${escapeHtml(s.label)}</span>
            <span class="algorithm-signal-count">${s.count}</span>
          </div>
          ${examples ? `<div class="algorithm-examples">${examples}</div>` : ""}
        </div>
      `;
    }).join("");

    return `
      <details class="algorithm-file">
        <summary>
          <span class="algorithm-file-icon">${icon("file")}</span>
          <span class="algorithm-file-path">${escapeHtml(file.path)}</span>
          <span class="algorithm-file-count">${file.totalSignals}</span>
        </summary>
        <div class="algorithm-file-signals">${signalBlocks}</div>
      </details>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="algorithm-map-head">
      <div>
        <h2 id="algorithmMapTitle">Algorithm Map</h2>
        <p>${escapeHtml(repo.name)} · ${summary.totalFilesScanned} JS/TS files scanned</p>
      </div>
    </div>

    <div class="algorithm-stats">${statPills}</div>

    <div class="algorithm-sections">
      ${categoryRows ? `
      <details class="algorithm-section" open>
        <summary><strong>Algorithm categories</strong><span class="algorithm-section-count">${activeCategoryCount}</span></summary>
        <div class="algorithm-category-list">${categoryRows}</div>
      </details>` : ""}

      ${topSignalRows ? `
      <details class="algorithm-section">
        <summary><strong>Signal breakdown</strong><span class="algorithm-section-count">${Object.values(summary.signalCounts).filter((n) => n > 0).length} types</span></summary>
        <div class="algorithm-type-list">${topSignalRows}</div>
      </details>` : ""}

      ${notableRows ? `
      <details class="algorithm-section">
        <summary><strong>Most algorithmic files</strong><span class="algorithm-section-count">${notableFiles.length}</span></summary>
        <div class="algorithm-notable-list">${notableRows}</div>
      </details>` : ""}
    </div>

    <div class="algorithm-files">
      ${fileSections || `<p class="algorithm-empty">No algorithmic signals found in JS/TS files.</p>`}
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
