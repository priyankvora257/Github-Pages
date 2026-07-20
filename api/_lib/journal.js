const DEFAULT_QUESTIONS = [
  {
    id: "morning_intention",
    label: "Morning intention — today I will practice...",
  },
  {
    id: "premeditatio_malorum",
    label: "What could go wrong today? (and how will I handle it?)",
  },
  {
    id: "evening_well",
    label: "Evening review — what did I do well today?",
  },
  {
    id: "evening_shortfall",
    label: "Evening review — where did I fall short?",
  },
  {
    id: "gratitude",
    label: "What am I grateful for today that I usually take for granted?",
  },
  {
    id: "free_space",
    label: "Free space — write to Epictetus, or to your future self",
  },
];

function getQuestionIds(questions) {
  return questions.map((q) => q.id);
}

function createEmptyEntry(questions) {
  const entry = {};
  getQuestionIds(questions).forEach((id) => {
    entry[id] = "";
  });
  return entry;
}

function normalizeDocument(input) {
  const raw = input && typeof input === "object" ? input : {};
  const questions =
    Array.isArray(raw.questions) && raw.questions.length > 0
      ? raw.questions.filter(
          (q) =>
            q &&
            typeof q.id === "string" &&
            q.id.length > 0 &&
            typeof q.label === "string" &&
            q.label.length > 0
        )
      : DEFAULT_QUESTIONS;

  const questionIds = new Set(getQuestionIds(questions));
  const entries = {};
  const rawEntries = raw.entries && typeof raw.entries === "object" ? raw.entries : {};

  Object.keys(rawEntries).forEach((date) => {
    const source = rawEntries[date];
    if (!source || typeof source !== "object") return;
    const normalized = {};
    questionIds.forEach((id) => {
      const value = source[id];
      normalized[id] = typeof value === "string" ? value : "";
    });
    normalized.discomfort = source.discomfort === true;
    normalized.updatedAt =
      typeof source.updatedAt === "string" ? source.updatedAt : new Date().toISOString();
    entries[date] = normalized;
  });

  return {
    version: 1,
    questions,
    entries,
  };
}

function sanitizeIncomingEntry(entry, questions) {
  const safe = createEmptyEntry(questions);
  if (!entry || typeof entry !== "object") return safe;

  Object.keys(safe).forEach((id) => {
    const value = entry[id];
    if (typeof value === "string") {
      safe[id] = value.slice(0, 6000);
    }
  });

  return safe;
}

module.exports = {
  DEFAULT_QUESTIONS,
  createEmptyEntry,
  normalizeDocument,
  sanitizeIncomingEntry,
};
