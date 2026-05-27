export const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?$/i;

export function assertGitHubUrl(value) {
  const url = String(value || "").trim();
  if (!GITHUB_URL_REGEX.test(url)) {
    throw new Error("Enter a valid GitHub repo URL.");
  }
  return url.endsWith(".git") ? url : `${url}.git`;
}
