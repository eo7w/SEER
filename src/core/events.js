import { actClearAll, actDeleteConv, actDeleteMessage, actEditResend, actExportCopy, actExportMd, actNewChat, actRegenerate, actSelectConv, actSend, actTogglePin, closeAllMenus, copyText, saveConvs, saveSettings, setComposerText } from "./actions.js";
import { activeConv, E, renderMain } from "./dom.js";
import { applyTheme } from "./theme.js";
import { isMac } from "./constants.js";
import { modelById } from "../data/models.js";
import { paletteCommands } from "../components/palette.js";
import { renderModal } from "../components/modals.js";
import { renderRight } from "../components/right-panel.js";
import { renderShell } from "../components/shell.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderTopbar } from "../components/topbar.js";
import { state, ui } from "./state.js";
import { toast } from "../components/toast.js";
/* Script — src/core/events.js */

/* ---------- click delegation ---------- */
export function onClick(e) {
  const t = e.target.closest("[data-act]");
  const act = t ? t.getAttribute("data-act") : null;

  const menuActs = ["export-menu", "model-menu", "profile-menu", "attach-menu", "set-model", "noop"];
  if (!menuActs.includes(act)) {
    const hadMenus = ui.exportOpen || ui.modelOpen || ui.profileOpen || ui.attachMenu;
    if (hadMenus && act !== null && !e.target.closest(".menu")) closeAllMenus();
    if (act === null && hadMenus) closeAllMenus();
  }
  if (!act) return;

  switch (act) {
    case "noop": return;
    case "open-sidebar": ui.sidebarOpen = true; renderShell(); return;
    case "close-sidebar": ui.sidebarOpen = false; renderShell(); return;
    case "toggle-rail": ui.rail = !ui.rail; renderShell(); return;
    case "toggle-right": ui.rightOpen = !ui.rightOpen; renderRight(); return;
    case "new-chat": actNewChat(); return;
    case "select-conv": actSelectConv(t.getAttribute("data-id")); return;
    case "view-chat": ui.view = "chat"; ui.modal = null; ui.palette = false; renderTopbar(); renderMain(); renderModal(); return;
    case "view-analytics": ui.view = "analytics"; ui.modal = null; ui.palette = false; renderTopbar(); renderMain(); renderModal(); return;
    case "toggle-recent": ui.recentOpen = !ui.recentOpen; renderSidebar(); return;
    case "open-templates": ui.modal = "templates"; renderModal(); return;
    case "open-docs": toast("Documents coming soon ✨"); return;
    case "open-help": toast("Help center coming soon ✨"); return;
    case "upgrade-toast": toast("Pro plan is a demo ✨"); return;
    case "logout-toast": toast("Signed out (demo) 👋"); return;
    case "profile-menu": ui.profileOpen = !ui.profileOpen; renderSidebar(); return;
    case "toggle-theme":
      state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
      saveSettings(); applyTheme(); renderTopbar(); renderSidebar(); return;
    case "model-menu": ui.modelOpen = !ui.modelOpen; ui.exportOpen = false; renderTopbar(); return;
    case "export-menu": ui.exportOpen = !ui.exportOpen; ui.modelOpen = false; renderTopbar(); return;
    case "export-copy": ui.exportOpen = false; renderTopbar(); actExportCopy(); return;
    case "export-md": ui.exportOpen = false; renderTopbar(); actExportMd(); return;
    case "copy-link-toast": ui.exportOpen = false; renderTopbar(); toast("Share link copied (demo)"); return;
    case "pin-conv": actTogglePin(t.getAttribute("data-id")); return;
    case "delete-conv": actDeleteConv(t.getAttribute("data-id")); return;
    case "set-model":
      state.settings.defaultModel = t.getAttribute("data-id");
      ui.modelOpen = false;
      saveSettings();
      renderTopbar();
      renderMain(true);
      toast("Default model: " + modelById(state.settings.defaultModel).name);
      return;
    case "send": actSend(); return;
    case "stop-stream": ui.streamAbort = true; return;
    case "suggestion-pick":
    case "template-pick":
      ui.modal = null; renderModal();
      setComposerText(t.getAttribute("data-prompt"));
      return;
    case "tool-pick":
      setComposerText("Help me with " + t.getAttribute("data-prompt").toLowerCase() + " — ");
      return;
    case "jump-bottom": {
      const sc = E("#chat-scroll");
      if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: "smooth" });
      return;
    }
    case "attach-menu": ui.attachMenu = !ui.attachMenu; renderMain(true); return;
    case "attach-add": {
      const label = (t.getAttribute("data-t") || "file|Attachment").split("|")[1];
      ui.attachments.push(label);
      ui.attachMenu = false;
      renderMain(true);
      return;
    }
    case "attach-remove":
      ui.attachments.splice(parseInt(t.getAttribute("data-i"), 10), 1);
      renderMain(true);
      return;
    case "toggle-deep": ui.deepThink = !ui.deepThink; renderMain(true); return;
    case "toggle-web": ui.webSearch = !ui.webSearch; renderMain(true); return;
    case "mic": ui.listening = !ui.listening; renderMain(true); toast(ui.listening ? "Listening… (demo)" : "Voice off"); return;
    case "msg-copy": {
      const conv = activeConv();
      const m = conv && conv.messages.find(function (x) { return x.id === t.getAttribute("data-mid"); });
      if (m) copyText(m.content, "Message copied");
      return;
    }
    case "code-copy": {
      const blk = t.closest(".codeblock");
      const pre = blk ? blk.querySelector("pre") : null;
      copyText(pre ? pre.textContent : "", "Code copied");
      return;
    }
    case "toggle-trait": {
      const tr = t.getAttribute("data-t");
      const ix = state.settings.traits.indexOf(tr);
      if (ix >= 0) state.settings.traits.splice(ix, 1);
      else state.settings.traits.push(tr);
      saveSettings();
      renderModal();
      return;
    }
    case "msg-edit": ui.editingMsgId = t.getAttribute("data-mid"); ui.msgDraft = ""; renderMain(true); return;
    case "msg-edit-cancel": ui.editingMsgId = null; renderMain(true); return;
    case "msg-edit-send": actEditResend(t.getAttribute("data-mid")); return;
    case "msg-regen": actRegenerate(t.getAttribute("data-mid")); return;
    case "msg-rate": {
      const mid = t.getAttribute("data-mid");
      const row = document.querySelector('[data-mid="' + mid + '"]');
      const btn = row && row.querySelector('[data-rate="' + t.getAttribute("data-rate") + '"]');
      if (btn) btn.classList.add("on");
      toast(t.getAttribute("data-rate") === "up" ? "Thanks for the feedback 👍" : "Noted — we'll do better 👎");
      return;
    }
    case "msg-delete": actDeleteMessage(t.getAttribute("data-mid")); return;
    case "top-edit": {
      const conv = activeConv();
      if (conv) { ui.topDraft = conv.title; renderTopbar(); const inp = E('[data-inp="top-rename"]'); if (inp) inp.focus(); }
      return;
    }
    case "open-settings": ui.profileOpen = false; ui.modal = "settings"; ui.settingsTab = "general"; renderSidebar(); renderModal(); return;
    case "open-shortcuts": ui.modal = "shortcuts"; renderModal(); return;
    case "settings-tab": ui.settingsTab = t.getAttribute("data-t"); renderModal(); return;
    case "set-theme": state.settings.theme = t.getAttribute("data-t"); saveSettings(); applyTheme(); renderModal(); renderTopbar(); renderSidebar(); return;
    case "set-accent": state.settings.accent = t.getAttribute("data-t"); saveSettings(); applyTheme(); renderModal(); return;
    case "toggle-setting-timestamps": state.settings.showTimestamps = !state.settings.showTimestamps; saveSettings(); renderModal(); renderMain(true); return;
    case "toggle-setting-enter": state.settings.sendOnEnter = !state.settings.sendOnEnter; saveSettings(); renderModal(); return;
    case "toggle-setting-save": toast("Auto-save is always on"); return;
    case "clear-all-start": ui.modal = "clear"; renderModal(); return;
    case "clear-all-cancel": ui.modal = "settings"; renderModal(); return;
    case "clear-all-confirm": actClearAll(); return;
    case "close-modal": ui.modal = null; ui.palette = false; renderModal(); return;
    case "modal-backdrop":
      if (e.target === t) { ui.modal = null; ui.palette = false; renderModal(); }
      return;
    case "palette-run": {
      const run = t.getAttribute("data-run");
      const id = t.getAttribute("data-id");
      ui.palette = false;
      renderModal();
      if (run === "select-conv" && id) { actSelectConv(id); return; }
      runPaletteCommand(run);
      return;
    }
  }
  // synthetic palette command dispatch
}

export function runPaletteCommand(run) {
  switch (run) {
    case "new-chat": actNewChat(); return;
    case "view-analytics": ui.view = "analytics"; renderTopbar(); renderMain(); return;
    case "view-chat": ui.view = "chat"; renderTopbar(); renderMain(); return;
    case "open-templates": ui.modal = "templates"; renderModal(); return;
    case "open-settings": ui.modal = "settings"; renderModal(); return;
    case "open-shortcuts": ui.modal = "shortcuts"; renderModal(); return;
    case "toggle-theme":
      state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
      saveSettings(); applyTheme(); renderTopbar(); return;
    case "toggle-right": ui.rightOpen = !ui.rightOpen; renderRight(); return;
    case "export-md": actExportMd(); return;
  }
}

/* ---------- input delegation ---------- */
export function onInput(e) {
  const t = e.target.closest("[data-inp]");
  if (!t) return;
  const kind = t.getAttribute("data-inp");
  switch (kind) {
    case "composer": {
      ui.composerText = t.value;
      t.style.height = "auto";
      t.style.height = Math.min(t.scrollHeight, 200) + "px";
      return;
    }
    case "sidebar-search": ui.search = t.value; renderSidebar(); refocusInput('[data-inp="sidebar-search"]', t.value); return;
    case "right-search": ui.rightSearch = t.value; renderRight(); refocusInput('[data-inp="right-search"]', t.value); return;
    case "top-rename": ui.topDraft = t.value; return;
    case "msg-edit": ui.msgDraft = t.value; return;
    case "palette": ui.paletteQ = t.value; ui.paletteIdx = 0; renderModal(); refocusInput('[data-inp="palette"]', t.value); return;
    case "temperature": {
      state.settings.temperature = parseFloat(t.value) || 0;
      saveSettings();
      const sib = t.parentElement.querySelector("span");
      if (sib) sib.textContent = Number(state.settings.temperature).toFixed(1);
      return;
    }
    case "speed": state.settings.streamSpeed = t.value; saveSettings(); return;
    case "nickname":
      state.settings.nickname = t.value.trim() || "friend";
      saveSettings();
      return;
    case "instructions": state.settings.customInstructions = t.value; saveSettings(); return;
    case "zoom": {
      state.settings.fontScale = parseFloat(t.value) || 1;
      saveSettings();
      applyTheme();
      const lbl = E("#lbl-zoom");
      if (lbl) lbl.textContent = "Scale " + Math.round(state.settings.fontScale * 100) + "%";
      return;
    }
  }
}

export function refocusInput(sel, val) {
  const inp = E(sel);
  if (inp && document.activeElement !== inp) {
    inp.focus();
    inp.setSelectionRange(val.length, val.length);
  }
}

export function onFocusOut(e) {
  const t = e.target.closest ? e.target.closest("[data-inp]") : null;
  if (!t) return;
  const kind = t.getAttribute("data-inp");
  if (kind === "top-rename") {
    const conv = activeConv();
    const v = t.value.trim();
    if (conv && v) { conv.title = v; saveConvs(); }
    ui.topDraft = "";
    renderTopbar(); renderSidebar(); renderRight();
  } else if (kind === "msg-edit") {
    /* keep draft; cancel handled by button */
  }
}

/* ---------- key handling ---------- */
export function onKeydown(e) {
  const mod = isMac ? e.metaKey : e.ctrlKey;

  if (e.key === "Escape") {
    if (ui.palette) { ui.palette = false; renderModal(); return; }
    if (ui.modal) { ui.modal = null; renderModal(); return; }
    if (ui.editingMsgId) { ui.editingMsgId = null; renderMain(true); return; }
    if (ui.exportOpen || ui.modelOpen || ui.profileOpen || ui.attachMenu) { closeAllMenus(); return; }
    if (ui.sidebarOpen) { ui.sidebarOpen = false; renderShell(); return; }
    return;
  }

  if (mod && (e.key === "k" || e.key === "K")) {
    e.preventDefault();
    ui.palette = !ui.palette;
    ui.paletteQ = "";
    ui.paletteIdx = 0;
    renderModal();
    const inp = E('[data-inp="palette"]');
    if (inp) inp.focus();
    return;
  }

  if (ui.palette) {
    const cmds = paletteCommands();
    if (e.key === "ArrowDown") { e.preventDefault(); ui.paletteIdx = Math.min(ui.paletteIdx + 1, cmds.length - 1); renderModal(); refocusInput('[data-inp="palette"]', ui.paletteQ); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); ui.paletteIdx = Math.max(ui.paletteIdx - 1, 0); renderModal(); refocusInput('[data-inp="palette"]', ui.paletteQ); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const c = cmds[ui.paletteIdx];
      if (c) {
        ui.palette = false;
        renderModal();
        if (c.id) actSelectConv(c.id);
        else runPaletteCommand(c.run);
      }
      return;
    }
    return;
  }

  const composer = e.target.closest && e.target.closest('[data-inp="composer"]');
  if (composer) {
    if (e.key === "Enter" && !e.shiftKey && state.settings.sendOnEnter) {
      e.preventDefault();
      actSend();
      return;
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      actSend();
      return;
    }
  }

  const rename = e.target.closest && e.target.closest('[data-inp="top-rename"]');
  if (rename && e.key === "Enter") {
    e.preventDefault();
    rename.blur();
    return;
  }
  const edit = e.target.closest && e.target.closest('[data-inp="msg-edit"]');
  if (edit && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    ui.msgDraft = edit.value;
    actEditResend(ui.editingMsgId);
    return;
  }
}

/* double-click title to rename */
export function onDblClick(e) {
  if (e.target.closest(".tb-name")) {
    const conv = activeConv();
    if (conv) {
      ui.topDraft = conv.title;
      renderTopbar();
      const inp = E('[data-inp="top-rename"]');
      if (inp) { inp.focus(); inp.select(); }
    }
  }
}

/* ---------- scroll shadow / jump button (document capture: element is re-rendered) ---------- */
export function onScroll(e) {
  if (!e || (e.target && e.target.id !== "chat-scroll")) return;
  const sc = E("#chat-scroll");
  if (!sc) return;
  const far = sc.scrollHeight - sc.scrollTop - sc.clientHeight > 400;
  ui.jump = far;
  const btn = E(".jump");
  if (btn) btn.style.display = far ? "grid" : "none";
}

