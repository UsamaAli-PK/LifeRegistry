import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo withWordmark className="h-9 w-9" wordmarkClassName="font-display text-xl font-bold tracking-tight" />
            <p className="mt-4 max-w-sm font-display text-2xl font-semibold leading-tight tracking-tight">
              The command center for everything you own and pay for.
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">/ product</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#features" className="hover:text-brand-violet">Features</a></li>
              <li><a href="#pricing" className="hover:text-brand-violet">Pricing</a></li>
              <li><a href="#faq" className="hover:text-brand-violet">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">/ company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-violet">Privacy</a></li>
              <li><a href="#" className="hover:text-brand-violet">Terms</a></li>
              <li><a href="#" className="hover:text-brand-violet">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} LifeRegistry — stay on top of everything.</p>
          <p className="font-mono">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/usamaalipk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:text-brand-violet hover:underline"
            >
              Usama Ali
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
