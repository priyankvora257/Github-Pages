const { sendJson, setCorsHeaders } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (!setCorsHeaders(req, res)) {
    return sendJson(res, 403, { error: "Origin not allowed." });
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  return sendJson(res, 200, { ok: true });
};
