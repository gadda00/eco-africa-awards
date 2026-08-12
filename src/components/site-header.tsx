"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Categories", href: "#categories" },
  { label: "Nominate", href: "#nominate" },
  { label: "Selection", href: "#selection" },
  { label: "Timeline", href: "#timeline" },
  { label: "Winners", href: "#winners" },
  { label: "Ceremony", href: "#ceremony" },
  { label: "FAQ", href: "#faq" },
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
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="#top" className="group flex items-center gap-2.5">
            <div className="relative h-9 w-9 lg:h-11 lg:w-11 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-500 grid place-items-center shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-105">
              <Leaf className="h-4 w-4 lg:h-5 lg:w-5 text-background" strokeWidth={2.5} />
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg lg:text-xl font-bold tracking-tight text-foreground">
                Eco Africa
              </span>
              <span className="text-[10px] lg:text-xs uppercase tracking-[0.22em] text-emerald-400/90 font-medium">
                Awards
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3.5 py-2 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors group"
              >
                {item.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-emerald-400 to-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
              <Link href="#ceremony">Attend</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-background font-semibold shadow-lg shadow-emerald-500/30"
            >
              <Link href="#nominate">Nominate Now</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden grid h-10 w-10 place-items-center rounded-lg border border-border/60 text-foreground"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="#ceremony" onClick={() => setMobileOpen(false)}>Attend</Link>
                </Button>
                <Button asChild size="sm" className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-background font-semibold">
                  <Link href="#nominate" onClick={() => setMobileOpen(false)}>Nominate</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
