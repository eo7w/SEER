import { analyticsHtml } from "../components/analytics.js";
import { applyTheme } from "./theme.js";
import { chatViewHtml } from "../components/chat.js";
import { modelById } from "../data/models.js";
import { renderRight } from "../components/right-panel.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderTopbar } from "../components/topbar.js";
import { state, ui } from "./state.js";
/* Script — src/core/dom.js */

export function E(sel) { return document.querySelector(sel); }
export function activeConv() { return state.conversations.find(function (c) { return c.id === state.activeId; }) || null; }
export function activeModel() { return modelById(state.settings.defaultModel); }

/* ---------- boot render ---------- */
export function renderAll() {
  renderSidebar();
  renderTopbar();
  renderMain();
  renderRight();
  applyTheme();
}
/* ---------- main dispatcher ---------- */
export function renderMain(preserveScroll) {
  const el = E("#rg-main");
  if (!el) return;
  const sc = E("#chat-scroll");
  const scrollPos = sc ? sc.scrollTop : 0;
  const atBottom = sc ? sc.scrollHeight - sc.scrollTop - sc.clientHeight < 120 : true;
  el.innerHTML = ui.view === "analytics" ? analyticsHtml() : chatViewHtml();
  const nsc = E("#chat-scroll");
  if (nsc) {
    if (preserveScroll && !atBottom) nsc.scrollTop = scrollPos;
    else if (ui.view === "chat") nsc.scrollTop = nsc.scrollHeight;
  }
}
