import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { judges } from "@/lib/data";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Judging Panel",
  description:
    "32 climate leaders from across the African continent form the judging panel of the Africa Climate Leadership Awards. Scientists, policymakers, financiers, movement-builders, and conservationists.",
  alternates: { canonical: "https://ecoawardsafrica.com/judges" },
};

export default function JudgesPage() {
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
              <Users className="h-3.5 w-3.5" />
              The Judging Panel
            </div>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-bold text-forest leading-tight">
              The leaders who{" "}
              <span className="text-gradient-sunset">choose the leaders.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-3xl">
              32 judges from across the continent — scientists, policymakers, financiers, movement-builders,
              and conservationists. Every nomination is independently reviewed by at least three judges across
              our six weighted criteria.
            </p>
          </div>
        </section>

        {/* Judges grid */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {judges.map((j) => (
                <div
                  key={j.id}
                  className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-forest to-gold grid place-items-center text-cream font-bold flex-shrink-0">
                      {j.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-lg font-bold text-forest">{j.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{j.country}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-foreground/80">{j.title}</div>
                    <div className="text-xs font-semibold text-forest mt-1">{j.organization}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {j.expertise.map((e) => (
                      <span
                        key={e}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-forest/10 text-forest"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process CTA */}
        <section className="py-16 lg:py-24 bg-savanna-gradient">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="h-10 w-10 mx-auto text-gold mb-4" />
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest">
              Six stages. Six criteria. Zero shortcuts.
            </h2>
            <p className="mt-5 text-lg text-foreground/75 leading-relaxed">
              Every nomination travels the same rigorous path — from eligibility screening to AI-assisted
              review to multi-judge scoring and confidential verification.
            </p>
            <Button asChild size="lg" className="mt-8 bg-forest hover:bg-forest-light text-cream font-semibold h-13 px-7">
              <a href="/#selection">
                See the selection process
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
