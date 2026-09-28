# Github-Pages

[![GitHub Pages](https://github.com/priyankvora257/Github-Pages/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)](https://github.com/priyankvora257/Github-Pages/actions/workflows/pages/pages-build-deployment)

This repository hosts the Stoic Daily Toolkit web app (`stoic_daily_toolkit.html`) on GitHub Pages.

The app includes:
- Daily Stoic ritual tabs (morning, evening, control check, weekly, quotes)
- Journal prompts and guided reflection
- Date-based journal persistence via Vercel API + secret GitHub gist backend

Setup and API documentation:
- [`STOIC_JOURNAL_BACKEND_SETUP.md`](./STOIC_JOURNAL_BACKEND_SETUP.md)

## Right-eye daily tracker

The separate [right-eye tracker](https://priyankvora257.github.io/Github-Pages/right-eye/) shows the 48-item daily schedule (47 timed doses and one untimed after-dinner tablet), a live full IST date/time, and the full IST date/time of each completed check-off. On iPhone, open the HTTPS page in Safari and choose Share → Add to Home Screen. After the first online visit it can open offline; keep existing phone alarms because it does not notify when closed.

Check-offs are stored only in IndexedDB on the device, keyed by the India-time day. There is no tracker backend or online check-off history. Use the same browser/Home Screen context consistently: Safari and an installed Home Screen app can have separate storage. Private Browsing, clearing website data, or removing the Home Screen app may erase check-offs. Compare the public schedule with the doctor's instructions before using it.

A separate [one-time calendar import file](https://priyankvora257.github.io/Github-Pages/right-eye/right-eye-calendar-2026-09-29.ics) remains available directly, but is intentionally not shown on the daily tracker page. It contains 47 timed daily events from 29 September through 28 October 2026 (IST), each with a 0-minute display alarm; it excludes the untimed after-dinner tablet. Google Calendar may ignore imported alarms: set a dedicated destination calendar's **Event notifications** to **0 minutes before** prior to import, then verify one event and the next day's recurrence. Check phone notification permissions; importing the file alone does not guarantee alerts.