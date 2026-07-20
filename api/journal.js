const { loadJournalDocument, saveJournalDocument } = require("./_lib/gist");
const {
  getDateParam,
  getJsonBody,
  requireSession,
  sendJson,
  setCorsHeaders,
} = require("./_lib/http");
const { createEmptyEntry, sanitizeIncomingEntry } = require("./_lib/journal");

module.exports = async function handler(req, res) {
  if (!setCorsHeaders(req, res)) {
    return sendJson(res, 403, { error: "Origin not allowed." });
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!requireSession(req, res)) return;

  const date = getDateParam(req.query.date);
  if (!date) {
    return sendJson(res, 400, { error: "A valid date query parameter is required (YYYY-MM-DD)." });
  }

  try {
    const document = await loadJournalDocument();

    if (req.method === "GET") {
      const entry = document.entries[date] || createEmptyEntry(document.questions);
      return sendJson(res, 200, {
        date,
        questions: document.questions,
        entry,
      });
    }

    if (req.method === "PUT") {
      const body = getJsonBody(req);
      const existingEntry = document.entries[date] || {};
      const incomingEntry = sanitizeIncomingEntry(body.entry, document.questions);
      const discomfort =
        typeof body.discomfort === "boolean"
          ? body.discomfort
          : existingEntry.discomfort === true;
      const storedEntry = {
        ...incomingEntry,
        discomfort,
        updatedAt: new Date().toISOString(),
      };

      document.entries[date] = storedEntry;
      await saveJournalDocument(document);

      return sendJson(res, 200, {
        ok: true,
        date,
        entry: storedEntry,
        questions: document.questions,
      });
    }

    return sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(res, 500, {
      error: "Could not load or save journal data.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
