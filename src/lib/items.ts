export const ITEM_TYPES = [
  "subscription",
  "warranty",
  "account",
  "domain",
  "membership",
  "insurance",
  "bill",
  "device",
  "other",
] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export const BILLING_CYCLES = ["one_time", "weekly", "monthly", "quarterly", "yearly"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const ITEM_STATUSES = ["active", "paused", "cancelled", "expired"] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const TYPE_META: Record<ItemType, { label: string; emoji: string; tone: string }> = {
  subscription: { label: "Subscription", emoji: "↻", tone: "bg-brand-violet/15 text-brand-violet" },
  warranty: { label: "Warranty", emoji: "✦", tone: "bg-brand-mint/15 text-brand-mint" },
  account: { label: "Account", emoji: "◉", tone: "bg-brand-blue/15 text-brand-blue" },
  domain: { label: "Domain", emoji: "◈", tone: "bg-brand-coral/15 text-brand-coral" },
  membership: { label: "Membership", emoji: "★", tone: "bg-brand-amber/25 text-amber-700 dark:text-brand-amber" },
  insurance: { label: "Insurance", emoji: "✚", tone: "bg-brand-mint/15 text-brand-mint" },
  bill: { label: "Bill", emoji: "$", tone: "bg-brand-coral/15 text-brand-coral" },
  device: { label: "Device", emoji: "▣", tone: "bg-brand-violet/15 text-brand-violet" },
  other: { label: "Other", emoji: "•", tone: "bg-muted text-foreground" },
};

export const CYCLE_LABEL: Record<BillingCycle, string> = {
  one_time: "one-time",
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  yearly: "/yr",
};

export function monthlyEquivalent(cost: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly": return cost * 4.345;
    case "monthly": return cost;
    case "quarterly": return cost / 3;
    case "yearly": return cost / 12;
    case "one_time": return 0;
  }
}

export function formatMoney(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
