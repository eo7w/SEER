import { test } from "node:test";
import assert from "node:assert/strict";
import { MODELS, modelById } from "../src/data/models.js";
import { ACCENTS } from "../src/data/accents.js";
import { SUGGESTIONS, TRAIT_OPTIONS } from "../src/data/suggestions.js";
import { SHORTCUTS } from "../src/data/shortcuts.js";
import { DEFAULT_SETTINGS } from "../src/data/settings.js";
import { TOOLS } from "../src/data/tools.js";
import { RESPONSES, FALLBACKS } from "../src/data/responses.js";
import { seedConversations } from "../src/data/seed.js";
import { ICONS } from "../src/core/icons.js";

test("models registry is well-formed", () => {
  assert.ok(MODELS.length >= 3);
  for (const m of MODELS) {
    assert.ok(m.id && m.name);
  }
  assert.equal(modelById(MODELS[0].id).id, MODELS[0].id);
});

test("accents registry has multiple palettes", () => {
  const keys = Object.keys(ACCENTS);
  assert.ok(keys.length >= 5);
});

test("suggestions and traits exist", () => {
  assert.ok(SUGGESTIONS.length >= 4);
  assert.ok(TRAIT_OPTIONS.length >= 4);
});

test("shortcuts list is populated", () => {
  assert.ok(SHORTCUTS.length >= 4);
});

test("default settings have required keys", () => {
  for (const k of ["theme", "accent", "defaultModel", "fontScale", "language"]) {
    assert.ok(k in DEFAULT_SETTINGS, "missing " + k);
  }
});

test("tools grid has six entries", () => {
  assert.equal(TOOLS.length, 6);
  for (const t of TOOLS) assert.ok(t.ic && t.t);
});

test("response engine data is valid", () => {
  assert.ok(RESPONSES.length >= 5);
  for (const r of RESPONSES) {
    assert.ok(r.test instanceof RegExp);
    assert.ok(r.variants.length > 0);
  }
  assert.ok(FALLBACKS.length > 0);
});

test("seed conversations are well-formed", () => {
  const convs = seedConversations();
  assert.ok(Array.isArray(convs));
  assert.ok(convs.length >= 2);
  for (const c of convs) {
    assert.ok(c.id && c.title && Array.isArray(c.messages));
  }
});

test("icon registry covers the UI", () => {
  assert.ok(Object.keys(ICONS).length >= 50);
  assert.ok(Array.isArray(ICONS.plus));
});
