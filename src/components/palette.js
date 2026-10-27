import { E } from "../core/dom.js";
import { esc, timeAgo } from "../core/utils.js";
import { icon } from "../core/icons.js";
import { modalHtml } from "./modals.js";
import { state, ui } from "../core/state.js";
/* Script — src/components/palette.js */

/* ---------- command palette ---------- */
export function paletteCommands() {
  const cmds = [
    { ic: "plus", h: "New chat", p: "Start a fresh conversation", run: "new-chat" },
    { ic: "chart", h: "Open analytics", p: "See workspace stats", run: "view-analytics" },
    { ic: "chat", h: "Back to chat", p: "Return to conversation", run: "view-chat" },
    { ic: "grid", h: "Templates", p: "Browse prompt templates", run: "open-templates" },
    { ic: "gear", h: "Settings", p: "Open preferences", run: "open-settings" },
    { ic: "keyboard", h: "Shortcuts", p: "View keyboard shortcuts", run: "open-shortcuts" },
    { ic: "moon", h: "Toggle theme", p: "Switch light / dark", run: "toggle-theme" },
    { ic: "panel", h: "Toggle projects panel", p: "Show or hide right panel", run: "toggle-right" },
    { ic: "download", h: "Export conversation", p: "Download as markdown", run: "export-md" },
  ];
  const q = ui.paletteQ.trim().toLowerCase();
  const convCmds = state.conversations
    .filter(function (c) { return !q || c.title.toLowerCase().includes(q); })
    .slice(0, 5)
    .map(function (c) { return { ic: "chat", h: c.title, p: "Open conversation · " + timeAgo(c.updatedAt), run: "select-conv", id: c.id }; });
  return cmds.filter(function (c) { return !q || c.h.toLowerCase().includes(q) || c.p.toLowerCase().includes(q); }).concat(convCmds);
}

export function paletteHtml() {
  const cmds = paletteCommands();
  return (
    '<div class="overlay" data-act="modal-backdrop" style="align-items:flex-start;justify-content:center">' +
      '<div class="palette">' +
        '<div class="pal-in">' +
          icon("magnifier", "") +
          '<input data-inp="palette" placeholder="Type a command or search chats..." value="' + esc(ui.paletteQ) + '" />' +
          '<kbd class="k">Esc</kbd>' +
        '</div>' +
        '<div class="pal-list">' +
          (cmds.length
            ? cmds.map(function (c, i) {
                return (
                  '<button class="pal-item' + (i === ui.paletteIdx ? " sel" : "") + '" data-act="palette-run" data-run="' + c.run + '" ' + (c.id ? 'data-id="' + c.id + '"' : "") + '>' +
                    '<span class="pi-ico">' + icon(c.ic, "") + '</span>' +
                    '<span class="f1 min-w0"><span class="pi-h trunc block">' + esc(c.h) + '</span><span class="pi-p trunc block">' + esc(c.p) + '</span></span>' +
                  '</button>'
                );
              }).join("")
            : '<div class="pal-empty">No results for “' + esc(ui.paletteQ) + '”</div>') +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

export function renderPalette() {
  const el = E("#rg-modal");
  if (el) el.innerHTML = ui.palette ? paletteHtml() : (ui.modal ? modalHtml() : "");
}

