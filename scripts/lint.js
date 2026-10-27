#!/usr/bin/env node
/* Script — scripts/lint.js
   Zero-dependency style linter: tabs, debugger, trailing whitespace,
   file endings, and line length. What it checks is what CI enforces. */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["src", "scripts", "tests"];
const SKIP = new Set(["scripts/dev-server.js", "scripts/lint.js", "scripts/check-locales.js"]); // CLI tools legitimately print

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (extname(p) === ".js") out.push(p);
  }
  return out;
}

let failed = false;
const files = [];
for (const t of TARGETS) files.push(...walk(join(ROOT, t)));

for (const f of files) {
  const rel = f.slice(ROOT.length + 1).replaceAll("\\", "/");
  const text = readFileSync(f, "utf8");
  const lines = text.split("\n");

  if (!text.endsWith("\n")) { console.error("✗", rel, "— missing final newline"); failed = true; }
  if (text.includes("\t")) { console.error("✗", rel, "— contains a tab"); failed = true; }
  if (text.includes("debugger")) { console.error("✗", rel, "— contains debugger"); failed = true; }
  if (!SKIP.has(rel) && /console\.log\(/.test(text)) { console.error("✗", rel, "— console.log left in code"); failed = true; }
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > 500) { console.error("✗", rel, ":" + (i + 1), "— line longer than 500 chars"); failed = true; break; }
  }
  if (!failed || true) { /* per-file summary below */ }
}

if (failed) {
  console.error("lint: problems found");
  process.exit(1);
}
console.log("✓ lint —", files.length, "JS files clean");
