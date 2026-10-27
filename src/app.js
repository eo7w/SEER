import { appHtml, isMobile, lastMobile, onResize } from "./components/shell.js";
import { DEFAULT_SETTINGS } from "./data/settings.js";
import { E, renderAll, renderMain } from "./core/dom.js";
import { KEY_CONVS, KEY_SEEDED, KEY_SETTINGS, loadJSON, saveJSON } from "./core/storage.js";
import { onClick, onDblClick, onFocusOut, onInput, onKeydown, onScroll } from "./core/events.js";
import { saveConvs } from "./core/actions.js";
import { seedConversations } from "./data/seed.js";
import { state, ui } from "./core/state.js";
import { toast } from "./components/toast.js";
/* Script — src/app.js */

/* ---------- boot ---------- */
export function boot() {
  const savedConvs = loadJSON(KEY_CONVS, null);
  const savedSettings = loadJSON(KEY_SETTINGS, null);
  if (savedSettings) state.settings = Object.assign({}, DEFAULT_SETTINGS, savedSettings);
  if (savedConvs && savedConvs.length) {
    state.conversations = savedConvs;
    const sorted = state.conversations.slice().sort(function (a, b) { return b.updatedAt - a.updatedAt; });
    state.activeId = sorted[0].id;
  } else {
    state.conversations = seedConversations();
    const sorted = state.conversations.slice().sort(function (a, b) { return b.updatedAt - a.updatedAt; });
    state.activeId = sorted[0].id;
    saveConvs();
    saveJSON(KEY_SEEDED, "1");
  }

  const app = E("#app");
  app.innerHTML = appHtml();
  renderAll();
  const sc = E("#chat-scroll");
  if (sc) sc.scrollTop = sc.scrollHeight;

  document.addEventListener("click", onClick);
  document.addEventListener("input", onInput);
  document.addEventListener("focusout", onFocusOut);
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("dblclick", onDblClick);
  document.addEventListener("scroll", onScroll, { capture: true, passive: true });
  window.addEventListener("resize", onResize);
  lastMobile = isMobile();

  /* drag & drop files onto composer (document delegation: composer is re-rendered) */
  let dragDepth = 0;
  document.addEventListener("dragover", function (e) {
    if (e.target && e.target.closest && e.target.closest("#composer")) e.preventDefault();
  });
  document.addEventListener("dragenter", function (e) {
    if (e.target && e.target.closest && e.target.closest("#composer")) { e.preventDefault(); dragDepth++; document.body.classList.add("composer-drag"); }
  });
  document.addEventListener("dragleave", function () {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) document.body.classList.remove("composer-drag");
  });
  document.addEventListener("drop", function (e) {
    const zone = e.target && e.target.closest ? e.target.closest("#composer") : null;
    if (!zone) return;
    e.preventDefault();
    dragDepth = 0;
    document.body.classList.remove("composer-drag");
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      ui.attachments.push(e.dataTransfer.files[0].name);
      renderMain(true);
      toast("File attached");
    }
  });

  /* stop stream when leaving */
  window.addEventListener("beforeunload", function () { ui.streamAbort = true; });
}
