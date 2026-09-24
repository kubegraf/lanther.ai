import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { links, primaryNav } from "../../lib/site";
import { useScrolled } from "../../lib/hooks";

export function Navbar() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on Escape and return focus to the toggle. Lock scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // The mobile menu is only reachable below lg. Close it if the viewport grows.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid ? "border-white/[0.08] bg-bg/75 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="container-site flex h-[var(--nav-h)] items-center justify-between gap-6">
        <a href="#top" className="rounded-md" aria-label="Lanther home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={links.signIn} variant="ghost" size="sm">
            Sign in
          </Button>
          <Button href={links.getStarted} size="sm" arrow>
            Get started
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - var(--nav-h))" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto border-t border-white/[0.08] bg-bg lg:hidden"
          >
            <div className="container-site flex h-full flex-col py-6">
              <ul className="flex flex-col">
                {primaryNav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex h-14 items-center border-b border-white/[0.06] text-lg text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <Button href={links.signIn} variant="secondary" size="lg" onClick={() => setOpen(false)}>
                  Sign in
                </Button>
                <Button href={links.getStarted} size="lg" onClick={() => setOpen(false)}>
                  Get started
                </Button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
