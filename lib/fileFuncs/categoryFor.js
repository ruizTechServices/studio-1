import path from "node:path";
import { allowedExtensions } from "../config.js";

export function categoryFor(relativePath, extension) {
  const lower = relativePath.toLowerCase();
  const name = path.basename(lower);

  if (lower.includes("/components/")) return "components";
  if (lower.includes("/pages/") || lower.includes("/routes/") || name === "page.tsx" || name === "page.jsx") return "pagesRoutes";
  if (lower.includes("/api/") || name === "route.ts" || name === "route.js") return "apiEndpoints";
  if (lower.includes("/db/") || lower.includes("/database/") || lower.includes("/migrations/") || extension === ".sql") return "databaseFiles";
  if (lower.includes("auth")) return "authLogic";
  if (lower.includes("stripe") || lower.includes("payment") || lower.includes("checkout")) return "paymentLogic";
  if (lower.includes("openai") || lower.includes("ai") || lower.includes("agent")) return "aiLogic";
  if ([".md", ".mdx", ".txt"].includes(extension)) return "documentation";
  if (lower.includes(".test.") || lower.includes(".spec.") || lower.includes("/tests/") || lower.includes("/__tests__/")) return "tests";
  if ([".json", ".yaml", ".yml", ".toml", ".env", ".config", ".lock"].includes(extension) || name.includes("config")) return "configFiles";
  if (extension === ".ico") return "other";
  if (allowedExtensions.has(extension)) return "functions";
  return "other";
}
