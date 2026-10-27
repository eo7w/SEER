/* Script — src/core/storage.js */

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable */
  }
}
export const KEY_CONVS = "nova-chat-convs-v1";
export const KEY_SETTINGS = "nova-chat-settings-v1";
export const KEY_SEEDED = "nova-chat-seeded-v1";
