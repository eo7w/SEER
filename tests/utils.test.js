import { test } from "node:test";
import assert from "node:assert/strict";
import { esc, uid, clamp, hashString, estimateTokens, timeAgo, greetingByHour } from "../src/core/utils.js";

test("esc escapes HTML entities", () => {
  assert.equal(esc("<b class=\"x\">"), "&lt;b class=&quot;x&quot;&gt;");
  assert.equal(esc("a & b"), "a &amp; b");
});

test("uid returns unique non-empty strings", () => {
  const a = uid(); const b = uid();
  assert.ok(typeof a === "string" && a.length > 0);
  assert.notEqual(a, b);
});

test("clamp keeps values within bounds", () => {
  assert.equal(clamp(5, 0, 10), 5);
  assert.equal(clamp(-1, 0, 10), 0);
  assert.equal(clamp(11, 0, 10), 10);
});

test("hashString is deterministic and numeric", () => {
  assert.equal(hashString("script"), hashString("script"));
  assert.notEqual(hashString("script"), hashString("scripT"));
  assert.equal(typeof hashString("x"), "number");
});

test("estimateTokens approximates word count", () => {
  assert.equal(estimateTokens("hello world"), 3);
  assert.equal(estimateTokens("   "), 1);
});

test("timeAgo formats recent timestamps", () => {
  assert.equal(timeAgo(Date.now()), "just now");
});

test("greetingByHour returns a string", () => {
  assert.ok(typeof greetingByHour() === "string");
  assert.ok(greetingByHour().length > 0);
});
