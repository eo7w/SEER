import { E, renderAll } from "../core/dom.js";
import { renderRight } from "./right-panel.js";
import { ui } from "../core/state.js";
/* Script — src/components/shell.js */

/* ---------- app shell ---------- */
export function appHtml() {
  const railCls = ui.rail && !isMobile() ? "rail" : "";
  return (
    '<div class="' + railCls + '" data-app>' +
      '<aside class="sidebar' + (isMobile() && ui.sidebarOpen ? " open" : "") + '" id="rg-sidebar"></aside>' +
      (isMobile() && ui.sidebarOpen
        ? '<div class="backdrop" data-act="close-sidebar"></div>'
        : "") +
      '<div class="maincol">' +
        '<header class="topbar" id="rg-topbar"></header>' +
        '<div class="chatwrap">' +
          '<div class="chatcol" id="rg-main"></div>' +
          '<aside class="rpanel" id="rg-right"></aside>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="rg-modal"></div>' +
    '<div id="toasts"></div>'
  );
}

export function isMobile() { return window.innerWidth <= 900; }
export function isNarrow() { return window.innerWidth <= 1180; }

/* ---------- shell render ---------- */
export function renderShell() {
  const app = E("#app");
  app.innerHTML = appHtml();
  renderAll();
  const sc = E("#chat-scroll");
  if (sc) sc.scrollTop = sc.scrollHeight;
}

export let lastMobile = null;
export function onResize() {
  const m = isMobile();
  if (m !== lastMobile) {
    lastMobile = m;
    if (m) { ui.rail = false; ui.sidebarOpen = false; }
    renderShell();
  } else {
    renderRight();
  }
}
