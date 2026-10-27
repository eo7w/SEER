import { activeConv, E, renderAll, renderMain } from "./dom.js";
import { chunkText, pickResponse } from "./engine.js";
import { estimateTokens, uid } from "./utils.js";
import { KEY_CONVS, KEY_SETTINGS, saveJSON } from "./storage.js";
import { mdHtml } from "./markdown.js";
import { renderRight } from "../components/right-panel.js";
import { renderSidebar } from "../components/sidebar.js";
import { renderTopbar } from "../components/topbar.js";
import { state, ui } from "./state.js";
import { toast } from "../components/toast.js";
/* Script — src/core/actions.js */

/* ================================================================
   ACTIONS — persistence, streaming, delegation, boot
   ================================================================ */
/* ---------- persistence ---------- */
export function saveConvs() { saveJSON(KEY_CONVS, state.conversations); }
export function saveSettings() { saveJSON(KEY_SETTINGS, state.settings); }

export function createConv(title) {
  const conv = {
    id: uid(),
    title: title || "New conversation",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pinned: false,
    messages: [],
  };
  state.conversations.unshift(conv);
  state.activeId = conv.id;
  return conv;
}

export function actNewChat() {
  if (ui.streamingId) { ui.streamAbort = true; }
  createConv();
  ui.view = "chat";
  ui.composerText = "";
  ui.sidebarOpen = false;
  saveConvs();
  renderAll();
  focusComposer();
}

export function actSelectConv(id) {
  if (id === state.activeId && ui.view === "chat") { ui.sidebarOpen = false; renderSidebar(); return; }
  state.activeId = id;
  ui.view = "chat";
  ui.sidebarOpen = false;
  ui.modal = null;
  renderAll();
}

/* ---------- clipboard / export ---------- */
export function copyText(text, msg) {
  const done = function () { toast(msg || "Copied to clipboard"); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text); done(); });
  } else { legacyCopy(text); done(); }
}
export function legacyCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  ta.remove();
}

export function convToMarkdown(conv) {
  return (
    "# " + conv.title + "\n\n" +
    conv.messages.map(function (m) {
      return (m.role === "user" ? "**You:** " : "**Script:** ") + m.content;
    }).join("\n\n---\n\n")
  );
}

export function actExportCopy() {
  const conv = activeConv();
  if (!conv || !conv.messages.length) { toast("Nothing to export yet", true); return; }
  copyText(convToMarkdown(conv), "Markdown copied");
}

export function actExportMd() {
  const conv = activeConv();
  if (!conv || !conv.messages.length) { toast("Nothing to export yet", true); return; }
  const blob = new Blob([convToMarkdown(conv)], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = conv.title.replace(/[^a-z0-9\u0600-\u06FF -]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() + ".md";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  toast("Downloaded .md file");
}

export function streamScrollPin() {
  const sc = E("#chat-scroll");
  if (!sc) return;
  const nearBottom = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 160;
  if (nearBottom) sc.scrollTop = sc.scrollHeight;
}

export function updateStreamBubble(msg) {
  const row = document.querySelector('[data-mid="' + msg.id + '"]');
  if (!row) return;
  const card = row.querySelector(".ai-card");
  if (card) card.innerHTML = mdHtml(msg.content) + '<span class="stream-caret"></span>';
  const sc = E("#chat-scroll");
  if (sc) streamScrollPin();
}

export function startStream(conv, prompt, attempt) {
  const msg = {
    id: uid(),
    role: "assistant",
    content: "",
    createdAt: Date.now(),
    model: state.settings.defaultModel,
    tokens: undefined,
    latencyMs: undefined,
  };
  conv.messages.push(msg);
  ui.streamingId = msg.id;
  renderMain(true);
  streamScrollPin();

  const full = pickResponse(prompt, attempt || 0);
  const chunks = chunkText(full);
  const speeds = { slow: 110, normal: 48, fast: 16 };
  const t0 = Date.now();
  let i = 0;

  const timer = setInterval(function () {
    if (ui.streamAbort) {
      clearInterval(timer);
      msg.content = msg.content + " …";
      finishStream(msg, conv, t0);
      return;
    }
    if (i >= chunks.length) {
      clearInterval(timer);
      msg.content = full;
      finishStream(msg, conv, t0);
      return;
    }
    msg.content += chunks[i];
    i += 1;
    updateStreamBubble(msg);
  }, speeds[state.settings.streamSpeed] || 48);
}

export function finishStream(msg, conv, t0) {
  msg.tokens = estimateTokens(msg.content);
  msg.latencyMs = Date.now() - t0;
  ui.streamingId = null;
  ui.streamAbort = false;
  conv.updatedAt = Date.now();
  saveConvs();
  renderMain(true);
  renderSidebar();
  renderRight();
  focusComposer();
}

/* ---------- send ---------- */
export function actSend(promptOverride) {
  const text = (promptOverride || ui.composerText).trim();
  if (!text || ui.streamingId) return;
  let conv = activeConv();
  if (!conv) conv = createConv();
  if (conv.title === "New conversation") {
    conv.title = text.length > 40 ? text.slice(0, 40) + "…" : text;
  }
  conv.messages.push({ id: uid(), role: "user", content: text, createdAt: Date.now() });
  conv.updatedAt = Date.now();
  ui.composerText = "";
  ui.attachments = [];
  ui.view = "chat";
  saveConvs();
  renderSidebar();
  renderTopbar();
  renderRight();
  renderMain();
  startStream(conv, text, 0);
}

export function actRegenerate(mid) {
  const conv = activeConv();
  if (!conv || ui.streamingId) return;
  const idx = conv.messages.findIndex(function (m) { return m.id === mid; });
  if (idx < 0) return;
  const prompt = conv.messages.slice(0, idx).reverse().find(function (m) { return m.role === "user"; });
  if (!prompt) { toast("Nothing to regenerate from", true); return; }
  conv.messages.splice(idx);
  saveConvs();
  renderMain();
  startStream(conv, prompt.content, 1);
}

export function actEditResend(mid) {
  const conv = activeConv();
  if (!conv || ui.streamingId) return;
  const idx = conv.messages.findIndex(function (m) { return m.id === mid; });
  if (idx < 0) return;
  const newText = ui.msgDraft.trim();
  if (!newText) return;
  conv.messages[idx].content = newText;
  conv.messages.splice(idx + 1);
  ui.editingMsgId = null;
  conv.updatedAt = Date.now();
  saveConvs();
  renderMain();
  startStream(conv, newText, 0);
}

export function actDeleteMessage(mid) {
  const conv = activeConv();
  if (!conv) return;
  conv.messages = conv.messages.filter(function (m) { return m.id !== mid; });
  conv.updatedAt = Date.now();
  saveConvs();
  renderMain(true);
  renderSidebar();
  renderRight();
  toast("Message deleted");
}

export function actDeleteConv(id) {
  const cid = id || state.activeId;
  const conv = state.conversations.find(function (c) { return c.id === cid; });
  if (!conv) return;
  state.conversations = state.conversations.filter(function (c) { return c.id !== cid; });
  if (state.activeId === cid) state.activeId = state.conversations.length ? state.conversations[0].id : null;
  if (!state.conversations.length) createConv();
  saveConvs();
  renderAll();
  toast("Conversation deleted");
}

export function actTogglePin(id) {
  const cid = id || state.activeId;
  const conv = state.conversations.find(function (c) { return c.id === cid; });
  if (!conv) return;
  conv.pinned = !conv.pinned;
  saveConvs();
  renderSidebar();
  renderRight();
  toast(conv.pinned ? "Pinned to top" : "Unpinned");
}

export function actClearAll() {
  state.conversations = [];
  createConv();
  saveConvs();
  ui.modal = null;
  renderAll();
  toast("All conversations deleted");
}

export function focusComposer() {
  const inp = E("#composer-input");
  if (inp) { inp.focus(); inp.style.height = "auto"; inp.style.height = Math.min(inp.scrollHeight, 200) + "px"; }
}

export function setComposerText(text) {
  ui.composerText = text;
  const inp = E("#composer-input");
  if (inp) {
    inp.value = text;
    inp.style.height = "auto";
    inp.style.height = Math.min(inp.scrollHeight, 200) + "px";
  }
  focusComposer();
}

export function closeAllMenus() {
  const had = ui.exportOpen || ui.modelOpen || ui.profileOpen || ui.attachMenu;
  ui.exportOpen = false;
  ui.modelOpen = false;
  ui.profileOpen = false;
  ui.attachMenu = false;
  if (had) { renderTopbar(); if (ui.attachMenu === false) renderMain(true); }
}
