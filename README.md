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

The separate [right-eye tracker](https://priyankvora257.github.io/Github-Pages/right-eye/) shows the 48-item daily schedule (47 timed doses and one untimed after-dinner tablet). On iPhone, open the HTTPS page in Safari and choose Share → Add to Home Screen. After the first online visit it can open offline; keep existing phone alarms because it does not notify when closed.

Check-offs are stored only in IndexedDB on the device, keyed by the India-time day. There is no tracker backend or online check-off history. Use the same browser/Home Screen context consistently: Safari and an installed Home Screen app can have separate storage. Private Browsing, clearing website data, or removing the Home Screen app may erase check-offs. Compare the public schedule with the doctor's instructions before using it.