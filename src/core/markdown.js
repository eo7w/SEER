import { codeBlockHtml } from "./highlight.js";
import { esc } from "./utils.js";
import { F } from "./constants.js";
/* Script — src/core/markdown.js */

/* ---------------------- 10. MARKDOWN RENDERER ---------------------- */

export function parseMarkdown(src) {
  const lines = src.split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith(F)) {
      const lang = line.trim().slice(3).trim() || "text";
      const body = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith(F)) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: "code", lang: lang, lines: body });
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      blocks.push({ type: "heading", level: level, text: line.replace(/^#+\s*/, "") });
      i += 1;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
        i += 1;
      }
      blocks.push(ordered ? { type: "ol", items: items } : { type: "ul", items: items });
      continue;
    }
    if (/^>\s?/.test(line)) {
      const parts = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        parts.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: parts.join(" ") });
      continue;
    }
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|?$/.test(lines[i + 1])) {
      const cells = function (l) {
        return l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) { return c.trim(); });
      };
      const header = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(cells(lines[i]));
        i += 1;
      }
      blocks.push({ type: "table", header: header, rows: rows });
      continue;
    }
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    const para = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3}\s|>|\||\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) &&
      !lines[i].trim().startsWith(F)
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "para", text: para.join(" ") });
  }
  return blocks;
}

export const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]]+\]\([^)]+\)|~~[^~]+~~)/g;

export function inlineHtml(text) {
  let out = "";
  let last = 0;
  let m;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) out += esc(text.slice(last, m.index));
    const s = m[0];
    if (s.startsWith("**")) {
      out += '<strong class="font-semibold">' + esc(s.slice(2, -2)) + "</strong>";
    } else if (s.startsWith("~~")) {
      out += '<s class="opacity-60">' + esc(s.slice(2, -2)) + "</s>";
    } else if (s.startsWith("`")) {
      out += '<code class="md-code">' + esc(s.slice(1, -1)) + "</code>";
    } else if (s.startsWith("[")) {
      const mm = s.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (mm) out += '<a class="md-link" href="' + esc(mm[2]) + '" target="_blank" rel="noreferrer">' + esc(mm[1]) + "</a>";
      else out += esc(s);
    } else {
      out += "<em>" + esc(s.slice(1, -1)) + "</em>";
    }
    last = m.index + s.length;
  }
  if (last < text.length) out += esc(text.slice(last));
  return out;
}

/* --- syntax highlighting (naive but pretty) --- */
export function mdHtml(text) {
  const blocks = parseMarkdown(text);
  let out = "";
  for (const b of blocks) {
    if (b.type === "code") { out += codeBlockHtml(b.lang, b.lines); continue; }
    if (b.type === "heading") {
      const tag = b.level === 1 ? "h1" : b.level === 2 ? "h2" : "h3";
      out += "<" + tag + ">" + inlineHtml(b.text) + "</" + tag + ">";
      continue;
    }
    if (b.type === "ul") { out += "<ul>" + b.items.map(function (it) { return "<li>" + inlineHtml(it) + "</li>"; }).join("") + "</ul>"; continue; }
    if (b.type === "ol") { out += "<ol>" + b.items.map(function (it) { return "<li>" + inlineHtml(it) + "</li>"; }).join("") + "</ol>"; continue; }
    if (b.type === "quote") { out += '<div class="md-quote">' + inlineHtml(b.text) + "</div>"; continue; }
    if (b.type === "table") {
      out +=
        '<div class="md-table-wrap"><table class="md-table"><thead><tr>' +
        b.header.map(function (h) { return "<th>" + inlineHtml(h) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        b.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inlineHtml(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table></div>";
      continue;
    }
    if (b.type === "hr") { out += '<hr class="md-hr"/>'; continue; }
    out += "<p>" + inlineHtml(b.text) + "</p>";
  }
  return '<div class="md-wrap">' + out + "</div>";
}

/* ---------------------- STATE ---------------------- */
