# Stoic Journal Backend Setup (GitHub + Vercel)

This document covers one-time setup for cloud journal persistence using:
- Vercel serverless functions
- Secret GitHub gist as storage

## Architecture

- Frontend: `stoic_daily_toolkit.html` on GitHub Pages
- Backend API: Vercel project
- Storage: one secret gist JSON document

## One-time GitHub setup

1. Create a secret gist at https://gist.github.com.
2. Add file name: `stoic-journal.json`.
3. Paste this initial content:

```json
{
  "version": 1,
  "questions": [
    { "id": "morning_intention", "label": "Morning intention — today I will practice..." },
    { "id": "premeditatio_malorum", "label": "What could go wrong today? (and how will I handle it?)" },
    { "id": "evening_well", "label": "Evening review — what did I do well today?" },
    { "id": "evening_shortfall", "label": "Evening review — where did I fall short?" },
    { "id": "gratitude", "label": "What am I grateful for today that I usually take for granted?" },
    { "id": "free_space", "label": "Free space — write to Epictetus, or to your future self" }
  ],
  "entries": {}
}
```

4. Create a GitHub PAT (classic) with `gist` scope only.
5. Copy gist URL and extract `GIST_ID` from:
   `https://gist.github.com/<user>/<gist_id>`

## One-time Vercel setup

1. Create/import Vercel project from this repository.
2. Add these environment variables:

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | PAT with `gist` scope |
| `GIST_ID` | secret gist ID |
| `GIST_FILENAME` | `stoic-journal.json` |
| `JOURNAL_PASSPHRASE` | your passphrase |
| `SESSION_SECRET` | long random secret (32+ chars) |
| `SESSION_TTL_SECONDS` | `604800` (optional) |
| `APP_ORIGIN` | GitHub Pages origin (for example `https://priyankvora257.github.io`) |

3. Deploy/redeploy project.
4. Copy Vercel base URL (for example `https://your-project.vercel.app`).

## Frontend configuration

Update this line in `stoic_daily_toolkit.html`:

```js
var STOIC_API_BASE = 'https://your-project.vercel.app';
```

Commit and push to `main` so GitHub Pages serves the updated frontend.

## API endpoints

- `POST /api/auth/login`
  - Body: `{ "passphrase": "<value>" }`
  - Response: `{ token, expiresInSeconds }`

- `POST /api/auth/logout`
  - Response: `{ ok: true }`

- `GET /api/journal?date=YYYY-MM-DD`
  - Header: `Authorization: Bearer <token>`
  - Response: `{ date, questions, entry }`

- `PUT /api/journal?date=YYYY-MM-DD`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "entry": { ...questionFields } }`
  - Response: `{ ok, date, entry, questions }`

## Expected behavior

- Same date: existing entry auto-loads and updates in place
- New date: empty entry for that date
- Autosave triggers as user types

## Security notes

- Never commit token values or secrets to git
- Env var names in docs are safe; values must stay secret
- Restrict frontend origin with `APP_ORIGIN`
