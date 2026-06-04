# LifeRegistry

> One simple app to manage everything you own and pay for — subscriptions, warranties, domains, bills, devices, and more. All in one place, all in your browser.

A demo app built with **React 19**, **Tailwind CSS v4**, and **shadcn/ui** components. Your data stays on your device (it's all stored in your browser), so there's no backend or login required.

**Developed by [Usama Ali](https://www.linkedin.com/in/usamaalipk/)**

---

## ✨ What You Can Do

- 📊 **Dashboard** — See how much you're spending and when things renew
- 📚 **Track items** — Add subscriptions, warranties, domains, insurance, bills, devices, and more
- 🗓 **Calendar view** — Visualize all your renewals and expiries by month
- 📈 **Analytics** — Understand your spending by category and billing cycle
- ⌘ **Search anything** — Use the command palette (⌘K or Ctrl+K) to find items instantly
- ✅ **Bulk actions** — Select multiple items and update or delete them at once
- 📥 **Export your data** — Download everything as a CSV file
- 🌗 **Dark mode** — Easy on the eyes, day or night

---

## 🚀 Get Started

### Local setup

You need [Bun](https://bun.sh) installed (or Node 20+ with npm/pnpm).

```bash
bun install
bun run dev
```

Open <http://localhost:5173> in your browser.

**To try it out:** Click **Try the demo** on the login screen — or sign in with any email and password.

---

## 📦 Build for production

```bash
bun run build
bun run preview
```

---

## ☁️ Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial LifeRegistry"
git branch -M main
git remote add origin https://github.com/<your-username>/liferegistry.git
git push -u origin main
```

### Step 2: Deploy

1. Go to <https://vercel.com/new>
2. Import your GitHub repository
3. Click **Deploy** — that's it! Vercel will handle the rest automatically.

No environment setup needed. Your app runs fully in the browser.

---

## 🎯 Features at a glance

| Feature | What it does |
| --- | --- |
| 🔐 **Mock login** | Sign in without creating an account |
| 💾 **Stores locally** | Your data lives in your browser — totally private |
| 📊 **Dashboard KPIs** | Monthly spend, upcoming renewals, expiries |
| 🛠 **Full CRUD** | Create, read, update, or delete any item |
| 9 Item types | Subscription, warranty, domain, insurance, bill, device, account, membership, and others |
| 📈 **Smart analytics** | See breakdowns by type, vendor, and billing cycle |
| ✅ **Bulk operations** | Select multiple items and act on them together |
| 📥 **CSV export** | Download your registry anytime |
| 🌗 **Dark mode** | Choose your theme |
| 🔄 **Reset data** | Restore the demo data from Settings anytime |

---

## 📝 How it works

- **All in your browser** — No server, no database, no backend
- **localStorage** — Data is saved in your browser's local storage
- **Private** — Only you can see your data
- **No sign-up** — Use any email/password to get started
- **Portable** — Export as CSV and import elsewhere if needed

To clear all data, go to **Settings → Reset mock data** or clear your browser's local storage.

---

## 🛠 Tech stack (for developers)

| Layer | Tool |
| --- | --- |
| Framework | TanStack Start + React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | TanStack Router |
| State & data | TanStack Query + localStorage |
| Charts | Recharts |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Search | cmdk |
| Data export | papaparse |

---

## 📁 Project structure (for developers)

```
src/
├─ routes/              App pages (landing, auth, dashboard, etc.)
├─ components/          Reusable UI components
├─ lib/
│  ├─ mock.ts          localStorage mock backend
│  ├─ items.ts         Item type helpers
│  └─ csv.ts           CSV import/export
└─ styles.css          Design tokens and theme
```

---

## 💡 Tips

- The demo data resets when you clear your browser's cookies/cache
- To restore demo data anytime, go to **Settings → Reset mock data**
- All your data is **never** sent to any server — it's just on your device

---

## 👤 Credits

Designed & developed by **[Usama Ali](https://www.linkedin.com/in/usamaalipk/)**.

If this was helpful, a ⭐ on GitHub or a [LinkedIn](https://www.linkedin.com/in/usamaalipk/) connection would mean a lot!

---

## 📄 License

MIT — Do whatever you want, just keep the credit.
