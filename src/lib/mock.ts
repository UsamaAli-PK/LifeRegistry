// Mock backend — in-memory + localStorage. Demo-only, no real backend.
import type { ItemRow } from "@/components/app/ItemFormDialog";
import type { BillingCycle, ItemStatus, ItemType } from "@/lib/items";

const SESSION_KEY = "lr.mock.session.v1";
const ITEMS_KEY = "lr.mock.items.v1";
const PROFILE_KEY = "lr.mock.profile.v1";

export type MockUser = { id: string; email: string; display_name: string };

const isBrowser = typeof window !== "undefined";

function read<T>(k: string, fb: T): T {
  if (!isBrowser) return fb;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fb;
  } catch {
    return fb;
  }
}
function write(k: string, v: unknown) {
  if (!isBrowser) return;
  localStorage.setItem(k, JSON.stringify(v));
}

// ---------- Auth ----------
const authListeners = new Set<(user: MockUser | null) => void>();

export const mockAuth = {
  getUser(): MockUser | null {
    return read<{ user: MockUser } | null>(SESSION_KEY, null)?.user ?? null;
  },
  signIn(email: string, displayName?: string): MockUser {
    const user: MockUser = {
      id: "mock-user-1",
      email: email || "demo@liferegistry.app",
      display_name: displayName?.trim() || email.split("@")[0] || "demo",
    };
    write(SESSION_KEY, { user });
    write(PROFILE_KEY, { display_name: user.display_name, timezone: "UTC" });
    // ensure seed exists
    if (!isBrowser ? false : !localStorage.getItem(ITEMS_KEY)) {
      write(ITEMS_KEY, seedItems());
    }
    authListeners.forEach((fn) => fn(user));
    return user;
  },
  signOut() {
    if (isBrowser) localStorage.removeItem(SESSION_KEY);
    authListeners.forEach((fn) => fn(null));
  },
  onChange(fn: (u: MockUser | null) => void) {
    authListeners.add(fn);
    return () => authListeners.delete(fn);
  },
};

// ---------- Profile ----------
export type MockProfile = { display_name: string; timezone: string };
export const mockProfile = {
  get(): MockProfile {
    return read<MockProfile>(PROFILE_KEY, { display_name: "demo", timezone: "UTC" });
  },
  update(p: Partial<MockProfile>) {
    write(PROFILE_KEY, { ...mockProfile.get(), ...p });
  },
};

// ---------- Items ----------
function uid() {
  return "id-" + Math.random().toString(36).slice(2, 10);
}

function daysFromNow(d: number): string {
  const x = new Date();
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
}

function seedItems(): ItemRow[] {
  const mk = (
    name: string,
    type: ItemType,
    vendor: string,
    cost: number,
    cycle: BillingCycle,
    renewal: number | null,
    expiry: number | null,
    tags: string[],
    url?: string,
  ): ItemRow & { created_at: string } => ({
    id: uid(),
    name,
    type,
    vendor,
    cost,
    currency: "USD",
    billing_cycle: cycle,
    renewal_date: renewal === null ? null : daysFromNow(renewal),
    expiry_date: expiry === null ? null : daysFromNow(expiry),
    account_email: "demo@liferegistry.app",
    url: url ?? null,
    notes: null,
    tags,
    status: "active" as ItemStatus,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
  });

  return [
    mk("Netflix Premium", "subscription", "Netflix", 22.99, "monthly", 5, null, ["entertainment", "family"], "https://netflix.com"),
    mk("Spotify Family", "subscription", "Spotify", 16.99, "monthly", 12, null, ["music"], "https://spotify.com"),
    mk("iCloud+ 200GB", "subscription", "Apple", 2.99, "monthly", 19, null, ["storage"]),
    mk("ChatGPT Plus", "subscription", "OpenAI", 20, "monthly", 2, null, ["ai", "work"]),
    mk("Adobe Creative Cloud", "subscription", "Adobe", 59.99, "monthly", 26, null, ["design", "work"]),
    mk("GitHub Pro", "subscription", "GitHub", 4, "monthly", 14, null, ["dev"]),
    mk("yourname.com", "domain", "Namecheap", 12.98, "yearly", 45, null, ["personal"]),
    mk("portfolio.dev", "domain", "Cloudflare", 9.5, "yearly", 120, null, ["personal"]),
    mk("MacBook AppleCare+", "warranty", "Apple", 379, "one_time", null, 220, ["devices"]),
    mk("Sony TV Warranty", "warranty", "Sony", 149, "one_time", null, 60, ["devices", "home"]),
    mk("Costco Gold Star", "membership", "Costco", 65, "yearly", 95, null, ["shopping"]),
    mk("NYTimes Digital", "membership", "NYT", 17, "monthly", 8, null, ["reading"]),
    mk("Renters Insurance", "insurance", "Lemonade", 14.5, "monthly", 3, null, ["home"]),
    mk("Car Insurance", "insurance", "Geico", 132, "monthly", 22, null, ["car"]),
    mk("Electric Bill", "bill", "Con Edison", 92, "monthly", 8, null, ["utilities"]),
    mk("Internet — Fiber 1Gb", "bill", "Verizon", 79.99, "monthly", 11, null, ["utilities"]),
    mk("Gym — Equinox", "membership", "Equinox", 295, "monthly", 30, null, ["health"]),
    mk("Google One 2TB", "account", "Google", 9.99, "monthly", 16, null, ["storage"]),
  ];
}

let _items: ItemRow[] | null = null;
function items(): ItemRow[] {
  if (_items) return _items;
  _items = read<ItemRow[]>(ITEMS_KEY, seedItems());
  return _items;
}
function persist() {
  if (_items) write(ITEMS_KEY, _items);
}

const itemListeners = new Set<() => void>();
function notify() {
  itemListeners.forEach((fn) => fn());
}

export const mockItems = {
  list(): ItemRow[] {
    return [...items()];
  },
  add(row: Omit<ItemRow, "id">): ItemRow {
    const next: ItemRow = { ...row, id: uid() };
    _items = [next, ...items()];
    persist();
    notify();
    return next;
  },
  update(id: string, patch: Partial<ItemRow>) {
    _items = items().map((i) => (i.id === id ? { ...i, ...patch } : i));
    persist();
    notify();
  },
  remove(id: string) {
    _items = items().filter((i) => i.id !== id);
    persist();
    notify();
  },
  removeMany(ids: string[]) {
    const set = new Set(ids);
    _items = items().filter((i) => !set.has(i.id));
    persist();
    notify();
  },
  setStatusMany(ids: string[], status: ItemStatus) {
    const set = new Set(ids);
    _items = items().map((i) => (set.has(i.id) ? { ...i, status } : i));
    persist();
    notify();
  },
  reset() {
    _items = seedItems();
    persist();
    notify();
  },
  onChange(fn: () => void) {
    itemListeners.add(fn);
    return () => itemListeners.delete(fn);
  },
};
