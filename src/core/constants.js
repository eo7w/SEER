/* Script — src/core/constants.js */

export const F = "\u0060\u0060\u0060"; // markdown fence
export const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
export const MOD = isMac ? "\u2318" : "Ctrl+";
