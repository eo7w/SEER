import { activeModel } from "../core/dom.js";
import { esc } from "../core/utils.js";
import { icon } from "../core/icons.js";
import { MOD } from "../core/constants.js";
import { ui } from "../core/state.js";
/* Script — src/components/composer.js */

/* ---------- composer ---------- */
export function composerHtml() {
  const canSend = (ui.composerText.trim().length > 0 || ui.attachments.length > 0) && !ui.streamingId;
  const model = activeModel();
  return (
    '<div class="composer-zone">' +
      '<div class="composer" id="composer">' +
        (ui.attachments.length
          ? '<div class="attach-strip">' +
              ui.attachments.map(function (a, i) {
                return (
                  '<span class="attach-pill">' + icon("filecode", "") + esc(a) +
                  '<button class="x" data-act="attach-remove" data-i="' + i + '">' + icon("xmark", "") + '</button></span>'
                );
              }).join("") +
            '</div>'
          : "") +
        '<textarea id="composer-input" data-inp="composer" rows="1" placeholder="Message Script AI..." style="height:' + Math.max(24, Math.min(24 + (ui.composerText.split("\n").length - 1) * 22, 200)) + 'px;overflow-y:auto">' + esc(ui.composerText) + '</textarea>' +
        '<div class="composer-foot">' +
          '<button class="ibtn ibtn-xs" data-act="attach-menu" title="Attach">' + icon("clip", "") + '</button>' +
          (ui.attachMenu
            ? '<div class="menu abs" style="bottom:44px;left:0">' +
                '<button class="menu-item" data-act="attach-add" data-t="filecode|Upload file">' + icon("filecode", "") + ' Upload file</button>' +
                '<button class="menu-item" data-act="attach-add" data-t="image|Add image">' + icon("image", "") + ' Add image</button>' +
                '<button class="menu-item" data-act="attach-add" data-t="folder|From folder">' + icon("folder", "") + ' From folder</button>' +
              '</div>'
            : "") +
          '<button class="mode-chip' + (ui.deepThink ? " on violet" : "") + '" data-act="toggle-deep">' + icon("brain", "") + ' Deep Think</button>' +
          '<button class="mode-chip' + (ui.webSearch ? " on" : "") + '" data-act="toggle-web">' + icon("globe", "") + ' Web</button>' +
          '<span class="spacer"></span>' +
          '<button class="model-pick" data-act="model-menu" title="Switch model"><span class="dot"></span>' + esc(model.name) + icon("chevron", "") + '</button>' +
          '<button class="ibtn ibtn-xs" data-act="mic" title="Voice input" style="' + (ui.listening ? "color:var(--danger)" : "") + '">' + icon("mic", "") + '</button>' +
          (ui.streamingId
            ? '<button class="send-btn stop" data-act="stop-stream" title="Stop">' + icon("stop", "") + '</button>'
            : '<button class="send-btn" data-act="send" ' + (canSend ? "" : "disabled") + ' title="Send">' + icon("send", "") + '</button>') +
        '</div>' +
      '</div>' +
      '<div class="composer-hint">Script AI can make mistakes. Check important info. <kbd class="k">' + MOD + 'K</kbd> for commands</div>' +
    '</div>'
  );
}

