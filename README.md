# LifeRegistry

> The command center for everything you own and pay for — subscriptions, warranties, domains, memberships, insurance, bills, and devices, all in one place.

A polished demo MVP built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. This build runs entirely in the browser with a mock backend (localStorage), so it's instantly deployable with zero infrastructure.

**Developed by [Usama Ali](https://www.linkedin.com/in/usamaalipk/)**

---

## ✨ Features

- 🔐 **Mock auth** — sign in with any email or use the one-click demo
- 📊 **Dashboard** — KPIs for monthly spend, upcoming renewals, and expiries
- 📚 **Registry** — full CRUD over 9 item types (subscription, warranty, domain, insurance, bill, device, account, membership, other)
- 🗓 **Calendar view** — see renewals and expiries by month
- 📈 **Analytics** — spend breakdown by type, vendor, and billing cycle
- ⌘ **Command palette** (⌘K / Ctrl+K) — global search and quick actions
- ✅ **Bulk actions** — multi-select, change status, delete
- 📥 **CSV export** — download your registry
- 🌗 **Polished UI** — semantic design tokens, dark-mode ready, responsive
- 💾 **Persists in `localStorage`** — your data stays on this browser
- 🧹 **Reset mock data** — restore the seed registry from Settings

---

## 🚀 Quick start (local)

Requires [Bun](https://bun.sh) (or Node 20+ with npm/pnpm).

```bash
bun install
bun run dev
```

Open <http://localhost:5173>.

To sign in, click **Try the demo** on the auth screen — or enter any email/password.

---

## 📦 Build

```bash
bun run build
bun run preview
```

---

## ☁️ Deploy

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial LifeRegistry MVP"
git branch -M main
git remote add origin https://github.com/<your-username>/liferegistry.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to <https://vercel.com/new> and **Import** your GitHub repo.
2. Vercel auto-detects the project. Leave the defaults — `vercel.json` already sets `NITRO_PRESET=vercel` so the TanStack Start SSR build outputs a Vercel-native bundle.
3. Click **Deploy**.

No environment variables are required — this is a fully client-side mock.

> Optional: if you ever wire a real backend (e.g. Supabase, Postgres), add the relevant `VITE_*` env vars in **Vercel → Project → Settings → Environment Variables**.

---

## 🧱 Tech stack

| Layer        | Tool                                      |
| ------------ | ----------------------------------------- |
| Framework    | TanStack Start v1 (React 19 + Vite 7)     |
| Styling      | Tailwind CSS v4 + shadcn/ui + Radix       |
| Routing      | TanStack Router (file-based)              |
| State / data | TanStack Query + localStorage mock        |
| Charts       | Recharts                                  |
| Icons        | lucide-react                              |
| Forms        | react-hook-form + zod                     |
| Command bar  | cmdk                                      |
| CSV          | papaparse                                 |

---

## 📁 Project structure

```
src/
├─ routes/                  TanStack file-based routes
│  ├─ __root.tsx            app shell
│  ├─ index.tsx             landing page
│  ├─ auth.tsx              sign in / sign up
│  └─ _authenticated/       protected app (dashboard, items, calendar, analytics, settings)
├─ components/
│  ├─ app/                  AppShell, CommandPalette, ItemFormDialog…
│  ├─ landing/              SiteHeader, SiteFooter
│  ├─ brand/                Logo
│  └─ ui/                   shadcn primitives
├─ lib/
│  ├─ mock.ts               localStorage-backed mock backend + seed data
│  ├─ items.ts              item type metadata + helpers
│  └─ csv.ts                CSV import/export
└─ styles.css               design tokens (oklch) + Tailwind theme
```

---

## 📝 Notes

- This is a **demo / portfolio build**. All data lives in your browser's `localStorage` under `lr.mock.*` keys.
- To reset to the seed registry, go to **Settings → Reset mock data**.
- To wipe everything, clear the site's storage in DevTools → Application → Local Storage.

---

## 👤 Credits

Designed & developed by **[Usama Ali](https://www.linkedin.com/in/usamaalipk/)**.

If you found this useful, a ⭐ on GitHub or a LinkedIn connection is appreciated!

---

## 📄 License

MIT — do whatever, just keep the credit.
