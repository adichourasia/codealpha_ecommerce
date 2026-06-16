import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Starting backend server on port 4000 and frontend dev server...");

// Start backend
const backend = spawn("node", [join(__dirname, "backend/server.mjs")], {
  stdio: "inherit",
  shell: true,
});

// Start frontend (vite)
const frontend = spawn("npx", ["vite", "dev"], {
  stdio: "inherit",
  shell: true,
});

// If either process exits, kill the other and exit
backend.on("exit", (code) => {
  frontend.kill();
  process.exit(code || 0);
});

frontend.on("exit", (code) => {
  backend.kill();
  process.exit(code || 0);
});

// Handle termination signals
const cleanup = () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
