import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "locales");

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
const reference = JSON.parse(readFileSync(path.join(dir, "en.json"), "utf8"));
const refKeys = flatKeys(reference);

test("locale directory has 11 languages", () => {
  assert.equal(files.length, 11);
});

test("every locale parses as JSON", () => {
  for (const f of files) {
    assert.doesNotThrow(() => JSON.parse(readFileSync(path.join(dir, f), "utf8")), f);
  }
});

test("every locale matches the en.json key set", () => {
  for (const f of files) {
    const data = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
    assert.deepEqual(flatKeys(data), refKeys, "key mismatch in " + f);
  }
});

test("rtl locales declare direction", () => {
  const ar = JSON.parse(readFileSync(path.join(dir, "ar.json"), "utf8"));
  assert.equal(ar.meta.dir, "rtl");
});

test("values are non-empty strings", () => {
  for (const f of files) {
    const data = JSON.parse(readFileSync(path.join(dir, f), "utf8"));
    for (const k of flatKeys(data)) {
      const v = k.split(".").reduce((o, p) => o[p], data);
      assert.ok(typeof v === "string" && v.length > 0, k + " empty in " + f);
    }
  }
});
