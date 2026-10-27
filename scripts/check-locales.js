#!/usr/bin/env node
/* Script — scripts/check-locales.js
   Verifies that every locale file parses and matches the en.json key set. */

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "locales");

function flatKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + "." + k : k;
    if (v && typeof v === "object") keys.push(...flatKeys(v, key));
    else keys.push(key);
  }
  return keys.sort();
}

const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.error("check:locales — no locale files found");
  process.exit(1);
}

let failed = false;
const ref = JSON.parse(readFileSync(join(dir, "en.json"), "utf8"));
const refKeys = flatKeys(ref);

for (const f of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  } catch (e) {
    console.error("✗", f, "— invalid JSON:", e.message);
    failed = true;
    continue;
  }
  const keys = flatKeys(data);
  const missing = refKeys.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !refKeys.includes(k));
  if (missing.length || extra.length) {
    console.error("✗", f, "— missing:", missing.join(", ") || "none", "| extra:", extra.join(", ") || "none");
    failed = true;
  } else {
    console.log("✓", f, "(" + keys.length + " keys)");
  }
}

process.exit(failed ? 1 : 0);
