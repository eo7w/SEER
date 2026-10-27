import { test } from "node:test";
import assert from "node:assert/strict";
import { highlightHtml, codeBlockHtml } from "../src/core/highlight.js";

test("keywords get token spans", () => {
  const out = highlightHtml("const x = 1;", "js");
  assert.ok(out.includes("tok-k"));
  assert.ok(out.includes("tok-n"));
});

test("strings get token spans", () => {
  assert.ok(highlightHtml('say "hi"', "js").includes("tok-s"));
});

test("comments get token spans", () => {
  assert.ok(highlightHtml("// note", "js").includes("tok-c"));
});

test("unknown language falls back to js keywords", () => {
  const out = highlightHtml("const x", "brainfuck");
  assert.ok(out.includes("tok-k"));
});

test("codeBlockHtml wraps code with header", () => {
  const out = codeBlockHtml("js", ["const x = 1;"]);
  assert.ok(out.includes("cb-lang"));
  assert.ok(out.includes("<pre><code>"));
});

test("empty code lines use nbsp placeholder", () => {
  const out = codeBlockHtml("js", ["", "x"]);
  assert.ok(out.includes("\u00a0"));
});
