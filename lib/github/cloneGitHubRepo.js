import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function cloneGitHubRepo(url, destination) {
  await execFileAsync("git", ["clone", "--depth=1", "--single-branch", url, destination], {
    timeout: 120000,
    maxBuffer: 1024 * 1024
  });
}
