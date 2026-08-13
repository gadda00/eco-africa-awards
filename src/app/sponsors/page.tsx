import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { sponsors } from "@/lib/data";
import { ArrowRight, Handshake, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners & Sponsors",
  description:
    "The institutions standing behind the Africa Climate Leadership Awards. Partner with us to celebrate African climate leadership at scale.",
  alternates: { canonical: "https://ecoawardsafrica.com/sponsors" },
};

const tierOrder = ["Platinum", "Gold", "Silver", "Partner", "Media"] as const;

const tierStyles: Record<string, string> = {
  Platinum: "border-gold/40 bg-gradient-to-br from-gold/12 to-transparent",
  Gold: "border-forest/30 bg-gradient-to-br from-forest/10 to-transparent",
  Silver: "border-border bg-card",
  Partner: "border-border bg-card",
  Media: "border-sky/30 bg-gradient-to-br from-sky/8 to-transparent",
};

const tierDescriptions: Record<string, string> = {
  Platinum: "Founding partners of the Africa Climate Leadership Awards.",
  Gold: "Cornerstone supporters of the continental celebration.",
  Silver: "Sustaining partners making the awards possible.",
  Partner: "Academic, institutional, and continental body partners.",
  Media: "Media partners extending the awards' continental reach.",
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-sunrise-gradient">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
              <Handshake className="h-3.5 w-3.5" />
              Partners & Sponsors
            </div>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-bold text-forest leading-tight">
              The institutions standing{" "}
              <span className="text-gradient-sunset">behind the awards.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-3xl">
              The Africa Climate Leadership Awards are made possible by partners who share ACLA&apos;s
              conviction that African climate leadership deserves a continental stage. We&apos;re grateful
              for their support.
            </p>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            {tierOrder.map((tier) => {
              const tierSponsors = sponsors.filter((s) => s.tier === tier);
              if (tierSponsors.length === 0) return null;
              return (
                <div key={tier}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="text-xs uppercase tracking-[0.3em] font-semibold text-forest">
                      {tier} Partners
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                  <p className="text-center text-sm text-foreground/70 mb-6">{tierDescriptions[tier]}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tierSponsors.map((s) => (
                      <div
                        key={s.id}
                        className={`rounded-2xl border p-6 shadow-warm flex flex-col items-center justify-center text-center min-h-[140px] ${tierStyles[tier]}`}
                      >
                        <div className="font-display text-base lg:text-lg font-bold text-forest leading-tight">
                          {s.name}
                        </div>
                        <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {s.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Become a partner */}
        <section className="py-16 lg:py-24 bg-forest text-cream">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-gold to-terracotta shadow-gold mb-6">
              <Sparkles className="h-7 w-7 text-cream" />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              Become a partner of the 2026 edition.
            </h2>
            <p className="mt-5 text-cream/80 text-lg leading-relaxed">
              Partner with the Africa Climate Leadership Awards to celebrate African climate leadership,
              connect with the continent&apos;s climate community, and shape the future of the programme.
              We partner with mission-aligned institutions across finance, academia, media, and the public sector.
            </p>
            <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-semibold h-13 px-8">
              <a href="/#contact">
                Request a partnership pack
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
