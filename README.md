# Man Your Post: email giveaway popup + social kit (2026-11-04)

Review: https://blueboxdoctor.github.io/cfl-man-your-post-review/  ·  Demo: /demo.html

- `popup/myp-popup.js`: drop-in widget (Shadow DOM, no deps). Config via `window.MYP_POPUP` (see file header): `endpoint` + `method` ("mailchimp-jsonp" or "json"), `tag`, timing, excluded paths. With an empty endpoint it runs in demo mode.
- Opens on `?free=man-your-post` / `#man-your-post` / `[data-myp-open]` / `CFLManYourPost.open()`. Auto: 9s, 45% scroll, or desktop exit intent. Snoozes 7 days after a close and never shows after sign-up. GA4 events: myp_popup_open / _close / _subscribe.
- `social/`: rendered artwork. `render.mjs cards` rebuilds it, `render.mjs popup` re-shoots the popup screenshots.
- `COPY.md`: all wording, the posting order, and the open decisions.
