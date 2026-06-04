import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <Logo
            withWordmark
            className="h-8 w-8"
            wordmarkClassName="font-display text-lg font-bold tracking-tight"
          />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "#features", label: "Features" },
            { href: "#how", label: "How it works" },
            { href: "#pricing", label: "Pricing" },
            { href: "#faq", label: "FAQ" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <Link to="/auth">Get started →</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
