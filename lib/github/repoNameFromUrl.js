export function repoNameFromUrl(url) {
  return url
    .replace(/\.git$/i, "")
    .split("/")
    .pop()
    .replace(/[^\w.-]/g, "-");
}
