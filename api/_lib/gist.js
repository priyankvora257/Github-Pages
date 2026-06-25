const { normalizeDocument } = require("./journal");

const GITHUB_API_VERSION = "2022-11-28";

async function githubRequest(url, options) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      "User-Agent": "stoic-daily-toolkit",
      ...(options && options.headers ? options.headers : {}),
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : response.statusText;
    throw new Error(`GitHub API error ${response.status}: ${message}`);
  }

  return data;
}

function getGistSettings() {
  const gistId = (process.env.GIST_ID || "").trim();
  const filename = (process.env.GIST_FILENAME || "stoic-journal.json").trim();

  if (!gistId) {
    throw new Error("Missing GIST_ID.");
  }

  return { gistId, filename };
}

async function loadJournalDocument() {
  const { gistId, filename } = getGistSettings();
  const gist = await githubRequest(`https://api.github.com/gists/${gistId}`, {
    method: "GET",
  });

  const content =
    gist &&
    gist.files &&
    gist.files[filename] &&
    typeof gist.files[filename].content === "string"
      ? gist.files[filename].content
      : "";

  if (!content) {
    return normalizeDocument({});
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {};
  }

  return normalizeDocument(parsed);
}

async function saveJournalDocument(doc) {
  const { gistId, filename } = getGistSettings();
  const payload = {
    files: {
      [filename]: {
        content: JSON.stringify(doc, null, 2),
      },
    },
  };

  await githubRequest(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

module.exports = {
  loadJournalDocument,
  saveJournalDocument,
};
