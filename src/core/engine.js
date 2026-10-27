import { FALLBACKS, RESPONSES } from "../data/responses.js";
import { hashString } from "./utils.js";
/* Script — src/core/engine.js */

export function pickResponse(prompt, attempt) {
  attempt = attempt || 0;
  const clean = prompt.trim();
  for (const pair of RESPONSES) {
    if (pair.test.test(clean)) {
      const idx = (hashString(clean) + attempt) % pair.variants.length;
      return pair.variants[idx];
    }
  }
  const idx = (hashString(clean) + attempt) % FALLBACKS.length;
  return FALLBACKS[idx];
}

/* ---------- streaming ---------- */
export function chunkText(text) {
  const parts = text.match(/\S+\s*|\s+/g) || [text];
  return parts;
}
