import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Command as CommandIcon, LayoutDashboard, ListChecks, LogOut, Settings } from "lucide-react";
import { mockAuth } from "@/lib/mock";
import { toast } from "sonner";
import { CommandPalette } from "@/components/app/CommandPalette";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/items", label: "Registry", icon: ListChecks },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const navigate = useNavigate();
  const [, setTick] = useState(0); // force re-render if needed

  async function signOut() {
    mockAuth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  function openPalette() {
    // dispatch synthetic ⌘K so CommandPalette toggles
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    setTick((n) => n + 1);
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
          <Link to="/" className="flex items-center">
            <Logo withWordmark className="h-8 w-8" wordmarkClassName="font-display text-lg font-bold tracking-tight" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={openPalette}
              className="hidden items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted md:flex"
              aria-label="Open command palette"
            >
              <CommandIcon className="h-3.5 w-3.5" />
              Search
              <kbd className="rounded bg-background px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <Button size="icon" variant="ghost" onClick={openPalette} className="rounded-full md:hidden" aria-label="Search">
              <CommandIcon className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={signOut} className="rounded-full" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {children}

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-5">
          {nav.map((n) => {
            const active = loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <n.icon className={`h-5 w-5 ${active ? "text-brand-violet" : ""}`} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="hidden border-t border-border bg-background/60 py-4 text-center text-xs text-muted-foreground sm:block">
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/usamaalipk/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:text-brand-violet hover:underline"
        >
          Usama Ali
        </a>
      </footer>

      <CommandPalette />
    </div>
  );
}
