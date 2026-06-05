import { db } from "../db.js";

const SPEC_SIGNAL = /(spec|prd|rfc|requirements|readme|docs|design|architecture|decision|adr)/i;

function classifySpec(file) {
  const text = `${file.path} ${file.name}`.toLowerCase();
  const name = String(file.name || "").toLowerCase();

  if (/^readme\.mdx?$/.test(name)) return "README";
  if (text.includes("rfc")) return "RFC";
  if (text.includes("adr") || text.includes("decision")) return "ADR";
  if (text.includes("requirements")) return "Requirements";
  if (text.includes("architecture")) return "Architecture";
  if (text.includes("design")) return "Design";
  if (text.includes("spec") || text.includes("prd")) return "Spec";
  return "General docs";
}

export function specCandidates() {
  const rows = db
    .prepare(
      `SELECT
        repo_files.repo_id AS repoId,
        repos.name AS repoName,
        repo_files.path,
        repo_files.name,
        repo_files.extension,
        repo_files.language,
        repo_files.size_bytes AS sizeBytes,
        repo_files.category
       FROM repo_files
       JOIN repos ON repos.id = repo_files.repo_id
       WHERE repo_files.category = 'documentation'
          OR repo_files.extension IN ('.md', '.mdx')
          OR lower(repo_files.path) LIKE '%spec%'
          OR lower(repo_files.path) LIKE '%prd%'
          OR lower(repo_files.path) LIKE '%rfc%'
          OR lower(repo_files.path) LIKE '%requirements%'
          OR lower(repo_files.path) LIKE '%readme%'
          OR lower(repo_files.path) LIKE '%docs%'
          OR lower(repo_files.path) LIKE '%design%'
          OR lower(repo_files.path) LIKE '%architecture%'
          OR lower(repo_files.path) LIKE '%decision%'
          OR lower(repo_files.path) LIKE '%adr%'
       ORDER BY repos.name, repo_files.path`
    )
    .all();

  const specs = rows
    .filter((row) => row.category === "documentation" || [".md", ".mdx"].includes(row.extension) || SPEC_SIGNAL.test(row.path))
    .map((row) => ({
      ...row,
      type: classifySpec(row)
    }));

  const reposWithDocs = new Set(specs.map((spec) => spec.repoId)).size;
  const readmes = specs.filter((spec) => spec.type === "README").length;
  const specLike = specs.filter((spec) => ["RFC", "ADR", "Requirements", "Spec"].includes(spec.type)).length;

  return {
    summary: {
      totalCandidates: specs.length,
      reposWithDocs,
      readmes,
      specLike
    },
    specs
  };
}
