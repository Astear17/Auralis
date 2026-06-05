import { spawnSync } from "node:child_process";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error("Run this helper through `npm run render:build`.");
  process.exit(1);
}

function runNpm(args) {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runNpm(["run", "prisma:generate"]);

if (process.env.DATABASE_URL?.trim()) {
  console.log("DATABASE_URL detected. Applying production Prisma migrations.");
  runNpm(["run", "prisma:migrate"]);
} else {
  console.log(
    "DATABASE_URL is not configured. Building with the safe mock fallback.",
  );
}

runNpm(["run", "build"]);
