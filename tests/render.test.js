import { test } from "node:test";
import assert from "node:assert/strict";

// Minimal browser stubs — components touch window/document at call time only.
globalThis.window = { innerWidth: 1440, innerHeight: 900, addEventListener() {} };
globalThis.document = {
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  createElement: () => ({ style: {}, classList: { add() {}, remove() {} } }),
};

const { messageHtml } = await import("../src/components/chat.js");
const { composerHtml } = await import("../src/components/composer.js");
const { computeStats, areaChartSvg } = await import("../src/components/analytics.js");
const { toggleRow } = await import("../src/components/modals.js");
const { state } = await import("../src/core/state.js");

test("messageHtml renders a user message", () => {
  const out = messageHtml({ role: "user", content: "hello world", createdAt: Date.now() }, 0, 1);
  assert.ok(typeof out === "string");
  assert.ok(out.includes("hello world"));
});

test("messageHtml renders an assistant message", () => {
  const out = messageHtml({ role: "assistant", content: "**bold** reply", createdAt: Date.now() }, 1, 2);
  assert.ok(out.includes("bold"));
});

test("messageHtml escapes user content", () => {
  const out = messageHtml({ role: "user", content: "<img src=x>", createdAt: Date.now() }, 0, 1);
  assert.ok(!out.includes("<img"));
});

test("composerHtml renders a textarea and send button", () => {
  const out = composerHtml();
  assert.ok(out.includes("composer"));
  assert.ok(out.includes("<textarea"));
});

test("computeStats returns seven day buckets", () => {
  const s = computeStats();
  assert.equal(s.days.length, 7);
  assert.equal(s.totalConvs, state.conversations.length);
  assert.equal(typeof s.tokens, "number");
});

test("areaChartSvg builds an SVG chart", () => {
  const svg = areaChartSvg(computeStats().days, 320, 140);
  assert.ok(svg.includes("<svg"));
  assert.ok(svg.includes("<circle"));
});

test("toggleRow renders an on-state switch", () => {
  const row = toggleRow("gear", "Header", "Sub", "act", true);
  assert.ok(row.includes("tgl"));
  assert.ok(row.includes("on"));
  assert.ok(row.includes("Header"));
});
