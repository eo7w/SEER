import { test } from "node:test";
import assert from "node:assert/strict";

// localStorage stub — installed before importing the module is not required
// because storage touches it only at call time.
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { loadJSON, saveJSON, KEY_CONVS, KEY_SETTINGS, KEY_SEEDED } = await import("../src/core/storage.js");

test("keys are namespaced", () => {
  assert.equal(KEY_CONVS, "nova-chat-convs-v1");
  assert.equal(KEY_SETTINGS, "nova-chat-settings-v1");
  assert.equal(KEY_SEEDED, "nova-chat-seeded-v1");
});

test("saveJSON/loadJSON round trip", () => {
  saveJSON("t-round", { a: 1, b: [2, 3] });
  const back = loadJSON("t-round", null);
  assert.equal(back.a, 1);
  assert.deepEqual(back.b, [2, 3]);
});

test("loadJSON returns fallback for missing keys", () => {
  assert.equal(loadJSON("t-missing", "fallback"), "fallback");
});

test("loadJSON returns fallback for corrupt JSON", () => {
  globalThis.localStorage.setItem("t-corrupt", "{not json");
  assert.equal(loadJSON("t-corrupt", "fb"), "fb");
});
