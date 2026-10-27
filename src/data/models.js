/* Script — src/data/models.js */

export const MODELS = [
  { id: "nova-air",  name: "Script Air",  tagline: "Fast and light, for everyday questions", context: "128K", speed: 5, tags: ["Fast", "Cheap"] },
  { id: "nova-pro",  name: "Script Pro",  tagline: "Balanced intelligence for daily work", context: "200K", speed: 4, tags: ["Balanced"] },
  { id: "nova-max",  name: "Script Max",  tagline: "The deepest reasoning for hard problems", context: "1M", speed: 2, tags: ["Reasoning"] },
  { id: "nova-code", name: "Script Code", tagline: "Tuned for engineering and refactoring", context: "200K", speed: 4, tags: ["Code"] },
];

export function modelById(id) {
  return MODELS.find(function (m) { return m.id === id; }) || MODELS[1];
}

/* ---------------------- 05. SUGGESTIONS ---------------------- */

