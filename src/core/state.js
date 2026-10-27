import { DEFAULT_SETTINGS } from "../data/settings.js";
/* Script — src/core/state.js */


/* ================================================================
   SHELL — state, 3-panel layout, sidebar, right panel
   ================================================================ */
/* ---------- state ---------- */
export const state = {
  conversations: [],
  activeId: null,
  settings: Object.assign({}, DEFAULT_SETTINGS),
};

export const ui = {
  view: "chat",            // chat | analytics
  sidebarOpen: false,      // mobile drawer
  rail: false,             // collapsed desktop rail
  rightOpen: true,
  search: "",
  rightSearch: "",
  recentOpen: true,
  profileOpen: false,
  exportOpen: false,
  modelOpen: false,
  attachMenu: false,
  deepThink: false,
  webSearch: false,
  listening: false,
  streamingId: null,       // message id being streamed
  streamAbort: false,
  composerText: "",
  attachments: [],
  sidebarDraft: "",        // conv rename draft
  editingMsgId: null,
  msgDraft: "",
  topDraft: "",
  jump: false,
  modal: null,             // null | settings | shortcuts | clear
  settingsTab: "general",
  palette: false,
  paletteQ: "",
  paletteIdx: 0,
  toastTimer: null,
};
