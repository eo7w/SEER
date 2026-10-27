import { activeConv, E } from "../core/dom.js";
import { esc } from "../core/utils.js";
import { icon } from "../core/icons.js";
import { isMobile } from "./shell.js";
import { MOD } from "../core/constants.js";
import { state, ui } from "../core/state.js";
/* Script — src/components/sidebar.js */

/* ---------- sidebar ---------- */
export function groupConversations() {
  const q = ui.search.trim().toLowerCase();
  const list = state.conversations
    .filter(function (c) { return !q || c.title.toLowerCase().includes(q); })
    .slice()
    .sort(function (a, b) { return (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt); });
  const now = Date.now();
  const day = 86400000;
  const groups = [];
  const push = function (label, arr) { if (arr.length) groups.push({ label: label, items: arr }); };
  push("Pinned", list.filter(function (c) { return c.pinned; }));
  push("Today", list.filter(function (c) { return !c.pinned && now - c.updatedAt < day; }));
  push("Yesterday", list.filter(function (c) { return !c.pinned && now - c.updatedAt >= day && now - c.updatedAt < 2 * day; }));
  push("Previous 7 days", list.filter(function (c) { return !c.pinned && now - c.updatedAt >= 2 * day && now - c.updatedAt < 7 * day; }));
  push("Older", list.filter(function (c) { return !c.pinned && now - c.updatedAt >= 7 * day; }));
  return groups;
}

export function navItem(act, ic, label, opts) {
  opts = opts || {};
  return (
    '<button class="nav-item' + (opts.active ? " active" : "") + '" data-act="' + act + '"' + (opts.title ? ' title="' + opts.title + '"' : "") + '>' +
      icon(ic, "") +
      '<span>' + label + '</span>' +
      (opts.badge ? '<span class="n-badge">' + opts.badge + '</span>' : "") +
    '</button>'
  );
}

export function sidebarHtml() {
  const conv = activeConv();
  const groups = groupConversations();
  const recentItems = groups.map(function (g, gi) {
    return (
      '<div class="nav-label">' + g.label + '</div>' +
      g.items.map(function (c) {
        const active = c.id === state.activeId;
        return (
          '<div class="conv-row' + (active ? " active" : "") + '">' +
            '<button class="nav-item f1' + (active ? " active" : "") + '" data-act="select-conv" data-id="' + c.id + '" title="' + esc(c.title) + '" style="height:38px;min-width:0">' +
              icon("chat", "") +
              '<span class="trunc f1" style="text-align:left">' + esc(c.title) + '</span>' +
              (c.pinned ? icon("star", "") : "") +
            '</button>' +
            '<span class="conv-acts">' +
              '<button class="c-act" data-act="pin-conv" data-id="' + c.id + '" title="' + (c.pinned ? "Unpin" : "Pin") + '">' + icon("star", "") + '</button>' +
              '<button class="c-act" data-act="delete-conv" data-id="' + c.id + '" title="Delete">' + icon("trash", "") + '</button>' +
            '</span>' +
          '</div>'
        );
      }).join("")
    );
  }).join("");

  return (
    '<div class="sb-head">' +
      '<div class="sb-brand" data-act="view-chat">' +
        '<div class="brand-mark">' + icon("sparkle2", "") + '</div>' +
        '<div class="brand-text">' +
          '<div class="brand-name">Script</div>' +
          '<div class="brand-tag">AI Workspace</div>' +
        '</div>' +
      '</div>' +
      (!isMobile()
        ? '<button class="ibtn ibtn-xs" data-act="toggle-rail" title="Collapse sidebar">' + icon(ui.rail ? "panel" : "menu", "") + '</button>'
        : '<button class="ibtn ibtn-xs" data-act="close-sidebar" title="Close">' + icon("xmark", "") + '</button>') +
    '</div>' +

    '<div class="sb-search">' +
      icon("magnifier", "") +
      '<input data-inp="sidebar-search" placeholder="Search chats..." value="' + esc(ui.search) + '" />' +
      '<kbd>' + MOD + 'K</kbd>' +
    '</div>' +

    '<button class="sb-new" data-act="new-chat">' + icon("plus", "") + '<span>New Chat</span></button>' +

    '<div class="sb-scroll">' +
      '<div class="nav-label">Platform</div>' +
      navItem("view-chat", "chat", "AI Chat", { active: ui.view === "chat" }) +
      navItem("view-analytics", "chart", "Analytics", { active: ui.view === "analytics" }) +
      navItem("open-templates", "grid", "Templates", {}) +
      navItem("open-docs", "book", "Documents", { badge: "3" }) +

      '<div class="nav-label">Workspace</div>' +
      '<button class="nav-item' + (ui.recentOpen ? "" : "") + '" data-act="toggle-recent" style="justify-content:space-between">' +
        '<span style="display:flex;align-items:center;gap:11px">' + icon("clock", "") + '<span>Recent</span></span>' +
        '<span class="n-badge">' + state.conversations.length + '</span>' +
      '</button>' +
      (ui.recentOpen
        ? '<div style="display:flex;flex-direction:column;gap:2px;margin:2px 0 4px;max-height:230px;overflow-y:auto">' +
            (recentItems || '<div class="t-12 t-3" style="padding:8px 10px">No conversations yet</div>') +
          '</div>'
        : "") +

      '<div class="nav-label">General</div>' +
      navItem("open-settings", "gear", "Settings", {}) +
      navItem("open-shortcuts", "keyboard", "Shortcuts", {}) +
      navItem("open-help", "help", "Help & Center", {}) +
    '</div>' +

    '<div class="sb-upgrade" data-act="upgrade-toast">' +
      '<div class="up-title">' + icon("wand", "") + ' Upgrade to Pro</div>' +
      '<div class="up-sub">Unlimited messages & priority models</div>' +
      '<button class="up-btn">Get Script Pro</button>' +
    '</div>' +

    '<div class="sb-user" data-act="profile-menu">' +
      '<div class="u-ava">SA</div>' +
      '<div class="u-text">' +
        '<div class="u-name">' + esc(state.settings.nickname !== "friend" && state.settings.nickname ? state.settings.nickname : "Sarah Ahmed") + '</div>' +
        '<div class="u-mail">Pro · Workspace</div>' +
      '</div>' +
      icon("chevron", "") +
      (ui.profileOpen
        ? '<div class="menu abs" style="bottom:56px;left:0;right:0;margin:0 10px 0">' +
            '<div class="menu-head">Account</div>' +
            '<button class="menu-item" data-act="open-settings">' + icon("gear", "") + ' Preferences</button>' +
            '<button class="menu-item" data-act="toggle-theme">' + icon(state.settings.theme === "dark" ? "sun" : "moon", "") + ' ' + (state.settings.theme === "dark" ? "Light mode" : "Dark mode") + '</button>' +
            '<div class="menu-sep"></div>' +
            '<button class="menu-item danger" data-act="logout-toast">' + icon("logout", "") + ' Sign out</button>' +
          '</div>'
        : "") +
    '</div>'
  );
}

export function renderSidebar() {
  const el = E("#rg-sidebar");
  if (el) el.innerHTML = sidebarHtml();
}

