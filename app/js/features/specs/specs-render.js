import { formatBytes } from "../../core/formatters.js";
import { renderStudioPage } from "../studio-page-renderer.js";

function specFilter(type) {
  if (type === "README") return "readme";
  if (["RFC", "ADR", "Requirements", "Spec"].includes(type)) return "spec-like";
  if (["Architecture", "Design"].includes(type)) return "architecture";
  return "docs";
}

export function renderSpecsPage(target, data) {
  const rows = (data.specs || []).map((spec) => ({
    id: `${spec.repoId}:${spec.path}`,
    title: spec.name,
    subtitle: spec.path,
    status: spec.type,
    tags: [spec.repoName, spec.extension, spec.category].filter(Boolean),
    meta: formatBytes(spec.sizeBytes),
    filterKeys: ["all", specFilter(spec.type)],
    searchText: `${spec.name} ${spec.path} ${spec.repoName} ${spec.type} ${spec.extension}`,
    iconName: "document",
    inspectorTitle: spec.name,
    inspectorSubtitle: spec.repoName,
    details: [
      { label: "Inferred type", value: spec.type },
      { label: "Repo", value: spec.repoName },
      { label: "Path", value: spec.path },
      { label: "Extension", value: spec.extension },
      { label: "Language", value: spec.language },
      { label: "Size", value: formatBytes(spec.sizeBytes) }
    ],
    evidence: [
      `Category: ${spec.category}`,
      "Candidate because it is documentation, Markdown, or has a spec-like path signal."
    ]
  }));

  renderStudioPage(target, {
    title: "Specs",
    subtitle: "Documentation and spec-like files detected in saved repos. No approval metadata is persisted yet.",
    accent: "#8b5cf6",
    iconName: "document",
    stats: [
      { label: "Candidates", value: data.summary?.totalCandidates ?? 0, meta: "docs/spec files" },
      { label: "Repos", value: data.summary?.reposWithDocs ?? 0, meta: "with docs" },
      { label: "READMEs", value: data.summary?.readmes ?? 0, meta: "detected" },
      { label: "Spec-like", value: data.summary?.specLike ?? 0, meta: "RFC/ADR/spec" }
    ],
    filters: [
      { label: "All", value: "all" },
      { label: "README", value: "readme" },
      { label: "Spec-like", value: "spec-like" },
      { label: "Architecture", value: "architecture" },
      { label: "Docs", value: "docs" }
    ],
    columns: ["File", "Type", "Repo", "Size"],
    rows,
    searchPlaceholder: "Filter docs and specs...",
    emptyMessage: "No documentation or spec-like files were found in saved repos."
  });
}
