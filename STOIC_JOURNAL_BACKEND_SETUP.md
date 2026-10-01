# Stoic Journal Backend Setup (GitHub + Vercel)

One-time setup for cloud journal persistence: the `stoic_daily_toolkit.html` frontend (GitHub Pages) calls a Vercel-hosted API, which reads and writes a single secret gist JSON document.

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
5. Extract `GIST_ID` from the gist URL: `https://gist.github.com/<user>/<gist_id>`

## One-time Vercel setup

1. Import this repository as a Vercel project.
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

3. Deploy, then copy the Vercel base URL (for example `https://your-project.vercel.app`).

## Frontend configuration

Update this line in `stoic_daily_toolkit.html`:

```js
var STOIC_API_BASE = 'https://your-project.vercel.app';
```

Push to `main` so GitHub Pages serves the update.

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
  - `discomfort` is optional. When present it records whether you stepped into voluntary discomfort that day. When omitted, the stored value is preserved.
  - Response: `{ ok, date, entry, questions }`

## Week in review (Weekly tab)

On Saturday and Sunday, the Reflection → Weekly tab shows a read-only card aggregating the current Monday–Sunday week's entries per question (Mon–Sat on Saturday), the most-named virtue, and the count of `discomfort` days (set by the "Do hard things on purpose" tracker on the Stress tab). It needs no extra endpoints or storage.

## Expected behavior

Selecting a date with an existing entry loads and updates it in place; a new date starts empty. Autosave triggers as you type.

## Security notes

Never commit token or secret values to git — env var names in docs are safe, but values must stay secret. Restrict the frontend origin with `APP_ORIGIN`.
