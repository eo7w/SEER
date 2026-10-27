/* Script — src/core/utils.js */

export let __uidCounter = 0;
export function uid() {
  __uidCounter += 1;
  return Date.now().toString(36) + "-" + __uidCounter.toString(36) + Math.random().toString(36).slice(2, 7);
}

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  const d = Math.floor(h / 24);
  if (d < 7) return d + "d ago";
  return Math.floor(d / 7) + "w ago";
}

export function estimateTokens(text) {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length * 1.37));
}

export function greetingByHour() {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
