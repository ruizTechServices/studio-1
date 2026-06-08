const baseUrl = (process.env.STUDIO_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const topLevelPaths = [
  "/api/repos",
  "/api/events",
  "/api/projects",
  "/api/specs",
  "/api/agents",
  "/api/workflows/runs",
  "/api/memory/context",
  "/api/settings/status"
];

const repoPaths = [
  "",
  "/project-map",
  "/project-summary",
  "/symbol-map",
  "/dependency-map",
  "/behavior-map",
  "/algorithm-map",
  "/recovery-assistant",
  "/reusable-assets"
];

async function check(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status} ${response.statusText}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(`${path} did not return valid JSON`);
  }
}

async function main() {
  const results = new Map();

  for (const path of topLevelPaths) {
    results.set(path, await check(path));
    console.log(`PASS ${path}`);
  }

  const repos = results.get("/api/repos");
  if (!Array.isArray(repos)) {
    throw new Error("/api/repos did not return an array");
  }

  if (!repos.length) {
    console.log("SKIP repo-specific endpoints: no persisted repos");
    return;
  }

  const repoId = repos[0]?.id;
  if (!repoId) {
    throw new Error("/api/repos returned a repo without an id");
  }

  for (const suffix of repoPaths) {
    const path = `/api/repos/${encodeURIComponent(repoId)}${suffix}`;
    await check(path);
    console.log(`PASS ${path}`);
  }
}

main().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
