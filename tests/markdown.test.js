import { test } from "node:test";
import assert from "node:assert/strict";
import { mdHtml, parseMarkdown, inlineHtml } from "../src/core/markdown.js";

test("headings render as h1/h2", () => {
  const out = mdHtml("# Title\n## Sub");
  assert.ok(out.includes("<h1>Title</h1>"));
  assert.ok(out.includes("<h2>Sub</h2>"));
});

test("unordered lists render", () => {
  const out = mdHtml("- a\n- b");
  assert.ok(out.includes("<ul>"));
  assert.ok(out.includes("<li>a</li>"));
});

test("ordered lists render", () => {
  const out = mdHtml("1. first\n2. second");
  assert.ok(out.includes("<ol>"));
  assert.ok(out.includes("<li>first</li>"));
});

test("code fences render highlighted blocks", () => {
  const out = mdHtml("```js\nconst x = 1;\n```");
  assert.ok(out.includes("codeblock"));
  assert.ok(out.includes("tok-k"));
  assert.ok(out.includes("<pre>"));
});

test("raw HTML is escaped", () => {
  const out = mdHtml("<b>bold");
  assert.ok(!out.includes("<b>"));
  assert.ok(out.includes("&lt;b&gt;"));
});

test("inline formatting", () => {
  const out = inlineHtml("**bold** and *it* and `code`");
  assert.ok(out.includes("<strong>bold</strong>"));
  assert.ok(out.includes("<em>it</em>"));
});

test("parseMarkdown returns block descriptors", () => {
  const blocks = parseMarkdown("# H\n\ntext");
  assert.ok(Array.isArray(blocks));
  assert.equal(blocks[0].type, "heading");
  assert.equal(blocks[0].level, 1);
});
