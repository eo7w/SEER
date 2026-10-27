import { test } from "node:test";
import assert from "node:assert/strict";
import { pickResponse, chunkText } from "../src/core/engine.js";

test("pickResponse returns a non-empty string", () => {
  const r = pickResponse("hello");
  assert.equal(typeof r, "string");
  assert.ok(r.length > 0);
});

test("pickResponse is deterministic for the same prompt", () => {
  assert.equal(pickResponse("hello"), pickResponse("hello"));
});

test("pickResponse handles Arabic prompts", () => {
  const r = pickResponse("مرحبا، كيف حالك؟");
  assert.equal(typeof r, "string");
  assert.ok(r.length > 0);
});

test("empty prompt falls back safely", () => {
  const r = pickResponse("");
  assert.equal(typeof r, "string");
});

test("chunkText splits on whitespace boundaries", () => {
  const parts = chunkText("a b c");
  assert.equal(parts.length, 3);
  assert.equal(parts.join("").trim(), "a b c");
});
