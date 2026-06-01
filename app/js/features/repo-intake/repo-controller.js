import { repoState } from "./repo-state.js";
import { filterSelectedFiles } from "./repo-filters.js";
import { fetchRepos, uploadRepoFiles, importGithubRepo, deleteRepo, fetchFilterRules, fetchActionEvents, fetchProjectMap, fetchProjectSummary, fetchSymbolMap, fetchDependencyMap, fetchBehaviorMap, fetchAlgorithmMap, fetchRecoveryAssistant } from "./repo-api.js";
import { createClientId, logEvent, mergeActionEvents, setEventsUpdatedCallback } from "./repo-events.js";
import { renderRepoList, renderRepoDetail, renderProjectMap, renderProjectSummary, renderSymbolMap, renderDependencyMap, renderBehaviorMap, renderAlgorithmMap, renderRecoveryAssistant, renderActionLogs } from "./repo-render.js";
import { showToast } from "../../core/toast.js";
import { icon } from "../../core/icons.js";
import { escapeHtml } from "../../core/formatters.js";

export function initRepoIntakePage() {
  setEventsUpdatedCallback(renderActionLogs);

  const form = document.querySelector("#repoUploadForm");
  const input = document.querySelector("#repoFolderInput");
  const nameInput = document.querySelector("#repoNameInput");
  const urlInput = document.querySelector("#repoUrlInput");
  const status = document.querySelector("#repoUploadStatus");
  const filterStatus = document.querySelector("#repoFilterStatus");
  const refreshButton = document.querySelector("#refreshReposBtn");
  const githubImportButton = document.querySelector("#githubImportBtn");

  if (!form || !input || !status) {
    return;
  }

  input.addEventListener("change", () => {
    const files = Array.from(input.files || []);
    const filtered = filterSelectedFiles(files);
    const firstFolder = files[0]?.webkitRelativePath?.split("/")[0];

    if (firstFolder && !nameInput.value.trim()) {
      nameInput.value = firstFolder;
    }

    status.textContent = files.length ? `${filtered.kept.length} scannable files selected.` : "No repo selected.";

    if (filterStatus) {
      filterStatus.textContent = files.length
        ? `${filtered.skipped} files skipped before upload.`
        : "Filters skip dependency folders, build output, cache folders, and large files.";
    }

    if (files.length) {
      const repoName = nameInput.value.trim() || firstFolder || "uploaded-repo";
      const correlationId = createClientId("corr");
      input.dataset.correlationId = correlationId;

      logEvent({
        level: "info",
        area: "repo_map",
        source: "local_upload",
        phase: "input",
        action: "local_folder_selected",
        message: `${files.length} files selected from ${repoName}.`,
        details: { selectedFiles: files.length, repoName },
        entity: { type: "repo", id: null, name: repoName },
        correlationId
      });

      logEvent({
        level: "info",
        area: "repo_map",
        source: "local_upload",
        phase: "filter",
        action: "local_files_filtered",
        message: `${filtered.kept.length} scannable files selected. ${filtered.skipped} files skipped.`,
        details: { selectedFiles: files.length, keptFiles: filtered.kept.length, skippedFiles: filtered.skipped },
        entity: { type: "repo", id: null, name: repoName },
        correlationId
      });

      if (files.length > 1000 || filtered.skipped > 1000) {
        logEvent({
          level: "warning",
          area: "repo_map",
          source: "local_upload",
          phase: "filter",
          action: "local_file_count_high",
          message: `${files.length} selected files is a large local intake.`,
          details: { selectedFiles: files.length, skippedFiles: filtered.skipped },
          entity: { type: "repo", id: null, name: repoName },
          correlationId
        });
      }
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const files = Array.from(input.files || []);
    const filtered = filterSelectedFiles(files);

    if (!files.length) {
      status.textContent = "Choose a repo folder first.";
      logEvent({
        level: "warning",
        area: "repo_map",
        source: "local_upload",
        phase: "input",
        action: "local_upload_missing_files",
        message: "Upload was submitted without a selected repo folder."
      });
      return;
    }

    if (!filtered.kept.length) {
      status.textContent = "No scannable files left after filtering.";
      logEvent({
        level: "warning",
        area: "repo_map",
        source: "local_upload",
        phase: "filter",
        action: "local_upload_no_scannable_files",
        message: "No scannable files were left after frontend filtering.",
        details: { selectedFiles: files.length, skippedFiles: filtered.skipped },
        entity: { type: "repo", id: null, name: nameInput.value.trim() || "uploaded-repo" },
        correlationId: input.dataset.correlationId || null
      });
      return;
    }

    const correlationId = input.dataset.correlationId || createClientId("corr");
    const formData = new FormData();
    formData.append("repoName", nameInput.value.trim());
    formData.append("correlationId", correlationId);
    filtered.kept.forEach((file) => {
      formData.append("files", file, file.webkitRelativePath || file.name);
    });

    status.textContent = `Uploading ${filtered.kept.length} filtered files...`;
    logEvent({
      level: "info",
      area: "repo_map",
      source: "local_upload",
      phase: "upload",
      action: "local_upload_started",
      message: `Uploading ${filtered.kept.length} filtered files.`,
      details: { selectedFiles: files.length, keptFiles: filtered.kept.length, skippedFiles: filtered.skipped },
      entity: {
        type: "repo",
        id: null,
        name: nameInput.value.trim() || files[0]?.webkitRelativePath?.split("/")[0] || "uploaded-repo"
      },
      correlationId
    });

    try {
      const result = await uploadRepoFiles(formData);
      status.textContent = `${result.name} saved with ${result.totalFiles} files.`;
      form.reset();
      repoState.savedRepos = [result, ...repoState.savedRepos.filter((repo) => repo.id !== result.id)];
      renderRepoList(repoState.savedRepos);
      renderRepoDetail(result, { correlationId });
      loadAndRenderProjectMap(result.id);
      loadAndRenderProjectSummary(result.id);
      loadAndRenderSymbolMap(result.id);
      loadAndRenderDependencyMap(result.id);
      loadAndRenderBehaviorMap(result.id);
      loadAndRenderAlgorithmMap(result.id);
      loadAndRenderRecoveryAssistant(result.id);
      showToast("Repo saved to SQLite");
    } catch (error) {
      status.textContent = error.message;
      logEvent({
        level: "error",
        area: "repo_map",
        source: "local_upload",
        phase: "upload",
        action: "local_upload_failed",
        message: error.message,
        details: { selectedFiles: files.length, keptFiles: filtered.kept.length },
        correlationId
      });
    }
  });

  if (githubImportButton && urlInput) {
    urlInput.addEventListener("change", () => {
      const repoUrl = urlInput.value.trim();
      if (!repoUrl) {
        return;
      }

      logEvent({
        level: "info",
        area: "repo_map",
        source: "ui",
        phase: "input",
        action: "github_url_changed",
        message: "GitHub repo URL changed.",
        details: { repoUrl }
      });
    });

    githubImportButton.addEventListener("click", async () => {
      const repoUrl = urlInput.value.trim();

      if (!repoUrl) {
        status.textContent = "Enter a GitHub repo URL first.";
        logEvent({
          level: "warning",
          area: "repo_map",
          source: "ui",
          phase: "input",
          action: "github_import_missing_url",
          message: "GitHub import was clicked without a repo URL."
        });
        return;
      }

      const correlationId = createClientId("corr");
      status.textContent = "Cloning GitHub repo and applying filters...";
      logEvent({
        level: "info",
        area: "repo_map",
        source: "ui",
        phase: "input",
        action: "github_import_clicked",
        message: "GitHub import clicked.",
        details: { repoUrl },
        correlationId
      });

      try {
        const result = await importGithubRepo(repoUrl, correlationId);
        status.textContent = `${result.name} imported with ${result.totalFiles} files.`;
        urlInput.value = "";
        repoState.savedRepos = [result, ...repoState.savedRepos.filter((repo) => repo.id !== result.id)];
        renderRepoList(repoState.savedRepos);
        renderRepoDetail(result, { correlationId });
        loadAndRenderProjectMap(result.id);
        loadAndRenderProjectSummary(result.id);
        loadAndRenderSymbolMap(result.id);
        loadAndRenderDependencyMap(result.id);
        loadAndRenderBehaviorMap(result.id);
        loadAndRenderAlgorithmMap(result.id);
        loadAndRenderRecoveryAssistant(result.id);
        showToast("GitHub repo imported");
      } catch (error) {
        status.textContent = error.message;
        logEvent({
          level: "error",
          area: "repo_map",
          source: "github",
          phase: "clone",
          action: "github_clone_failed",
          message: error.message,
          details: { repoUrl },
          correlationId
        });
      }
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener("click", () => loadRepos());
  }

  document.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-repo-id]");
    if (deleteButton) {
      handleDeleteRepo(deleteButton.dataset.deleteRepoId);
      return;
    }

    const repoButton = event.target.closest("[data-repo-id]");
    if (repoButton) {
      document.querySelectorAll(".repo-row").forEach((row) => row.classList.remove("active"));
      repoButton.classList.add("active");
      const selectedRepo = repoState.savedRepos.find((repo) => repo.id === repoButton.dataset.repoId);
      renderRepoDetail(selectedRepo);
      loadAndRenderProjectMap(repoButton.dataset.repoId);
      loadAndRenderProjectSummary(repoButton.dataset.repoId);
      loadAndRenderSymbolMap(repoButton.dataset.repoId);
      loadAndRenderDependencyMap(repoButton.dataset.repoId);
      loadAndRenderBehaviorMap(repoButton.dataset.repoId);
      loadAndRenderAlgorithmMap(repoButton.dataset.repoId);
      loadAndRenderRecoveryAssistant(repoButton.dataset.repoId);
      return;
    }

    const actionLogFilter = event.target.closest("[data-action-log-filter]");
    if (actionLogFilter) {
      repoState.actionLogFilters[actionLogFilter.dataset.actionLog] = actionLogFilter.dataset.actionLogFilter;
      renderActionLogs();
    }
  });

  fetchFilterRules()
    .then((rules) => {
      repoState.filterRules = rules;
    })
    .catch(() => {})
    .finally(() => Promise.all([loadRepos(), loadInitialActionEvents()]));
}

async function loadRepos() {
  const repoList = document.querySelector("#repoList");
  if (!repoList) {
    return;
  }

  repoList.innerHTML = `<div class="empty-repo-state"><span>${icon("refresh")}</span><p>Loading repos...</p></div>`;

  try {
    repoState.savedRepos = await fetchRepos();
    renderRepoList(repoState.savedRepos);
    if (repoState.savedRepos.length) {
      loadAndRenderProjectMap(repoState.savedRepos[0].id);
      loadAndRenderProjectSummary(repoState.savedRepos[0].id);
      loadAndRenderSymbolMap(repoState.savedRepos[0].id);
      loadAndRenderDependencyMap(repoState.savedRepos[0].id);
      loadAndRenderBehaviorMap(repoState.savedRepos[0].id);
      loadAndRenderAlgorithmMap(repoState.savedRepos[0].id);
      loadAndRenderRecoveryAssistant(repoState.savedRepos[0].id);
    }
  } catch (error) {
    repoList.innerHTML = `<div class="empty-repo-state"><span>${icon("database")}</span><p>${escapeHtml(error.message)}</p></div>`;
  }
}

async function loadAndRenderProjectMap(repoId) {
  const panel = document.querySelector("#projectMapPanel");
  if (!panel) {
    return;
  }
  panel.innerHTML = `<div class="project-map-loading">Loading project map...</div>`;
  try {
    const data = await fetchProjectMap(repoId);
    renderProjectMap(data);
  } catch {
    panel.innerHTML = `<div class="project-map-loading">Could not load project map.</div>`;
  }
}

async function loadAndRenderProjectSummary(repoId) {
  const panel = document.querySelector("#projectSummaryPanel");
  if (!panel) {
    return;
  }
  panel.innerHTML = `<div class="project-summary-loading">Loading project summary...</div>`;
  try {
    const data = await fetchProjectSummary(repoId);
    renderProjectSummary(data);
  } catch {
    panel.innerHTML = `<div class="project-summary-loading">Could not load project summary.</div>`;
  }
}

async function loadAndRenderSymbolMap(repoId) {
  const panel = document.querySelector("#symbolMapPanel");
  if (!panel) {
    return;
  }
  panel.innerHTML = `<div class="symbol-map-loading">Loading symbol map...</div>`;
  try {
    const data = await fetchSymbolMap(repoId);
    renderSymbolMap(data);
  } catch {
    panel.innerHTML = `<div class="symbol-map-loading">Could not load symbol map.</div>`;
  }
}

async function loadAndRenderDependencyMap(repoId) {
  const panel = document.querySelector("#dependencyMapPanel");
  if (!panel) {
    return;
  }
  panel.innerHTML = `<div class="dep-map-loading">Loading dependency map...</div>`;
  try {
    const data = await fetchDependencyMap(repoId);
    renderDependencyMap(data);
  } catch {
    panel.innerHTML = `<div class="dep-map-loading">Could not load dependency map.</div>`;
  }
}

async function loadAndRenderBehaviorMap(repoId) {
  const panel = document.querySelector("#behaviorMapPanel");
  if (!panel) {
    return;
  }
  panel.innerHTML = `<div class="behavior-map-loading">Loading behavior map...</div>`;
  try {
    const data = await fetchBehaviorMap(repoId);
    renderBehaviorMap(data);
  } catch {
    panel.innerHTML = `<div class="behavior-map-loading">Could not load behavior map.</div>`;
  }
}

async function loadAndRenderAlgorithmMap(repoId) {
  const panel = document.querySelector("#algorithmMapPanel");
  if (!panel) {
    return;
  }
  panel.innerHTML = `<div class="algorithm-map-loading">Loading algorithm map...</div>`;
  try {
    const data = await fetchAlgorithmMap(repoId);
    renderAlgorithmMap(data);
  } catch {
    panel.innerHTML = `<div class="algorithm-map-loading">Could not load algorithm map.</div>`;
  }
}

async function loadAndRenderRecoveryAssistant(repoId) {
  const panel = document.querySelector("#recoveryAssistantPanel");
  if (!panel) {
    return;
  }
  panel.innerHTML = `<div class="recovery-assistant-loading">Loading recovery assistant...</div>`;
  try {
    const data = await fetchRecoveryAssistant(repoId);
    renderRecoveryAssistant(data);
  } catch {
    panel.innerHTML = `<div class="recovery-assistant-loading">Could not load recovery assistant.</div>`;
  }
}

async function loadInitialActionEvents() {
  if (!document.querySelector("#globalActionLog") && !document.querySelector("#repoActionLog")) {
    return;
  }

  try {
    const events = await fetchActionEvents();
    mergeActionEvents(events);
  } catch {
    return;
  }
}

async function handleDeleteRepo(repoId) {
  const repo = repoState.savedRepos.find((item) => item.id === repoId);
  if (!repo) {
    return;
  }

  const confirmed = window.confirm(`Delete ${repo.name}? This removes the saved repo and its stored files.`);
  if (!confirmed) {
    return;
  }

  const correlationId = createClientId("corr");
  logEvent({
    level: "info",
    area: "repo_map",
    source: "ui",
    phase: "delete",
    action: "repo_delete_clicked",
    message: `Delete requested for ${repo.name}.`,
    entity: { type: "repo", id: repo.id, name: repo.name },
    correlationId
  });

  try {
    await deleteRepo(repo.id, correlationId);
    repoState.savedRepos = repoState.savedRepos.filter((item) => item.id !== repo.id);
    renderRepoList(repoState.savedRepos);
    logEvent({
      level: "success",
      area: "repo_map",
      source: "ui",
      phase: "delete",
      action: "repo_removed_from_view",
      message: `${repo.name} removed from the saved repo list.`,
      entity: { type: "repo", id: repo.id, name: repo.name },
      correlationId
    });
    showToast(`${repo.name} deleted`);
  } catch (error) {
    logEvent({
      level: "error",
      area: "repo_map",
      source: "api",
      phase: "delete",
      action: "repo_delete_failed",
      message: error.message,
      entity: { type: "repo", id: repo.id, name: repo.name },
      correlationId
    });
    showToast(error.message);
  }
}
