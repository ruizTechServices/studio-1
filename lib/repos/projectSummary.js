import { projectMap } from "./projectMap.js";

const CATEGORY_LABELS = {
  components: "Components",
  pagesRoutes: "Pages / Routes",
  apiEndpoints: "API Endpoints",
  functions: "Functions",
  databaseFiles: "Database",
  authLogic: "Auth",
  paymentLogic: "Payments",
  aiLogic: "AI Logic",
  configFiles: "Config",
  documentation: "Docs",
  tests: "Tests",
  other: "Other"
};

const LIGHT_THRESHOLD = 3;

function labelCategory(key) {
  return CATEGORY_LABELS[key] || key;
}

function detectFramework(sections, allPaths, primaryLanguage) {
  const lower = allPaths.map((p) => p.toLowerCase());

  const has = (patterns) => patterns.some((pat) => lower.some((p) => p === pat || p.endsWith("/" + pat)));

  if (has(["next.config.ts", "next.config.js", "next.config.mjs"]) ||
      (lower.some((p) => /\/app\/layout\.[tj]sx?$/.test(p) || p === "app/layout.tsx" || p === "app/layout.ts") &&
       lower.some((p) => /\/app\/page\.[tj]sx?$/.test(p) || p === "app/page.tsx" || p === "app/page.ts"))) {
    return { projectType: "Next.js web application", confidence: "high", frameworks: ["Next.js", "React"] };
  }

  if (has(["svelte.config.js", "svelte.config.ts"])) {
    return { projectType: "SvelteKit application", confidence: "high", frameworks: ["SvelteKit", "Svelte"] };
  }

  if (has(["vite.config.ts", "vite.config.js"])) {
    const hasComponents = (sections.components?.length || 0) > 0;
    if (hasComponents) {
      return { projectType: "React web application (Vite)", confidence: "high", frameworks: ["React", "Vite"] };
    }
    return { projectType: "Vite web application", confidence: "medium", frameworks: ["Vite"] };
  }

  if (has(["nuxt.config.ts", "nuxt.config.js"])) {
    return { projectType: "Nuxt.js web application", confidence: "high", frameworks: ["Nuxt.js", "Vue"] };
  }

  if (has(["remix.config.js", "remix.config.ts"])) {
    return { projectType: "Remix web application", confidence: "high", frameworks: ["Remix", "React"] };
  }

  if (primaryLanguage === "python") {
    if (has(["manage.py"])) {
      return { projectType: "Django web application", confidence: "medium", frameworks: ["Django", "Python"] };
    }
    if (lower.some((p) => p === "app.py" || p.endsWith("/app.py"))) {
      return { projectType: "Flask web application", confidence: "medium", frameworks: ["Flask", "Python"] };
    }
    return { projectType: "Python project", confidence: "low", frameworks: ["Python"] };
  }

  if (primaryLanguage === "go") {
    return { projectType: "Go application", confidence: "low", frameworks: ["Go"] };
  }

  if (primaryLanguage === "rust") {
    return { projectType: "Rust application", confidence: "low", frameworks: ["Rust"] };
  }

  const hasApiEndpoints = (sections.apiEndpoints?.length || 0) > 0;
  const hasServer = has(["server.js", "server.ts", "index.js"]);
  if (hasServer && hasApiEndpoints) {
    if (primaryLanguage === "typescript") {
      return { projectType: "Node.js / Express server (TypeScript)", confidence: "medium", frameworks: ["Node.js", "Express"] };
    }
    return { projectType: "Node.js / Express server", confidence: "medium", frameworks: ["Node.js", "Express"] };
  }

  if (primaryLanguage === "typescript") {
    return { projectType: "TypeScript project", confidence: "low", frameworks: [] };
  }
  if (primaryLanguage === "javascript") {
    return { projectType: "JavaScript project", confidence: "low", frameworks: [] };
  }

  return { projectType: "Unknown project type", confidence: "low", frameworks: [] };
}

export function projectSummary(row) {
  const map = projectMap(row);
  const { summary, sections } = map;

  const primaryLanguage = summary.primaryLanguages[0] || null;
  const allPaths = Object.values(sections).flat().map((f) => f.path);
  const lower = allPaths.map((p) => p.toLowerCase());

  const { projectType, confidence, frameworks } = detectFramework(sections, allPaths, primaryLanguage);

  const detectedCapabilities = [];
  const evidence = [];

  const counts = summary.categoryCounts;

  if (counts.pagesRoutes > 0) {
    detectedCapabilities.push("frontend pages/routes");
    evidence.push(`${counts.pagesRoutes} page/route file${counts.pagesRoutes > 1 ? "s" : ""} found`);
  }
  if (counts.components > 0) {
    detectedCapabilities.push("component system");
    evidence.push(`${counts.components} component file${counts.components > 1 ? "s" : ""} found`);
  }
  if (counts.apiEndpoints > 0) {
    detectedCapabilities.push("API layer");
    evidence.push(`${counts.apiEndpoints} API endpoint file${counts.apiEndpoints > 1 ? "s" : ""} found`);
  }
  if (counts.authLogic > 0) {
    detectedCapabilities.push("authentication logic");
    evidence.push(`${counts.authLogic} auth file${counts.authLogic > 1 ? "s" : ""} found`);
  }
  if (counts.paymentLogic > 0) {
    detectedCapabilities.push("payment logic");
    evidence.push(`${counts.paymentLogic} payment file${counts.paymentLogic > 1 ? "s" : ""} found`);
  }
  if (counts.aiLogic > 0) {
    detectedCapabilities.push("AI-related logic");
    evidence.push(`${counts.aiLogic} AI logic file${counts.aiLogic > 1 ? "s" : ""} found`);
  }
  if (counts.databaseFiles > 0) {
    detectedCapabilities.push("database layer");
    evidence.push(`${counts.databaseFiles} database file${counts.databaseFiles > 1 ? "s" : ""} found`);
  }
  if (counts.tests > 0) {
    detectedCapabilities.push("test suite");
    evidence.push(`${counts.tests} test file${counts.tests > 1 ? "s" : ""} found`);
  }
  if (counts.documentation > 0) {
    detectedCapabilities.push("documentation");
    evidence.push(`${counts.documentation} documentation file${counts.documentation > 1 ? "s" : ""} found`);
  }

  // Framework-specific file evidence
  if (lower.some((p) => p === "next.config.ts" || p === "next.config.js" || p.endsWith("/next.config.ts") || p.endsWith("/next.config.js"))) {
    evidence.push("next.config found");
  }
  if (lower.some((p) => p === "app/layout.tsx" || p === "app/layout.ts" || p.endsWith("/app/layout.tsx"))) {
    evidence.push("app/layout file found");
  }
  if (lower.some((p) => p === "server.js" || p === "server.ts")) {
    evidence.push("server entry point found");
  }
  if (lower.some((p) => p === "package.json" || p.endsWith("/package.json"))) {
    evidence.push("package.json found");
  }

  const missingOrLightAreas = [];

  if ((counts.tests || 0) === 0) {
    missingOrLightAreas.push("tests are missing or light");
  } else if ((counts.tests || 0) < LIGHT_THRESHOLD) {
    missingOrLightAreas.push("tests are light");
  }
  if ((counts.apiEndpoints || 0) === 0) {
    missingOrLightAreas.push("API endpoints are missing or light");
  }
  if ((counts.databaseFiles || 0) === 0) {
    missingOrLightAreas.push("database files are missing or light");
  }
  if ((counts.documentation || 0) === 0) {
    missingOrLightAreas.push("documentation is missing or light");
  } else if ((counts.documentation || 0) < LIGHT_THRESHOLD) {
    missingOrLightAreas.push("documentation is light");
  }
  if ((counts.authLogic || 0) === 0) {
    missingOrLightAreas.push("authentication logic is missing or light");
  }

  const mainAreas = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category]) => labelCategory(category));

  return {
    repo: {
      id: row.id,
      name: row.name
    },
    summary: {
      projectType,
      confidence,
      primaryLanguage,
      frameworks,
      mainAreas,
      detectedCapabilities,
      missingOrLightAreas,
      evidence
    }
  };
}
