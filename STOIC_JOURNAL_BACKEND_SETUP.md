# Stoic Journal Backend Setup (GitHub + Vercel)

This document covers one-time setup for cloud journal persistence using Vercel serverless functions and a secret GitHub gist as storage.

## Architecture

`stoic_daily_toolkit.html` (GitHub Pages frontend) calls a Vercel-hosted API, which reads and writes a single secret gist JSON document for storage.

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
  - Body: `{ "entry": { ...questionFields }, "discomfort": true }`
  - `discomfort` is optional. When present it records whether you stepped into voluntary discomfort that day (used by the Weekly tab "Week in review"). When omitted, the stored value is preserved, so saving journal text never clears it.
  - Response: `{ ok, date, entry, questions }`

## Week in review (Weekly tab)

The Reflection → Weekly tab shows a read-only "Week in review" card, surfaced on Saturday and Sunday. It aggregates the current Monday–Sunday week's journal entries (Mon–Sat on Saturday, Mon–Sun on Sunday) per question, tallies the most-named virtue, and counts discomfort days from the `discomfort` boolean toggled via the "Do hard things on purpose" tracker on the Stress tab. No extra endpoints or storage are required — it lives in the same gist entry as the journal text.

## Expected behavior

Selecting a date with an existing entry auto-loads and updates it in place; a new date starts with an empty entry. Autosave triggers as the user types.

## Security notes

Never commit token or secret values to git — env var names in docs are safe, but values must stay secret. Restrict the frontend origin with `APP_ORIGIN`.
