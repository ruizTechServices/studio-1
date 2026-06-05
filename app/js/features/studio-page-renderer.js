import { icon } from "../core/icons.js";
import { escapeHtml } from "../core/formatters.js";

function renderStats(stats = []) {
  return stats.map((stat) => `
    <article class="studio-stat">
      <span>${escapeHtml(stat.label)}</span>
      <strong>${escapeHtml(stat.value)}</strong>
      <small>${escapeHtml(stat.meta || "")}</small>
    </article>
  `).join("");
}

function renderFilters(filters = []) {
  return filters.map((filter, index) => `
    <button class="${index === 0 ? "active" : ""}" type="button" data-studio-filter="${escapeHtml(filter.value)}" aria-pressed="${index === 0 ? "true" : "false"}">
      ${escapeHtml(filter.label)}
    </button>
  `).join("");
}

function valueMarkup(value) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return `<span class="studio-muted">None detected</span>`;
    }
    return `<div class="studio-chip-list">${value.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
  }

  return escapeHtml(value ?? "Not available");
}

function renderInspector(row, config) {
  const target = document.querySelector("#studioInspector");
  if (!target) {
    return;
  }

  if (!row) {
    target.innerHTML = `
      <div class="studio-inspector-empty">
        <span>${icon(config.iconName || "folder")}</span>
        <p>${escapeHtml(config.emptyInspector || "Select a row to inspect the source data.")}</p>
      </div>
    `;
    return;
  }

  const details = (row.details || []).map((detail) => `
    <div class="studio-detail-row">
      <span>${escapeHtml(detail.label)}</span>
      <strong>${valueMarkup(detail.value)}</strong>
    </div>
  `).join("");

  const timeline = (row.timeline || []).map((item) => `
    <li class="studio-timeline-item ${item.level ? `log-${escapeHtml(item.level)}` : ""}">
      <span>${escapeHtml(item.meta || "")}</span>
      <strong>${escapeHtml(item.label)}</strong>
      ${item.message ? `<small>${escapeHtml(item.message)}</small>` : ""}
    </li>
  `).join("");

  const evidence = (row.evidence || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  target.innerHTML = `
    <div class="studio-inspector-head">
      <span class="studio-icon-tile">${icon(row.iconName || config.iconName || "folder")}</span>
      <div>
        <h2>${escapeHtml(row.inspectorTitle || row.title)}</h2>
        <p>${escapeHtml(row.inspectorSubtitle || row.subtitle || "")}</p>
      </div>
    </div>
    ${details ? `<div class="studio-detail-list">${details}</div>` : ""}
    ${timeline ? `
      <div class="studio-inspector-section">
        <h3>${escapeHtml(row.timelineTitle || "Timeline")}</h3>
        <ol class="studio-timeline">${timeline}</ol>
      </div>
    ` : ""}
    ${evidence ? `
      <div class="studio-inspector-section">
        <h3>${escapeHtml(row.evidenceTitle || "Evidence")}</h3>
        <ul class="studio-evidence-list">${evidence}</ul>
      </div>
    ` : ""}
  `;
}

function matchesRow(row, query, filter) {
  const filterKeys = row.filterKeys || ["all"];
  const filterMatches = filter === "all" || filterKeys.includes(filter);
  const searchMatches = !query || String(row.searchText || `${row.title} ${row.subtitle} ${row.status} ${row.meta}`).toLowerCase().includes(query);
  return filterMatches && searchMatches;
}

function renderRows(rows = []) {
  return rows.map((row, index) => `
    <button class="studio-table-row ${index === 0 ? "active" : ""}" type="button" data-studio-row="${escapeHtml(row.id)}" data-studio-search="${escapeHtml(row.searchText || "")}">
      <span class="studio-row-main">
        <strong>${escapeHtml(row.title)}</strong>
        <small>${escapeHtml(row.subtitle || "")}</small>
      </span>
      <span class="studio-status">${escapeHtml(row.status || "Detected")}</span>
      <span class="studio-row-tags">
        ${(row.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </span>
      <span class="studio-row-meta">${escapeHtml(row.meta || "")}</span>
    </button>
  `).join("");
}

export function renderStudioLoading(target, title) {
  if (!target) return;
  target.innerHTML = `
    <section class="studio-page-state">
      <span>${icon("refresh")}</span>
      <h1>${escapeHtml(title)}</h1>
      <p>Loading real workspace data...</p>
    </section>
  `;
}

export function renderStudioError(target, title, message) {
  if (!target) return;
  target.innerHTML = `
    <section class="studio-page-state">
      <span>${icon("database")}</span>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

export function renderStudioPage(target, config) {
  if (!target) return;

  const rows = config.rows || [];
  const filters = config.filters?.length ? config.filters : [{ label: "All", value: "all" }];
  const firstRow = rows[0] || null;

  target.style.setProperty("--studio-accent", config.accent || "#3b82f6");
  target.innerHTML = `
    <header class="studio-page-hero">
      <div>
        <h1>${escapeHtml(config.title)}</h1>
        <p>${escapeHtml(config.subtitle)}</p>
      </div>
      ${config.notice ? `<aside class="studio-page-notice"><strong>${escapeHtml(config.notice.title)}</strong><span>${escapeHtml(config.notice.message)}</span></aside>` : ""}
    </header>

    <section class="studio-stats" aria-label="${escapeHtml(config.title)} stats">
      ${renderStats(config.stats)}
    </section>

    <section class="studio-board" aria-label="${escapeHtml(config.title)} workspace">
      <div class="studio-board-main">
        <div class="studio-toolbar">
          <div class="studio-tabs" role="group" aria-label="${escapeHtml(config.title)} filters">
            ${renderFilters(filters)}
          </div>
          <label class="studio-search">
            ${icon("search")}
            <input type="search" placeholder="${escapeHtml(config.searchPlaceholder || "Filter rows...")}" data-studio-search-input>
          </label>
        </div>

        <div class="studio-table" aria-label="${escapeHtml(config.title)} rows">
          <div class="studio-table-head">
            <span>${escapeHtml(config.columns?.[0] || "Name")}</span>
            <span>${escapeHtml(config.columns?.[1] || "State")}</span>
            <span>${escapeHtml(config.columns?.[2] || "Signals")}</span>
            <span>${escapeHtml(config.columns?.[3] || "Meta")}</span>
          </div>
          <div class="studio-table-body" data-studio-table-body>
            ${rows.length ? renderRows(rows) : ""}
          </div>
          <div class="studio-table-empty" data-studio-empty ${rows.length ? "hidden" : ""}>
            <span>${icon(config.iconName || "folder")}</span>
            <p>${escapeHtml(config.emptyMessage || "No real records found yet.")}</p>
          </div>
        </div>
      </div>

      <aside class="studio-inspector" id="studioInspector" aria-label="${escapeHtml(config.title)} inspector"></aside>
    </section>
  `;

  const rowMap = new Map(rows.map((row) => [String(row.id), row]));
  let activeFilter = filters[0]?.value || "all";
  let selectedId = firstRow?.id ? String(firstRow.id) : null;

  const syncRows = () => {
    const query = target.querySelector("[data-studio-search-input]")?.value.trim().toLowerCase() || "";
    const rowButtons = Array.from(target.querySelectorAll("[data-studio-row]"));
    let firstVisible = null;

    rowButtons.forEach((button) => {
      const row = rowMap.get(button.dataset.studioRow);
      const visible = row ? matchesRow(row, query, activeFilter) : false;
      button.hidden = !visible;
      if (visible && !firstVisible) {
        firstVisible = row;
      }
    });

    const selectedRow = selectedId ? rowMap.get(selectedId) : null;
    if (!selectedRow || !matchesRow(selectedRow, query, activeFilter)) {
      selectedId = firstVisible?.id ? String(firstVisible.id) : null;
    }

    rowButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.studioRow === selectedId);
    });

    const visibleCount = rowButtons.filter((button) => !button.hidden).length;
    const empty = target.querySelector("[data-studio-empty]");
    if (empty) {
      empty.hidden = visibleCount > 0;
      const copy = empty.querySelector("p");
      if (copy) {
        copy.textContent = rows.length ? "No rows match the current filter." : (config.emptyMessage || "No real records found yet.");
      }
    }

    renderInspector(selectedId ? rowMap.get(selectedId) : null, config);
  };

  target.querySelectorAll("[data-studio-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.studioFilter;
      target.querySelectorAll("[data-studio-filter]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      syncRows();
    });
  });

  target.querySelector("[data-studio-search-input]")?.addEventListener("input", syncRows);

  target.querySelector("[data-studio-table-body]")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-studio-row]");
    if (!button) return;
    selectedId = button.dataset.studioRow;
    syncRows();
  });

  syncRows();
}
