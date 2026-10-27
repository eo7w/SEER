import { estimateTokens, uid } from "../core/utils.js";
import { RESPONSES } from "./responses.js";
/* Script — src/data/seed.js */

export function seedConversations() {
  const now = Date.now();
  const hour = 3600000;
  const mk = function (title, agoH, msgs) {
    return {
      id: uid(),
      title: title,
      createdAt: now - agoH * hour,
      updatedAt: now - agoH * hour + 5 * 60000,
      pinned: false,
      messages: msgs.map(function (pair, i) {
        const role = pair[0], content = pair[1];
        return {
          id: "seed-" + title.slice(0, 6) + "-" + i,
          role: role,
          content: content,
          createdAt: now - agoH * hour + i * 90000,
          model: role === "assistant" ? "nova-pro" : undefined,
          tokens: role === "assistant" ? estimateTokens(content) : undefined,
          latencyMs: role === "assistant" ? 1400 + i * 220 : undefined,
        };
      }),
    };
  };
  return [
    mk("Interface polish checklist", 26, [
      ["user", "What makes an interface feel premium instead of just styled?"],
      ["assistant", RESPONSES[3].variants[0]],
    ]),
    mk("Postgres vs MongoDB", 74, [
      ["user", "We're building a social app. Postgres or MongoDB, honestly?"],
      ["assistant", RESPONSES[5].variants[0]],
    ]),
    mk("Weekly shipping plan", 130, [
      ["user", "Help me plan a focused week to ship my side project."],
      ["assistant", RESPONSES[4].variants[0]],
    ]),
  ];
}

/* ---------------------- STORAGE ---------------------- */

