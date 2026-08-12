"use client";

import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, Twitter, Linkedin, Youtube, Instagram, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Categories", href: "#categories" },
  { label: "Nominate", href: "#nominate" },
  { label: "Selection", href: "#selection" },
  { label: "Timeline", href: "#timeline" },
  { label: "Winners", href: "#winners" },
  { label: "Ceremony", href: "#ceremony" },
  { label: "FAQ", href: "#faq" },
];

const resourceLinks = [
  { label: "ACLA Knowledge Hub", href: siteConfig.parentOrgUrl },
  { label: "Awards Code of Conduct", href: "#" },
  { label: "Privacy Notice", href: "#" },
  { label: "Press Kit", href: "#" },
  { label: "Volunteer", href: "#contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-gradient-to-b from-background to-card/40">
      <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="#top" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-500 grid place-items-center shadow-lg shadow-emerald-500/30">
                <Leaf className="h-5 w-5 text-background" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight">Eco Africa</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-400/90 font-medium">
                  Awards
                </span>
              </div>
            </Link>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
              The continental celebration of African climate leadership — an initiative of the Africa Climate Leadership Academy (ACLA).
            </p>
            <div className="mt-5 space-y-1.5 text-sm">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-emerald-400 transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span>{siteConfig.email}</span>
              </a>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-muted-foreground hover:text-emerald-400 transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span>{siteConfig.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{siteConfig.location}</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-400 font-semibold mb-3">
              Navigate
            </div>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-400 font-semibold mb-3">
              Resources
            </div>
            <ul className="space-y-2">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                    {l.href.startsWith("http") && <ArrowUpRight className="h-3 w-3 opacity-60" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-400 font-semibold mb-3">
              Stay Updated
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Awards announcements, ceremony news, and continental climate stories.
            </p>
            <a
              href="#ceremony"
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-background transition-colors"
            >
              Subscribe
            </a>
          </div>
        </div>

        {/* Social row */}
        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. An initiative of {siteConfig.parentOrg}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {[
              { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
              { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
              { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
              { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="h-9 w-9 rounded-lg border border-border/60 grid place-items-center text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Climate pledge strip */}
        <div className="mt-8 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-400 font-semibold">Climate-positive operations.</span>{" "}
            Every Eco Africa Awards ceremony is planned to be carbon-neutral, with verified offsets supporting African ecosystem restoration.
          </p>
        </div>
      </div>
    </footer>
  );
}
