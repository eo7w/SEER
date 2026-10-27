import { E } from "../core/dom.js";
import { esc } from "../core/utils.js";
import { icon } from "../core/icons.js";
/* Script — src/components/toast.js */

/* ---------- toasts ---------- */
export function toast(msg, isErr) {
  const box = E("#toasts");
  if (!box) return;
  const t = document.createElement("div");
  t.className = "toast" + (isErr ? " err" : "");
  t.innerHTML = '<span class="ti">' + icon(isErr ? "xmark" : "check", "") + '</span>' + esc(msg);
  box.appendChild(t);
  setTimeout(function () {
    t.style.transition = "opacity .25s, transform .25s";
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
    setTimeout(function () { t.remove(); }, 260);
  }, 2400);
}
