import { activeConv } from "../core/dom.js";
import { composerHtml } from "./composer.js";
import { esc, fmtTime, greetingByHour } from "../core/utils.js";
import { HUES } from "../core/theme.js";
import { icon } from "../core/icons.js";
import { mdHtml } from "../core/markdown.js";
import { modelById } from "../data/models.js";
import { state, ui } from "../core/state.js";
import { SUGGESTIONS } from "../data/suggestions.js";
/* Script — src/components/chat.js */

/* ---------- messages ---------- */
export function messageHtml(m, idx, total) {
  const isUser = m.role === "user";
  const model = m.model ? modelById(m.model) : null;
  const streaming = ui.streamingId === m.id;
  const delay = Math.min(idx * 55, 300);
  const body =
    m.id === ui.editingMsgId
      ? '<div class="ai-card">' +
          '<textarea class="edit-box" data-inp="msg-edit">' + esc(m.content) + '</textarea>' +
          '<div class="edit-foot">' +
            '<button class="gbtn" data-act="msg-edit-cancel">Cancel</button>' +
            '<button class="gbtn brand" data-act="msg-edit-send" data-mid="' + m.id + '">Save & resend</button>' +
          '</div>' +
        '</div>'
      : isUser
        ? '<div class="bubble">' + esc(m.content) + '</div>'
        : '<div class="ai-card">' + mdHtml(m.content) + (streaming ? '<span class="stream-caret"></span>' : "") + '</div>';

  const actions = isUser
    ? '<div class="msg-actions">' +
        '<button class="act-chip" data-act="msg-edit" data-mid="' + m.id + '">' + icon("pencil", "") + ' Edit</button>' +
      '</div>'
    : '<div class="msg-actions' + (streaming ? " stay" : "") + '">' +
        '<button class="act-chip" data-act="msg-copy" data-mid="' + m.id + '">' + icon("copy", "") + ' Copy</button>' +
        '<button class="act-chip" data-act="msg-regen" data-mid="' + m.id + '">' + icon("rotate", "") + ' Regenerate</button>' +
        '<button class="act-chip" data-act="msg-rate" data-mid="' + m.id + '" data-rate="up">' + icon("thumbsup", "") + '</button>' +
        '<button class="act-chip" data-act="msg-rate" data-mid="' + m.id + '" data-rate="down">' + icon("thumbsdown", "") + '</button>' +
        '<button class="act-chip danger" data-act="msg-delete" data-mid="' + m.id + '">' + icon("trash", "") + '</button>' +
      '</div>';

  return (
    '<div class="msg ' + (isUser ? "user" : "ai") + '" data-mid="' + m.id + '" style="animation-delay:' + delay + 'ms">' +
      '<div class="msg-row">' +
        (isUser
          ? '<div class="ava me">' + esc((state.settings.nickname && state.settings.nickname !== "friend" ? state.settings.nickname : "Sarah").slice(0, 2).toUpperCase()) + '</div>'
          : '<div class="ava ai">' + icon("sparkle2", "") + '</div>') +
        '<div class="f1 min-w0">' +
          '<div class="msg-meta">' +
            '<span class="msg-user-plain">' + (isUser ? "You" : "Script") + '</span>' +
            (model ? '<span class="model-chip">' + icon("bolt", "") + esc(model.name) + '</span>' : "") +
            (state.settings.showTimestamps ? '<span class="msg-time">' + fmtTime(m.createdAt) + '</span>' : "") +
          '</div>' +
          body +
          actions +
          (!isUser && !streaming && m.tokens
            ? '<div class="msg-foot">' + icon("bolt", "") + ' ' + m.tokens + ' tokens' + (m.latencyMs ? ' · ' + (m.latencyMs / 1000).toFixed(1) + 's' : "") + '</div>'
            : "") +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

export function emptyHtml() {
  const hourGreeting = greetingByHour() + " 👋";
  const pills = ["Write", "Analyze", "Code", "Chat"];
  return (
    '<div class="empty">' +
      '<div class="empty-hero">' +
        '<div class="hero-orb">' + icon("sparkle2", "") + '</div>' +
        '<div class="hero-hi">' + hourGreeting + '</div>' +
        '<div class="hero-sub">How can I help you today?</div>' +
        '<div class="hero-pills">' + pills.map(function (p) { return '<span class="hero-pill">' + p + '</span>'; }).join("") + '</div>' +
      '</div>' +
      '<div class="sgrid-title">Quick start</div>' +
      '<div class="sgrid">' +
        SUGGESTIONS.map(function (s, i) {
          const hue = HUES[s.hue] || HUES.blue;
          return (
            '<button class="scard" data-act="suggestion-pick" data-prompt="' + esc(s.prompt) + '" style="animation-delay:' + (i * 60) + 'ms">' +
              '<div class="scard-ico" style="background:' + hue.bg + ';color:' + hue.fg + '">' + icon(s.icon, "") + '</div>' +
              '<div class="min-w0">' +
                '<div class="sc-h">' + esc(s.label) + '</div>' +
                '<div class="sc-p clamp-2">' + esc(s.prompt) + '</div>' +
              '</div>' +
            '</button>'
          );
        }).join("") +
      '</div>' +
      '<div class="sgrid-title">Or try a template</div>' +
      '<div class="trow">' +
        ['Summarize an article', 'Write a cold email', 'Explain a concept', 'Plan my week', 'Debug my code', 'Compare options'].map(function (t) {
          return '<button class="tchip" data-act="suggestion-pick" data-prompt="' + esc(t) + '">' + icon("wand", "") + esc(t) + '</button>';
        }).join("") +
      '</div>' +
    '</div>'
  );
}

/* ---------- chat view ---------- */
export function chatViewHtml() {
  const conv = activeConv();
  const msgs = conv ? conv.messages : [];
  return (
    '<div class="chat-scroll" id="chat-scroll">' +
      '<div class="chat-inner">' +
        (msgs.length ? msgs.map(messageHtml).join("") : emptyHtml()) +
      '</div>' +
    '</div>' +
    (ui.jump ? "" : '<button class="jump" data-act="jump-bottom" title="Jump to latest" style="display:none">' + icon("arrowup", "") + '</button>') +
    composerHtml()
  );
}

