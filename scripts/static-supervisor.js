import { execSync } from "child_process";
import fs from "fs";
import "./static-server.js";
import { startGitPoll } from "./git-poll.js";

const BRANCH = process.env.PREVIEW_BRANCH || "main";
const REPO_URL = process.env.REPO_URL;

if (!REPO_URL) {
  console.error("[supervisor] missing REPO_URL env var");
  process.exit(1);
}

process.chdir("/app"); // 🔑 FORCE cwd
const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: "/app" });

run("git config --global --add safe.directory /app");

console.log("[supervisor] ensuring git repo");

if (!fs.existsSync(".git")) {
  run("git init");
  run(`git remote add origin ${REPO_URL}`);
} else {
  run(`git remote set-url origin ${REPO_URL}`);
}

run(`git fetch origin ${BRANCH} --depth=1`);
run(`git reset --hard origin/${BRANCH}`);
run("git clean -fd");

console.log("[supervisor] static preview running");

// 🔑 start polling ONLY after git is ready
startGitPoll();
