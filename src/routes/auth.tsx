import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { mockAuth } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — LifeRegistry" },
      { name: "description", content: "Sign in or create your LifeRegistry account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mockAuth.getUser()) navigate({ to: "/dashboard" });
  }, [navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      mockAuth.signIn(email || "demo@liferegistry.app", displayName);
      toast.success(mode === "signup" ? "Account created (demo)" : "Welcome back");
      navigate({ to: "/dashboard" });
      setLoading(false);
    }, 350);
  }

  function handleDemo() {
    setLoading(true);
    setTimeout(() => {
      mockAuth.signIn("demo@liferegistry.app", "Alex");
      toast.success("Signed in as demo");
      navigate({ to: "/dashboard" });
      setLoading(false);
    }, 200);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-radial-hero" />
      <div className="grid-paper absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6">
        <Link to="/" className="flex items-center">
          <Logo withWordmark className="h-8 w-8" wordmarkClassName="font-display text-lg font-bold tracking-tight" />
        </Link>
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
          ← back home
        </Link>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-8 sm:px-6 md:grid-cols-2 md:gap-16">
        <div className="hidden flex-col justify-between md:flex">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-brand-violet">
              / issue 001 — your registry
            </p>
            <h1 className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight">
              Everything you own,
              <br />
              <span className="text-brand-gradient">in one place.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Subscriptions, warranties, domains, accounts — finally organized. Stop forgetting. Stop overpaying.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              ✦ demo mode — no real account needed
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {["✦ secure", "↻ synced", "♥ shared", "★ legacy"].map((t, i) => (
              <span
                key={t}
                className={`sticker rounded-full bg-card px-4 py-2 font-mono text-xs ${i % 2 ? "tilt-sm-r" : "tilt-sm-l"}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="glass-card rounded-3xl p-7 sm:p-9">
            <div className="mb-6 flex items-center gap-3">
              <span className="sticker rounded-full bg-brand-violet px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white">
                {mode === "signin" ? "/ sign in" : "/ sign up"}
              </span>
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="ml-auto font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                {mode === "signin" ? "new here? →" : "have an account? →"}
              </button>
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight">
              {mode === "signin" ? "Welcome back." : "Start your registry."}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Demo mode — any email/password works.
            </p>

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleDemo}
              className="mt-6 h-11 w-full rounded-full border-foreground/20 font-medium"
            >
              ✦ Try the demo (one click)
            </Button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">or email</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name" className="font-mono text-[11px] uppercase tracking-widest">
                    Display name
                  </Label>
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex"
                    className="mt-1 h-11 rounded-xl"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="mt-1 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 h-11 rounded-xl"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-full bg-foreground font-semibold text-background hover:bg-foreground/90"
              >
                {loading ? <Loader2 className="animate-spin" /> : mode === "signin" ? "Sign in →" : "Create account →"}
              </Button>
            </form>

            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              demo · no data leaves this device
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
