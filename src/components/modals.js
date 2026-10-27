import { ACCENTS } from "../data/accents.js";
import { E } from "../core/dom.js";
import { esc } from "../core/utils.js";
import { HUES } from "../core/theme.js";
import { icon } from "../core/icons.js";
import { MODELS } from "../data/models.js";
import { SHORTCUTS } from "../data/shortcuts.js";
import { state, ui } from "../core/state.js";
import { SUGGESTIONS, TRAIT_OPTIONS } from "../data/suggestions.js";
/* Script — src/components/modals.js */

/* ================================================================
   PANELS — modals, command palette, toasts
   ================================================================ */

/* ---------- modal shell ---------- */
export function modalOpen(html) { return html !== ""; }
export function modalHtml() {
  if (ui.modal === "settings") return settingsModalHtml();
  if (ui.modal === "shortcuts") return shortcutsModalHtml();
  if (ui.modal === "clear") return clearModalHtml();
  if (ui.modal === "templates") return templatesModalHtml();
  return "";
}

export function renderModal() {
  const el = E("#rg-modal");
  if (el) el.innerHTML = ui.modal ? modalHtml() : "";
}

export function modalShell(title, sub, bodyHtml, footHtml, tabsHtml) {
  return (
    '<div class="overlay" data-act="modal-backdrop">' +
      '<div class="modal" style="max-width:' + (ui.modal === "settings" ? "620px" : "560px") + '">' +
        (tabsHtml || "") +
        '<div class="modal-head">' +
          '<div class="f1">' +
            '<div class="modal-title">' + title + '</div>' +
            (sub ? '<div class="modal-sub">' + sub + '</div>' : "") +
          '</div>' +
          '<button class="ibtn" data-act="close-modal" title="Close">' + icon("xmark", "") + '</button>' +
        '</div>' +
        '<div class="modal-body">' + bodyHtml + '</div>' +
        (footHtml ? '<div class="modal-foot">' + footHtml + '</div>' : "") +
      '</div>' +
    '</div>'
  );
}

/* ---------- settings modal ---------- */
export function toggleRow(ic, h, p, act, on) {
  return (
    '<div class="setting-row">' +
      '<div class="sr-ico">' + icon(ic, "") + '</div>' +
      '<div class="sr-text"><div class="sr-h">' + h + '</div><div class="sr-p">' + p + '</div></div>' +
      '<button class="tgl' + (on ? " on" : "") + '" data-act="' + act + '"><i></i></button>' +
    '</div>'
  );
}

export function settingsModalHtml() {
  const s = state.settings;
  const tabs = ["general", "model", "personalize", "data"].map(function (t) {
    return '<button class="mtab' + (ui.settingsTab === t ? " on" : "") + '" data-act="settings-tab" data-t="' + t + '">' + t[0].toUpperCase() + t.slice(1) + '</button>';
  }).join("");

  let body = "";
  if (ui.settingsTab === "general") {
    body =
      '<div class="mgrid" style="margin-bottom:14px">' +
        '<button class="setting-row" data-act="set-theme" data-t="light" style="' + (s.theme === "light" ? "border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-glow)" : "") + '">' +
          '<div class="sr-ico">' + icon("sun", "") + '</div><div class="sr-text"><div class="sr-h">Light</div><div class="sr-p">Bright workspace</div></div>' +
          (s.theme === "light" ? '<span style="color:var(--brand)">' + icon("check", "") + '</span>' : "") +
        '</button>' +
        '<button class="setting-row" data-act="set-theme" data-t="dark" style="' + (s.theme === "dark" ? "border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-glow)" : "") + '">' +
          '<div class="sr-ico">' + icon("moon", "") + '</div><div class="sr-text"><div class="sr-h">Dark</div><div class="sr-p">Dimmed, focus-first</div></div>' +
          (s.theme === "dark" ? '<span style="color:var(--brand)">' + icon("check", "") + '</span>' : "") +
        '</button>' +
      '</div>' +
      '<div class="rp-label" style="padding-top:0">Accent color</div>' +
      '<div class="swatches mb-16">' +
        Object.keys(ACCENTS).map(function (k) {
          const a = ACCENTS[k];
          return '<button class="swatch' + (s.accent === k ? " on" : "") + '" data-act="set-accent" data-t="' + k + '" title="' + a.label + '"><i style="background:linear-gradient(135deg,' + a.from + ',' + a.to + ')"></i></button>';
        }).join("") +
      '</div>' +
      toggleRow("clock", "Show timestamps", "Display time under each message", "toggle-setting-timestamps", s.showTimestamps) +
      toggleRow("send", "Send on Enter", "Enter sends, Shift+Enter adds a line", "toggle-setting-enter", s.sendOnEnter);
  } else if (ui.settingsTab === "model") {
    body =
      '<div class="rp-label" style="padding-top:0">Default model</div>' +
      MODELS.map(function (m) {
        const on = m.id === s.defaultModel;
        return (
          '<button class="setting-row w-full" data-act="set-model" data-id="' + m.id + '" style="width:100%;text-align:left;margin-bottom:10px;' + (on ? "border-color:var(--brand)" : "") + '">' +
            '<div class="sr-ico">' + icon("sparkle", "") + '</div>' +
            '<div class="sr-text"><div class="sr-h">' + esc(m.name) + '</div><div class="sr-p">' + esc(m.tagline) + '</div></div>' +
            (on ? '<span style="color:var(--brand)">' + icon("check", "") + '</span>' : "") +
          '</button>'
        );
      }).join("") +
      '<div class="rp-label">Generation</div>' +
      '<div class="setting-row">' +
        '<div class="sr-ico">' + icon("bolt", "") + '</div>' +
        '<div class="sr-text"><div class="sr-h">Temperature</div><div class="sr-p">Creativity of responses</div></div>' +
        '<input type="range" class="range" min="0" max="1" step="0.1" value="' + s.temperature + '" data-inp="temperature" />' +
        '<span class="t-13 bold" style="width:26px;text-align:right">' + Number(s.temperature).toFixed(1) + '</span>' +
      '</div>' +
      '<div class="setting-row">' +
        '<div class="sr-ico">' + icon("zap", "") + '</div>' +
        '<div class="sr-text"><div class="sr-h">Stream speed</div><div class="sr-p">How fast text appears</div></div>' +
        '<select class="sel" data-inp="speed">' +
          ["slow", "normal", "fast"].map(function (v) { return '<option value="' + v + '"' + (s.streamSpeed === v ? " selected" : "") + '>' + v[0].toUpperCase() + v.slice(1) + '</option>'; }).join("") +
        '</select>' +
      '</div>';
  } else if (ui.settingsTab === "personalize") {
    body =
      '<div class="rp-label" style="padding-top:0">What should Script call you?</div>' +
      '<input class="tin mb-16" data-inp="nickname" placeholder="Your nickname" value="' + esc(s.nickname === "friend" ? "" : s.nickname) + '" />' +
      '<div class="rp-label">Custom instructions</div>' +
      '<textarea class="tin mb-16" data-inp="instructions" placeholder="e.g. Always answer in Arabic. Keep replies short and use tables when comparing.">' + esc(s.customInstructions) + '</textarea>' +
      '<div class="rp-label">Personality traits</div>' +
      '<div class="trow" style="flex-wrap:wrap;padding:0">' +
        TRAIT_OPTIONS.map(function (t) {
          const on = s.traits.includes(t);
          return '<button class="tchip" data-act="toggle-trait" data-t="' + t + '" style="' + (on ? "background:var(--brand-soft);border-color:var(--brand);color:var(--brand)" : "") + '">' + (on ? icon("check", "") : "") + t + '</button>';
        }).join("") +
      '</div>' +
      '<div class="rp-label">Interface size</div>' +
      '<div class="setting-row">' +
        '<div class="sr-ico">' + icon("expand", "") + '</div>' +
        '<div class="sr-text"><div class="sr-h">Zoom level</div><div class="sr-p" id="lbl-zoom">Scale ' + Math.round(s.fontScale * 100) + '%</div></div>' +
        '<input type="range" class="range" min="0.85" max="1.2" step="0.05" value="' + s.fontScale + '" data-inp="zoom" />' +
      '</div>';
  } else {
    body =
      toggleRow("download", "Auto-save locally", "Conversations persist in this browser", "toggle-setting-save", true) +
      '<div class="rp-label">Danger zone</div>' +
      '<button class="setting-row w-full" data-act="clear-all-start" style="width:100%;text-align:left;border-color:var(--danger);background:var(--danger-soft)">' +
        '<div class="sr-ico" style="color:var(--danger)">' + icon("trash", "") + '</div>' +
        '<div class="sr-text"><div class="sr-h" style="color:var(--danger)">Delete all conversations</div><div class="sr-p">This cannot be undone</div></div>' +
      '</button>';
  }

  return modalShell("Settings", "Tune your workspace", body, null, '<div class="mtabs">' + tabs + '</div>');
}

/* ---------- shortcuts modal ---------- */
export function shortcutsModalHtml() {
  const rows = SHORTCUTS.map(function (s) {
    const keys = s[0].split("+").map(function (k) { return '<kbd class="k">' + k.trim() + '</kbd>'; }).join(" ");
    return '<div class="sc-row"><span class="t-13 t-2">' + esc(s[1]) + '</span><span style="display:flex;gap:4px">' + keys + '</span></div>';
  }).join("");
  return modalShell("Keyboard shortcuts", "Work faster", '<div class="sc-grid">' + rows + '</div>');
}

/* ---------- clear confirm ---------- */
export function clearModalHtml() {
  return modalShell(
    "Delete all conversations?",
    "You have " + state.conversations.length + " conversations. This wipes them permanently.",
    '<div class="tc t-13 t-2">' + icon("trash", "") + '</div>',
    '<button class="gbtn" data-act="clear-all-cancel">Cancel</button>' +
    '<button class="gbtn" data-act="clear-all-confirm" style="background:var(--danger);border-color:var(--danger);color:#fff">Delete everything</button>'
  );
}

/* ---------- templates modal ---------- */
export function templatesModalHtml() {
  const cards = SUGGESTIONS.concat(SUGGESTIONS.slice(0, 2)).map(function (s, i) {
    const hue = HUES[s.hue] || HUES.blue;
    return (
      '<button class="scard" data-act="template-pick" data-prompt="' + esc(s.prompt) + '" style="animation-delay:' + (i * 40) + 'ms">' +
        '<div class="scard-ico" style="background:' + hue.bg + ';color:' + hue.fg + '">' + icon(s.icon, "") + '</div>' +
        '<div class="min-w0"><div class="sc-h">' + esc(s.label) + '</div><div class="sc-p clamp-2">' + esc(s.prompt) + '</div></div>' +
      '</button>'
    );
  }).join("");
  return modalShell("Templates gallery", "Start from a proven prompt", '<div class="sgrid">' + cards + '</div>');
}

