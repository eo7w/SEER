import { ACCENTS } from "../data/accents.js";
import { E } from "./dom.js";
import { state } from "./state.js";
/* Script — src/core/theme.js */

/* ---------- theme / accent ---------- */
export function applyTheme() {
  const root = E("#app");
  if (!root) return;
  root.setAttribute("data-theme", state.settings.theme === "dark" ? "dark" : "light");
  const acc = ACCENTS[state.settings.accent] || ACCENTS.blue;
  root.style.setProperty("--brand", acc.solid);
  root.style.setProperty("--brand-2", acc.to);
  root.style.setProperty("--brand-3", acc.to);
  root.style.setProperty("--brand-glow", acc.ring);
  root.style.setProperty("--brand-soft", acc.soft || "rgba(79,124,255,.10)");
  root.style.setProperty("--brand-soft-2", acc.soft2 || "rgba(79,124,255,.18)");
  root.style.setProperty("--brand-grad", "linear-gradient(135deg," + acc.from + " 0%," + acc.to + " 100%)");
  root.style.setProperty("--sh-brand", "0 4px 14px " + acc.ring);
  root.style.zoom = String(state.settings.fontScale || 1);
}

/* accent soft variants */
ACCENTS.blue.soft = "rgba(79,124,255,.10)"; ACCENTS.blue.soft2 = "rgba(79,124,255,.20)";
ACCENTS.violet.soft = "rgba(139,92,246,.10)"; ACCENTS.violet.soft2 = "rgba(139,92,246,.20)";
ACCENTS.emerald.soft = "rgba(16,185,129,.10)"; ACCENTS.emerald.soft2 = "rgba(16,185,129,.20)";
ACCENTS.amber.soft = "rgba(245,158,11,.12)"; ACCENTS.amber.soft2 = "rgba(245,158,11,.22)";
ACCENTS.rose.soft = "rgba(244,63,94,.10)"; ACCENTS.rose.soft2 = "rgba(244,63,94,.20)";
ACCENTS.cyan.soft = "rgba(6,182,212,.10)"; ACCENTS.cyan.soft2 = "rgba(6,182,212,.20)";

/* ---------- hue map for suggestion cards ---------- */
export const HUES = {
  blue:   { bg: "rgba(79,124,255,.10)", fg: "#4F7CFF" },
  violet: { bg: "rgba(139,92,246,.10)", fg: "#8B5CF6" },
  emerald:{ bg: "rgba(16,185,129,.10)", fg: "#10B981" },
  amber:  { bg: "rgba(245,158,11,.12)", fg: "#F59E0B" },
  cyan:   { bg: "rgba(6,182,212,.10)", fg: "#06B6D4" },
  rose:   { bg: "rgba(244,63,94,.10)", fg: "#F43F5E" },
};
