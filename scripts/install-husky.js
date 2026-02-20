#!/usr/bin/env node
const { spawnSync } = require("child_process");

const env = process.env;
// Default: do NOT install husky during `pnpm i` unless ENABLE_HUSKY=true
// This prevents automatic creation of .husky/* files on normal installs.
const enable = env.ENABLE_HUSKY === "true";
if (!enable) {
    console.log(
        "Husky default files install skipped (set ENABLE_HUSKY=true to enable)."
    );
    process.exit(0);
}

// Run the local husky binary (node_modules/.bin is in PATH during lifecycle scripts)
const res = spawnSync("husky", ["install"], { stdio: "inherit" });
process.exit(res.status || 0);
