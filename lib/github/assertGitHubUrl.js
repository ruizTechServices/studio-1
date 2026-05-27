export function assertGitHubUrl(value) {
  const url = String(value || "").trim();
  if (!/^https:\/\/github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?$/i.test(url)) {
    throw new Error("Enter a valid GitHub repo URL.");
  }
  return url.endsWith(".git") ? url : `${url}.git`;
}
