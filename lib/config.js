export const ignoredDirs = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".turbo",
  ".cache",
  ".parcel-cache",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "out",
  "target",
  "vendor",
  ".venv",
  "venv",
  "__pycache__",
  ".idea",
  ".vscode"
]);

export const allowedExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".py",
  ".rb",
  ".go",
  ".rs",
  ".java",
  ".php",
  ".cs",
  ".swift",
  ".kt",
  ".html",
  ".css",
  ".scss",
  ".sql",
  ".json",
  ".md",
  ".mdx",
  ".yaml",
  ".yml",
  ".toml"
]);

export const importantNames = new Set([
  "dockerfile",
  "makefile",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "requirements.txt",
  "gemfile",
  "cargo.toml",
  "go.mod",
  "readme",
  "license"
]);

export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
