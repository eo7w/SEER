import { activeConv, E } from "../core/dom.js";
import { esc } from "../core/utils.js";
import { icon } from "../core/icons.js";
import { isMobile } from "./shell.js";
import { MODELS } from "../data/models.js";
import { state, ui } from "../core/state.js";
/* Script — src/components/topbar.js */

/* ================================================================
   CHAT — topbar, messages, composer, empty state, analytics view
   ================================================================ */

/* ---------- topbar ---------- */
export function topbarHtml() {
  const conv = activeConv();
  const isChat = ui.view === "chat";
  return (
    '<button class="ibtn' + (isMobile() ? "" : " hidden") + '" data-act="open-sidebar" title="Menu">' + icon("menu", "") + '</button>' +
    '<div class="tb-title">' +
      (isChat
        ? '<div class="tb-crumb">' + icon("chat", "") + '<span>' + (conv ? esc(conv.title.length > 42 ? conv.title.slice(0, 42) + "…" : conv.title) : "New conversation") + '</span></div>'
        : '<div class="tb-crumb">' + icon("chart", "") + '<span>Workspace analytics</span></div>') +
      (isChat && conv
        ? (ui.topDraft !== ""
            ? '<input class="tb-name-input" data-inp="top-rename" value="' + esc(ui.topDraft) + '" />'
            : '<div class="tb-name" data-act="top-edit" title="Double-click to rename">' + esc(conv.title) + '</div>')
        : "") +
      (isChat ? '<span class="tb-status"><span class="dot"></span>Online</span>' : "") +
    '</div>' +
    '<div class="tb-actions">' +
      (isChat
        ? '<div class="rel">' +
            '<button class="ibtn" data-act="export-menu" title="Share or export">' + icon("share", "") + '</button>' +
            (ui.exportOpen
              ? '<div class="menu abs" style="top:42px;right:0;z-index:50">' +
                  '<div class="menu-head">Share & export</div>' +
                  '<button class="menu-item" data-act="export-copy">' + icon("copy", "") + ' Copy as markdown</button>' +
                  '<button class="menu-item" data-act="export-md">' + icon("download", "") + ' Download .md file</button>' +
                  '<div class="menu-sep"></div>' +
                  '<button class="menu-item" data-act="copy-link-toast">' + icon("key", "") + ' Copy share link</button>' +
                '</div>'
              : "") +
          '</div>' +
          '<div class="rel">' +
            '<button class="ibtn" data-act="model-menu" title="Model">' + icon("brain", "") + '</button>' +
            (ui.modelOpen
              ? '<div class="menu abs" style="top:42px;right:0;z-index:50;width:290px">' +
                  '<div class="menu-head">Choose model</div>' +
                  MODELS.map(function (m) {
                    const on = m.id === state.settings.defaultModel;
                    return (
                      '<button class="menu-item" data-act="set-model" data-id="' + m.id + '" style="align-items:flex-start;padding:10px">' +
                        '<span style="color:var(--brand)">' + icon(on ? "check" : "sparkle", "") + '</span>' +
                        '<span class="f1">' +
                          '<span class="t-14 bold">' + esc(m.name) + '</span>' +
                          '<span class="t-12 t-3 block">' + esc(m.tagline) + '</span>' +
                          '<span class="t-11 t-3 block mt-4">' + m.context + ' context · ' + m.tags.join(", ") + '</span>' +
                        '</span>' +
                      '</button>'
                    );
                  }).join("") +
                '</div>'
              : "") +
          '</div>'
        : "") +
      '<button class="ibtn" data-act="view-analytics" title="Analytics">' + icon("chart", "") + '</button>' +
      '<button class="ibtn" data-act="toggle-theme" title="Toggle theme">' + icon(state.settings.theme === "dark" ? "sun" : "moon", "") + '</button>' +
      (!isMobile() ? '<button class="ibtn' + (ui.rightOpen ? " active" : "") + '" data-act="toggle-right" title="Toggle projects panel">' + icon("panel", "") + '</button>' : "") +
    '</div>'
  );
}

export function renderTopbar() {
  const el = E("#rg-topbar");
  if (el) el.innerHTML = topbarHtml();
}

