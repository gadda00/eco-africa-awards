"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Twitter, Linkedin, Youtube, Instagram, ArrowUpRight } from "lucide-react";
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
  { label: "Code of Conduct", href: "#" },
  { label: "Privacy Notice", href: "#" },
  { label: "Press Kit", href: "#" },
  { label: "Volunteer", href: "#contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto bg-forest text-cream overflow-hidden">
      {/* Decorative wave top */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute top-0 inset-x-0 -translate-y-1/2 h-12 w-full text-background"
        aria-hidden="true"
      >
        <path
          d="M0 60 L0 30 Q180 0 360 30 T720 30 T1080 30 T1440 30 L1440 60 Z"
          fill="currentColor"
        />
      </svg>

      {/* Decorative warm glow */}
      <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-terracotta/15 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-gold to-terracotta grid place-items-center shadow-gold">
                <AcaciaMark className="h-6 w-6 text-cream" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-xl font-bold tracking-tight">
                  Africa Climate
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-gold-light font-semibold">
                  Leadership Awards
                </span>
              </div>
            </div>
            <p className="mt-6 text-sm text-cream/70 leading-relaxed max-w-md">
              The continental celebration of African climate leadership — an initiative of the
              Africa Climate Leadership Academy (ACLA), present in all 54 African countries.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-cream/80 hover:text-gold-light transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span>{siteConfig.email}</span>
              </a>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-cream/80 hover:text-gold-light transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span>{siteConfig.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-cream/80">
                <MapPin className="h-3.5 w-3.5" />
                <span>{siteConfig.location}</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-[0.22em] text-gold-light font-semibold mb-4">
              Navigate
            </div>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-cream/70 hover:text-cream transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-[0.22em] text-gold-light font-semibold mb-4">
              Resources
            </div>
            <ul className="space-y-2.5">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-sm text-cream/70 hover:text-cream transition-colors"
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
            <div className="text-xs uppercase tracking-[0.22em] text-gold-light font-semibold mb-4">
              Stay Updated
            </div>
            <p className="text-xs text-cream/70 mb-4">
              Awards announcements, ceremony news, and continental climate stories.
            </p>
            <a
              href="#ceremony"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream transition-colors shadow-gold"
            >
              Subscribe
            </a>
          </div>
        </div>

        {/* Social + copyright row */}
        <div className="mt-12 pt-6 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/60">
            © {new Date().getFullYear()} {siteConfig.name}. An initiative of {siteConfig.parentOrg}.
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
                className="h-9 w-9 rounded-lg border border-cream/20 grid place-items-center text-cream/70 hover:text-gold-light hover:border-gold/50 transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Climate pledge */}
        <div className="mt-8 p-4 rounded-xl border border-gold/25 bg-gold/5 text-center">
          <p className="text-xs text-cream/80">
            <span className="text-gold-light font-semibold">Climate-positive operations.</span>{" "}
            Every ceremony is planned to be carbon-neutral, with verified offsets supporting African
            ecosystem restoration.
          </p>
        </div>
      </div>
    </footer>
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
