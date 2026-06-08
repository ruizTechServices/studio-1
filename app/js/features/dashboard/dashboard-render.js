function dashboardKpis(data) {
  const projectSummary = data.projects?.summary || {};
  const specSummary = data.specs?.summary || {};
  const agentSummary = data.agents?.summary || {};
  const workflowSummary = data.workflows?.summary || {};
  const runtimeLabel = data.agents?.runtime?.connected ? "runtime online" : "runtime offline";

  return [
    {
      label: "Saved Projects",
      value: projectSummary.totalProjects ?? 0,
      meta: `${projectSummary.githubImports ?? 0} GitHub / ${projectSummary.localUploads ?? 0} local`,
      color: "blue",
      href: "./projects.html"
    },
    {
      label: "Spec Candidates",
      value: specSummary.totalCandidates ?? 0,
      meta: `${specSummary.specLike ?? 0} spec-like / ${specSummary.readmes ?? 0} READMEs`,
      color: "green",
      href: "./specs.html"
    },
    {
      label: "AI-Related Files",
      value: agentSummary.aiFiles ?? 0,
      meta: `${agentSummary.reposWithAiSignals ?? 0} repos / ${runtimeLabel}`,
      color: "orange",
      href: "./agents.html"
    },
    {
      label: "Workflow Runs",
      value: workflowSummary.totalRuns ?? 0,
      meta: `${workflowSummary.successfulRuns ?? 0} successful / ${workflowSummary.failedRuns ?? 0} failed`,
      color: "purple",
      href: "./workflows.html"
    }
  ];
}

const loadingKpis = [
  { label: "Saved Projects", value: "...", meta: "Loading live data", color: "blue" },
  { label: "Spec Candidates", value: "...", meta: "Loading live data", color: "green" },
  { label: "AI-Related Files", value: "...", meta: "Loading live data", color: "orange" },
  { label: "Workflow Runs", value: "...", meta: "Loading live data", color: "purple" }
];

export function renderKpis(data) {
  const kpiStrip = document.querySelector("#kpiStrip");
  if (!kpiStrip) {
    return;
  }

  const kpis = data ? dashboardKpis(data) : loadingKpis;
  kpiStrip.innerHTML = kpis.map((item) => `
    <a class="kpi-card" href="${item.href || "#"}">
      <span class="kpi-label">${item.label}</span>
      <span class="kpi-value">${item.value}</span>
      <span class="kpi-meta text-${item.color}">${item.meta}</span>
    </a>
  `).join("");
}

export function renderKpiError() {
  const kpiStrip = document.querySelector("#kpiStrip");
  if (!kpiStrip) {
    return;
  }

  kpiStrip.innerHTML = `
    <div class="kpi-load-error" role="status">
      Live dashboard summary is unavailable. Open a section from the sidebar to retry.
    </div>
  `;
}
