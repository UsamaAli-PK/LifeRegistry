# Milestone 11–13: PWA, Push Notifications, Power Features, Responsive

Heads-up on PWA scope: full offline + service workers can interfere with the Lovable editor preview (stale caches, navigation hijacking). I'll guard registration so the SW only activates on the published URL and on real installs — in the preview iframe it stays dormant. Push notifications only fire reliably on the **published** app, not in the editor preview.

---

## Milestone 11 — Power features + responsive sweep (ship first, no secrets needed)

**New features:**
1. **⌘K command palette** (`cmdk`) — jump to any route, any item, run actions (new item, export CSV, toggle theme). Opens with ⌘K / Ctrl+K, also a button in the top bar.
2. **Bulk actions on items** — checkbox column, sticky action bar when ≥1 selected: Archive, Delete, Change status, Add tag. Works in both table and mobile card views.
3. **CSV import + export** — Export = one button, full registry as CSV. Import = drag-and-drop CSV, column mapping UI, preview rows, then commit. Uses `papaparse`.
4. **Price history** — new `item_price_history` table, log a row whenever cost/billing_cycle changes (DB trigger). Item detail drawer shows a sparkline + table of past changes.

**Responsive sweep — all routes at 390 / 768 / 1280 / 1920:**
- Items: table collapses to cards under 768px; filters move into a bottom sheet on mobile.
- Calendar: month grid switches to agenda list under 640px.
- Analytics: donut + 12-month bars resize to viewport, no horizontal scroll.
- Dashboard/Settings/Analytics: tighten paddings, stack KPIs, ensure tap targets ≥44px.
- AppShell: nav becomes bottom tab bar under 640px.

---

## Milestone 12 — PWA (installable + offline)

1. `bun add -D vite-plugin-pwa` + `workbox-window`.
2. Generate icon set (192, 512, maskable 512) from existing logo.
3. `manifest.webmanifest`: name, short_name, theme/background from design tokens, `display: standalone`, screenshots.
4. `vite.config.ts`: VitePWA with `devOptions.enabled: false`, `NetworkFirst` for HTML, `navigateFallbackDenylist: [/^\/api/, /^\/~oauth/]`.
5. Registration guard in `src/main.tsx`: skip SW registration when inside an iframe or on a `*lovable*` preview host; unregister any existing SW in those contexts (preview hygiene).
6. "Install app" button in Settings that listens for `beforeinstallprompt` and triggers the install dialog (Chrome/Edge desktop + Android).
7. iOS install instructions card (Safari has no `beforeinstallprompt`).

---

## Milestone 13 — Web Push notifications

**Setup:**
1. Generate VAPID key pair (I'll run `web-push generate-vapid-keys` in the sandbox), then store `VAPID_PRIVATE_KEY` as a secret. Public key goes in `.env` as `VITE_VAPID_PUBLIC_KEY`.
2. Migration: `push_subscriptions` table (user_id, endpoint, p256dh, auth, user_agent, created_at) with RLS = own-rows.
3. Service worker push handler (`public/sw-push.js`, imported by the PWA SW) — shows notification, click opens `/calendar` or item detail.

**Server functions (createServerFn):**
- `subscribeToPush({ subscription })` — upsert into `push_subscriptions`.
- `unsubscribeFromPush()` — delete current user's row.
- `sendTestPush()` — sends a test notification to caller's subscriptions. Wired to a button in Settings.

**Cron-driven push (server routes under `/api/public/hooks/`):**
- `POST /api/public/hooks/due-soon` — runs hourly, finds items with renewal/expiry in 30/7/1 days that haven't been notified for that bucket today, sends push.
- `POST /api/public/hooks/daily-digest` — runs 9am UTC daily, sends "X items due this week" digest per user.
- `notification_log` table tracks what was sent (prevents dupes; user-visible "Recent notifications" list in Settings).
- Web Push signing done with Web Crypto API directly (avoids `web-push` Node compat issues on the Worker runtime).
- pg_cron jobs added via `supabase--insert` after the routes are live.

**Settings UI additions:**
- Toggle: Enable browser notifications (handles `Notification.requestPermission` + subscribe).
- Toggle: Daily digest on/off (stored on `profiles`).
- Buttons: Send test notification, View recent notifications.
- iOS note: "Add to Home Screen first to receive notifications" (iOS 16.4+ requirement).

---

## What I need from you

- For Milestone 13 only: I'll generate the VAPID keys myself and trigger the secrets dialog so you can save the private key. Nothing to gather in advance.
- Confirm: ship M11 + M12 + M13 in sequence in this conversation, or stop after M11 so you can review?

## Technical notes (skip if non-technical)

- Service worker file: keep at `dev-dist/sw.js` (auto-generated). Manual `public/sw.js` only if we need a kill-switch later.
- `vite-plugin-pwa` runs alongside TanStack Start fine; we set `injectRegister: false` and register manually so we can apply the iframe/preview guards.
- Push signing on Cloudflare Workers: ES256 JWT via `crypto.subtle.sign` — no `web-push` npm dep needed in the server runtime.
- Bulk actions use Supabase `.in('id', ids)` with RLS already restricting to own rows.
- Price history trigger: `BEFORE UPDATE` on `items` comparing OLD vs NEW cost/billing_cycle.