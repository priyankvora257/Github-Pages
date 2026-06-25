const { extractBearerToken, verifySessionToken } = require("./auth");

function setCorsHeaders(req, res) {
  const configuredOrigin = (process.env.APP_ORIGIN || "").trim().replace(/\/+$/, "");
  const requestOrigin = (req.headers.origin || "").trim().replace(/\/+$/, "");

  if (!configuredOrigin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", configuredOrigin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (configuredOrigin && requestOrigin && requestOrigin !== configuredOrigin) {
    return false;
  }
  return true;
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function getDateParam(value) {
  if (typeof value !== "string") return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function getJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function requireSession(req, res) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    sendJson(res, 500, { error: "Server is missing SESSION_SECRET." });
    return false;
  }

  const bearer = extractBearerToken(req.headers.authorization);
  const ok = verifySessionToken(bearer, secret);
  if (!ok) {
    sendJson(res, 401, { error: "Unauthorized." });
  }
  return ok;
}

module.exports = {
  setCorsHeaders,
  sendJson,
  getDateParam,
  getJsonBody,
  requireSession,
};
