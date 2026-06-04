import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { mockAuth, mockItems, mockProfile } from "@/lib/mock";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, LogOut, RotateCcw, Trash2 } from "lucide-react";

const PREF_KEY = "lr.prefs.v1";
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR"] as const;
const LEAD_TIMES = ["3", "7", "14", "30"] as const;

type Prefs = { currency: string; leadDays: string };
const defaultPrefs: Prefs = { currency: "USD", leadDays: "7" };

import { RouteError } from "@/components/app/RouteError";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LifeRegistry" },
      { name: "description", content: "Manage your profile, default currency, and reminder lead time." },
    ],
  }),
  component: SettingsPage,
  errorComponent: RouteError,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [savingProfile, setSavingProfile] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const u = mockAuth.getUser();
    if (u) setEmail(u.email);
    const prof = mockProfile.get();
    setDisplayName(prof.display_name);
    setTimezone(prof.timezone);
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (raw) setPrefs({ ...defaultPrefs, ...JSON.parse(raw) });
    } catch {
      /* noop */
    }
  }, []);

  function saveProfile() {
    setSavingProfile(true);
    setTimeout(() => {
      mockProfile.update({ display_name: displayName.trim() || "demo", timezone });
      toast.success("Profile saved (demo)");
      setSavingProfile(false);
    }, 200);
  }

  function savePrefs(next: Prefs) {
    setPrefs(next);
    localStorage.setItem(PREF_KEY, JSON.stringify(next));
    toast.success("Saved");
  }

  function signOut() {
    mockAuth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  function doReset() {
    setResetting(true);
    setTimeout(() => {
      mockItems.reset();
      toast.success("Mock data reset");
      setResetting(false);
      setConfirmReset(false);
    }, 200);
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div className="bg-radial-hero pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-violet">/ tune your space</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">{email} · demo mode</p>

          <div className="glass-card mt-8 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight">Profile</h2>
              <span className="sticker tilt-sm-r rounded-full bg-brand-mint px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-emerald-900">
                ✦ you
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-widest">Display name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-widest">Timezone</Label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="UTC, America/New_York…" />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                onClick={saveProfile}
                disabled={savingProfile}
                className="rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
              >
                {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />} Save profile
              </Button>
            </div>
          </div>

          <div className="glass-card mt-6 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight">Preferences</h2>
              <span className="sticker tilt-sm-l rounded-full bg-brand-amber px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-900">
                ↻ defaults
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-widest">Default currency</Label>
                <Select value={prefs.currency} onValueChange={(v) => savePrefs({ ...prefs, currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[11px] uppercase tracking-widest">Reminder lead time</Label>
                <Select value={prefs.leadDays} onValueChange={(v) => savePrefs({ ...prefs, leadDays: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LEAD_TIMES.map((d) => <SelectItem key={d} value={d}>{d} days before</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              ✦ saved to this device
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-brand-coral/30 bg-brand-coral/5 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold tracking-tight text-brand-coral">Demo controls</h2>
              <span className="sticker tilt-sm-l rounded-full bg-brand-coral px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white">
                ✕ careful
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-bold tracking-tight">Sign out</p>
                <p className="text-sm text-muted-foreground">End your demo session.</p>
              </div>
              <Button onClick={signOut} variant="outline" className="rounded-full">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-brand-coral/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-bold tracking-tight">Reset mock data</p>
                <p className="text-sm text-muted-foreground">Restore the seeded registry exactly as it shipped.</p>
              </div>
              <Button
                onClick={() => setConfirmReset(true)}
                className="rounded-full bg-brand-coral text-white hover:bg-brand-coral/90"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset mock registry?</AlertDialogTitle>
            <AlertDialogDescription>
              Every item you added or edited will be replaced with the original demo dataset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doReset}
              disabled={resetting}
              className="bg-brand-coral text-white hover:bg-brand-coral/90"
            >
              {resetting && <Loader2 className="h-4 w-4 animate-spin" />} <Trash2 className="h-4 w-4" /> Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
