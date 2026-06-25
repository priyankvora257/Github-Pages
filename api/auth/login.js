const { createSessionToken, timingSafeEqualString } = require("../_lib/auth");
const { getJsonBody, sendJson, setCorsHeaders } = require("../_lib/http");

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

module.exports = async function handler(req, res) {
  if (!setCorsHeaders(req, res)) {
    return sendJson(res, 403, { error: "Origin not allowed." });
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  const expectedPassphrase = process.env.JOURNAL_PASSPHRASE;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!expectedPassphrase || !sessionSecret) {
    return sendJson(res, 500, { error: "Server is missing auth configuration." });
  }

  const body = getJsonBody(req);
  const passphrase = typeof body.passphrase === "string" ? body.passphrase : "";
  if (!timingSafeEqualString(passphrase, expectedPassphrase)) {
    return sendJson(res, 401, { error: "Invalid passphrase." });
  }

  const ttlSeconds =
    Number.parseInt(process.env.SESSION_TTL_SECONDS || "", 10) || DEFAULT_TTL_SECONDS;
  const token = createSessionToken(sessionSecret, ttlSeconds);

  return sendJson(res, 200, {
    token,
    expiresInSeconds: ttlSeconds,
  });
};
