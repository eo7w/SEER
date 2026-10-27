import { esc } from "./utils.js";
import { icon } from "./icons.js";
/* Script — src/core/highlight.js */

export const KEYWORDS = {
  tsx: ["import", "from", "export", "default", "function", "return", "const", "let", "interface", "type", "useState", "useMemo", "new", "if", "else", "for", "while", "class", "extends", "switch", "case", "as", "of", "in"],
  ts: ["import", "from", "export", "default", "function", "return", "const", "let", "interface", "type", "new", "if", "else", "class", "extends"],
  js: ["import", "from", "export", "default", "function", "return", "const", "let", "new", "if", "else", "for", "while", "class"],
  python: ["def", "class", "import", "from", "return", "if", "elif", "else", "for", "while", "lambda", "None", "True", "False", "with", "as", "in", "not", "and", "or", "list", "dict"],
  css: ["root", "important"],
  sql: ["CREATE", "TABLE", "PRIMARY", "KEY", "REFERENCES", "ON", "DELETE", "CASCADE", "INDEX", "SELECT", "JOIN", "WHERE", "ORDER", "BY", "LIMIT", "NOT", "NULL", "UNIQUE", "DEFAULT", "TIMESTAMPTZ", "BIGSERIAL", "BIGINT", "TEXT", "INTEGER", "AS", "INSERT", "INTO", "VALUES", "UPDATE", "SET"],
  bash: ["npm", "npx", "cd", "sudo", "run", "install", "git", "curl"],
};

export function highlightHtml(line, lang) {
  const kw = KEYWORDS[lang] || KEYWORDS.js;
  let out = "";
  const allowHash = lang === "python";
  const allowDash = lang === "sql";
  const parts =
    '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')' +
    "|\\/\\*.*?\\*\\/" +
    "|\\/\\/[^\\n]*" +
    (allowHash ? "|#[^\\n]*" : "") +
    (allowDash ? "|--[^\\n]*" : "");
  const re = new RegExp(parts + "|\\b\\d+(?:\\.\\d+)?\\b|[A-Za-z_$][\\w$-]*|\\s+|.", "g");
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(line)) !== null) {
    const t = m[0];
    if (t.startsWith("//") || t.startsWith("/*") || (t.startsWith("#") && allowHash) || (t.startsWith("--") && allowDash)) {
      out += '<span class="tok-c">' + esc(t) + "</span>";
    } else if (t.startsWith('"') || t.startsWith("'")) {
      out += '<span class="tok-s">' + esc(t) + "</span>";
    } else if (/^\d/.test(t)) {
      out += '<span class="tok-n">' + esc(t) + "</span>";
    } else if (kw.includes(t) || (lang === "sql" && kw.includes(t.toUpperCase()))) {
      out += '<span class="tok-k">' + esc(t) + "</span>";
    } else {
      out += esc(t);
    }
  }
  return out;
}

/* copy buttons read code straight from the sibling <pre> in the DOM */
export function codeBlockHtml(lang, lines) {
  return (
    '<div class="codeblock">' +
      '<div class="cb-head">' +
        '<span class="cb-lang">' + esc(lang) + '</span>' +
        '<button class="icon-btn" title="Copy code" data-act="code-copy">' + icon("copy", "i12") + "</button>" +
      "</div>" +
      "<pre><code>" +
        lines.map(function (l) { return "<div>" + (l === "" ? "\u00a0" : highlightHtml(l, lang)) + "</div>"; }).join("") +
      "</code></pre>" +
    "</div>"
  );
}

