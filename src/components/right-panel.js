import { clamp, esc, timeAgo } from "../core/utils.js";
import { E } from "../core/dom.js";
import { HUES } from "../core/theme.js";
import { icon } from "../core/icons.js";
import { isNarrow } from "./shell.js";
import { state, ui } from "../core/state.js";
import { TOOLS } from "../data/tools.js";
/* Script — src/components/right-panel.js */

/* ---------- right panel: projects ---------- */
export function projectIcon(c, idx) {
  const palette = [
    { bg: HUES.blue.bg, fg: HUES.blue.fg, ic: "chat" },
    { bg: HUES.violet.bg, fg: HUES.violet.fg, ic: "wand" },
    { bg: HUES.emerald.bg, fg: HUES.emerald.fg, ic: "chart" },
    { bg: HUES.amber.bg, fg: HUES.amber.fg, ic: "pen" },
    { bg: HUES.cyan.bg, fg: HUES.cyan.fg, ic: "code" },
    { bg: HUES.rose.bg, fg: HUES.rose.fg, ic: "folder" },
  ];
  const p = palette[idx % palette.length];
  return '<div class="pc-ico" style="background:' + p.bg + ';color:' + p.fg + '">' + icon(p.ic, "") + '</div>';
}

export function rightHtml() {
  const q = ui.rightSearch.trim().toLowerCase();
  const convs = state.conversations
    .filter(function (c) { return !q || c.title.toLowerCase().includes(q); })
    .slice()
    .sort(function (a, b) { return b.updatedAt - a.updatedAt; })
    .slice(0, 7);
  const tools = TOOLS;
  const usedTokens = state.conversations.reduce(function (n, c) {
    return n + c.messages.reduce(function (m, x) { return m + (x.tokens || 0); }, 0);
  }, 0);
  const pct = clamp(Math.round((usedTokens % 12000) / 120), 0, 100);

  return (
    '<div class="rp-head">' +
      '<div class="rp-title">Projects</div>' +
      '<span class="rp-count">' + convs.length + '</span>' +
      '<button class="ibtn ibtn-xs" data-act="new-chat" title="New project">' + icon("plus", "") + '</button>' +
    '</div>' +
    '<div class="rp-scroll">' +
      '<div class="rp-search">' + icon("magnifier", "") +
        '<input data-inp="right-search" placeholder="Search projects" value="' + esc(ui.rightSearch) + '" />' +
      '</div>' +

      '<div class="rp-label">Recent projects</div>' +
      (convs.length
        ? convs.map(function (c, i) {
            const last = c.messages[c.messages.length - 1];
            const excerpt = last ? last.content.replace(/[#*`>|]/g, "").slice(0, 90) : "Empty conversation";
            return (
              '<button class="pcard' + (c.id === state.activeId ? " active" : "") + '" data-act="select-conv" data-id="' + c.id + '" style="animation-delay:' + (i * 40) + 'ms">' +
                '<div class="pc-top">' +
                  projectIcon(c, i) +
                  '<div class="f1 min-w0">' +
                    '<div class="pc-h trunc">' + esc(c.title) + '</div>' +
                    '<div class="pc-meta">' +
                      '<span class="m">' + icon("chat", "") + ' ' + c.messages.length + '</span>' +
                      '<span class="m">' + icon("clock", "") + ' ' + timeAgo(c.updatedAt) + '</span>' +
                      (c.pinned ? '<span class="pc-tag" style="background:var(--brand-soft);color:var(--brand)">Pinned</span>' : "") +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="pc-p clamp-2">' + esc(excerpt) + '</div>' +
              '</button>'
            );
          }).join("")
        : '<div class="t-13 t-3" style="padding:10px 6px">No projects yet — start a chat.</div>') +

      '<div class="rp-label">AI tools</div>' +
      '<div class="toolgrid">' +
        tools.map(function (t, i) {
          const hue = Object.values(HUES)[i % 6];
          return (
            '<button class="toolchip" data-act="tool-pick" data-prompt="' + esc(t.t) + '">' +
              '<span style="color:' + hue.fg + '">' + icon(t.ic, "") + '</span>' +
              '<span class="t">' + t.t + '</span>' +
            '</button>'
          );
        }).join("") +
      '</div>' +

      '<div class="usage">' +
        '<div style="display:flex;align-items:center;justify-content:space-between">' +
          '<span class="t-13 bold">Daily usage</span>' +
          '<span class="t-12 t-3">' + pct + '%</span>' +
        '</div>' +
        '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="t-12 t-3" style="margin-top:8px">' +
          (usedTokens > 1000 ? (usedTokens / 1000).toFixed(1) + "k" : usedTokens) + ' tokens used · resets in 12h' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

export function renderRight() {
  const el = E("#rg-right");
  if (!el) return;
  if (isNarrow()) { el.innerHTML = ""; el.style.display = "none"; }
  else {
    el.style.display = "";
    el.innerHTML = ui.rightOpen ? rightHtml() : "";
  }
}
