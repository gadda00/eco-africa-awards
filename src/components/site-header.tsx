"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Categories", href: "/categories" },
  { label: "Nominate", href: "/nominate" },
  { label: "Winners", href: "/winners" },
  { label: "Ceremony", href: "/ceremony" },
  { label: "Judges", href: "/judges" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/85 backdrop-blur-xl border-b border-forest/15 shadow-warm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-forest to-forest-light grid place-items-center shadow-forest transition-transform group-hover:scale-105">
              <AcaciaMark className="h-5 w-5 lg:h-6 lg:w-6 text-gold-light" />
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/15" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base lg:text-lg font-bold tracking-tight text-forest">
                Africa Climate
              </span>
              <span className="text-[10px] lg:text-xs uppercase tracking-[0.22em] text-gold font-bold">
                Leadership Awards
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3.5 py-2 text-sm font-medium text-foreground/70 hover:text-forest transition-colors group"
              >
                {item.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 bg-gradient-to-r from-forest to-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Button asChild size="sm" className="bg-forest hover:bg-forest-light text-cream font-bold shadow-forest h-10 px-5">
              <Link href="/nominate">Nominate Now</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden grid h-10 w-10 place-items-center rounded-xl border border-forest/20 text-forest bg-white/60 backdrop-blur-sm"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-forest/15 bg-cream/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-forest hover:bg-forest/5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild size="sm" className="mt-2 bg-forest hover:bg-forest-light text-cream font-bold">
                <Link href="/nominate" onClick={() => setMobileOpen(false)}>Nominate Now</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function AcaciaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="6" cy="9" rx="4" ry="2.5" />
      <ellipse cx="18" cy="9" rx="4" ry="2.5" />
      <ellipse cx="12" cy="7" rx="5" ry="3" />
      <rect x="11" y="11" width="2" height="11" />
    </svg>
  );
}
