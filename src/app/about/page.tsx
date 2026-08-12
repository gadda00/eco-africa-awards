import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Heart, Recycle, Users2, Globe2, Target, Eye, Sparkles, Handshake } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Africa Climate Leadership Awards are the continental celebration of the leaders, innovators, and communities shaping Africa's response to the climate crisis — an initiative of the Africa Climate Leadership Academy.",
  alternates: { canonical: "https://ecoawardsafrica.com/about" },
};

const pillars = [
  {
    icon: Heart,
    title: "African-Led, Always",
    description:
      "Founded by the Africa Climate Leadership Academy, the awards are designed, judged, and celebrated by Africans — for Africans. Every category, criterion, and ceremony is rooted in the continent's realities, knowledge systems, and ambitions. We are present in all 54 African countries and our judging panel reflects the geographic, linguistic, and disciplinary diversity of the continent itself.",
  },
  {
    icon: Recycle,
    title: "Impact Over Performance",
    description:
      "We measure what changed — ecosystems restored, communities resilient, policies enacted, capital mobilised — not what was promised. Every nomination is scored on verifiable outcomes and the durability of its leadership. We reject greenwashing, performative commitments, and the gap between rhetoric and reality that too often characterises climate discourse.",
  },
  {
    icon: Users2,
    title: "Equity at the Centre",
    description:
      "Six of our twelve categories explicitly centre women, youth, indigenous knowledge, and grassroots communities. Equity isn't a scoring afterthought — it's one of the six criteria every judge applies to every nomination. We believe a just transition cannot be built without the leadership of those most affected by the climate crisis.",
  },
  {
    icon: Globe2,
    title: "Continental by Design",
    description:
      "From Cairo to Cape Town, Dakar to Dar es Salaam — we honour leadership in all 54 African countries. Our judging panel of 32 experts spans the continent, and our nominee pool reflects the linguistic, cultural, and ecological diversity of Africa itself. The Awards are not a national programme scaled up — they were continental from inception.",
  },
];

const timeline = [
  { year: "2022", event: "Inaugural awards ceremony held in Nairobi, Kenya.", highlight: "First Climate Leader of the Year awarded" },
  { year: "2023", event: "Expanded to 8 categories. Honoured 12 winners across 7 countries.", highlight: "Indigenous Knowledge category introduced" },
  { year: "2024", event: "Grew to 12 categories. Judging panel expanded to 24. Ceremony hosted in Kigali.", highlight: "First Pan-African ceremony" },
  { year: "2025", event: "1,240+ nominations across 54 countries. Hall of Fame now includes 36 winners.", highlight: "1,240+ nominations received" },
  { year: "2026", event: "Fourth edition opens. 32-judge panel. Ceremony returns to Kigali, September 14–17.", highlight: "12 categories, 32 judges" },
];

export default function AboutPage() {
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
              <Sparkles className="h-3.5 w-3.5" />
              About the Awards
            </div>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-bold text-forest leading-tight">
              The continental stage for{" "}
              <span className="text-gradient-sunset">African climate leadership.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-3xl">
              The Africa Climate Leadership Awards are the annual celebration of the Africa Climate
              Leadership Academy — recognising the leaders, innovations, and communities shaping the
              continent&apos;s response to the climate crisis across 54 countries and 12 categories.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-forest/15 bg-card p-8 shadow-warm">
                <div className="h-12 w-12 rounded-2xl bg-forest/10 ring-1 ring-forest/30 grid place-items-center mb-4">
                  <Target className="h-6 w-6 text-forest" />
                </div>
                <h2 className="font-display text-2xl font-bold text-forest mb-3">Our Mission</h2>
                <p className="text-foreground/80 leading-relaxed">
                  To equip and inspire a new generation of African climate leaders through capacity building,
                  education, research, and mentorship — while fostering innovative, inclusive, and
                  community-driven climate solutions. The Awards are ACLA&apos;s annual celebration of the
                  leaders, innovators, and communities turning that mission into measurable impact.
                </p>
              </div>
              <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-8 shadow-warm">
                <div className="h-12 w-12 rounded-2xl bg-gold/15 ring-1 ring-gold/40 grid place-items-center mb-4">
                  <Eye className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-display text-2xl font-bold text-forest mb-3">Our Vision</h2>
                <p className="text-foreground/80 leading-relaxed">
                  To build a climate-resilient Africa powered by informed, skilled, and empowered climate
                  leaders who drive transformative action for sustainable development, environmental justice,
                  and a thriving planet for present and future generations. Every award we give is one step
                  closer to that vision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-16 lg:py-24 bg-savanna-gradient">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-forest/30 bg-forest/10 text-forest">
                What we stand for
              </div>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
                Four principles, applied to every award.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-3xl border border-forest/15 bg-card p-7 lg:p-8 shadow-warm"
                >
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-forest/15 to-gold/10 ring-1 ring-forest/20 grid place-items-center mb-5">
                    <p.icon className="h-7 w-7 text-forest" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-forest mb-3">{p.title}</h3>
                  <p className="text-foreground/75 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
                Our history
              </div>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
                Four editions, one trajectory.
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-forest/40 via-gold/40 to-terracotta/40 lg:-translate-x-1/2" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div
                    key={item.year}
                    className={`relative pl-12 lg:pl-0 ${i % 2 === 0 ? "lg:pr-[52%] lg:text-right" : "lg:pl-[52%]"}`}
                  >
                    <div
                      className={`absolute top-2 left-2.5 lg:left-auto ${i % 2 === 0 ? "lg:right-0 lg:translate-x-1/2" : "lg:left-0 lg:-translate-x-1/2"}`}
                    >
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-forest to-gold grid place-items-center text-cream font-display font-bold text-sm">
                        {item.year.slice(2)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-forest/15 bg-card p-5 shadow-warm">
                      <div className="font-display text-xl font-bold text-forest">{item.year}</div>
                      <p className="text-sm text-foreground/75 mt-1">{item.event}</p>
                      <div className="mt-2 text-xs text-gold font-semibold">{item.highlight}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ACLA relationship */}
        <section className="py-16 lg:py-24 bg-forest text-cream">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-gold to-terracotta shadow-gold mb-6">
              <Handshake className="h-7 w-7 text-cream" />
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              An initiative of the Africa Climate Leadership Academy
            </h2>
            <p className="mt-5 text-cream/80 text-lg leading-relaxed">
              ACLA builds the next generation of African climate leaders through world-class training,
              cutting-edge research, and a powerful network spanning the entire continent. With 2,400+ alumni
              across 54 countries, ACLA is the institutional home of the Awards.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-gold-light">2,400+</div>
                <div className="text-xs text-cream/70 mt-1">Alumni</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-gold-light">54</div>
                <div className="text-xs text-cream/70 mt-1">Countries</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-gold-light">6</div>
                <div className="text-xs text-cream/70 mt-1">Flagship programmes</div>
              </div>
            </div>
            <Button asChild className="mt-8 bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-semibold">
              <a href={siteConfig.parentOrgUrl} target="_blank" rel="noreferrer">
                Visit ACLA
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest">
              Ready to be part of the story?
            </h2>
            <p className="mt-4 text-foreground/70 text-lg">
              Nominate a leader, register for the ceremony, or join the judging panel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-forest hover:bg-forest-light text-cream font-semibold h-13 px-7">
                <Link href="/#nominate">
                  Nominate a leader
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-forest/30 text-forest h-13 px-7">
                <Link href="/#ceremony">Attend the ceremony</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
