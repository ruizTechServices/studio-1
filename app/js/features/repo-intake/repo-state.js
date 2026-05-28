export const repoState = {
  savedRepos: [],
  actionEvents: [],
  filterRules: {
    ignoredDirs: ["node_modules", ".git", "dist", "build", ".next", "coverage"],
    allowedExtensions: [".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".json", ".md"],
    maxFileSizeBytes: 2 * 1024 * 1024
  },
  actionLogFilters: {
    repoActionLog: "all",
    globalActionLog: "all"
  }
};
