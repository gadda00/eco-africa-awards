import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy, Plane, Hotel, Sparkles, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ceremony",
  description:
    "The 2026 Africa Climate Leadership Awards Ceremony — September 14–17 at the Kigali Convention Centre, Rwanda. Four days, one continental stage, 850 climate leaders.",
  alternates: { canonical: "https://ecoawardsafrica.com/ceremony" },
};

const schedule = [
  { day: "Day 1 · Sep 14", title: "Arrival & Welcome Reception", time: "Evening", description: "Registration, welcome kits, and an informal reception for attendees travelling from across the continent." },
  { day: "Day 2 · Sep 15", title: "Africa Climate Leadership Summit", time: "All day", description: "Keynotes, panel discussions, and the State of African Climate Leadership address. Open to all ceremony registrants." },
  { day: "Day 3 · Sep 16", title: "Awards Ceremony & Gala Dinner", time: "Evening", description: "The continental celebration. 12 category winners announced on stage. Black-tie optional, African heritage encouraged." },
  { day: "Day 4 · Sep 17", title: "Fellowship & Closing", time: "Morning", description: "ACLA Fellowship announcement, the 2027 cycle kick-off, and a closing ceremony attended by heads of state and partners." },
];

const practicalInfo = [
  { icon: Plane, title: "Travel", description: "Kigali International Airport (KGL) is 8 km from the venue. Visa-on-arrival available for most African passport holders; check your status via the Rwanda Directorate General of Immigration." },
  { icon: Hotel, title: "Accommodation", description: "Partner hotels offer discounted rates for ceremony attendees. Booking details shared upon registration confirmation." },
  { icon: Users, title: "Capacity", description: "850 attendees across 54 countries. Tickets are limited and allocated on a first-come basis." },
  { icon: Trophy, title: "Dress code", description: "African heritage strongly encouraged. The gala dinner is black-tie optional. Climate-conscious attire is welcomed and celebrated." },
];

export default function CeremonyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-sunrise-gradient">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              The 2026 Ceremony
            </div>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-bold text-forest leading-tight">
              Four days. One continental stage.{" "}
              <span className="text-gradient-sunset">850 climate leaders.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-3xl">
              Join the 2026 Africa Climate Leadership Awards Ceremony at the Kigali Convention Centre — held
              in partnership with the Africa Climate Leadership Summit. The night the continent celebrates its own.
            </p>

            {/* Meta strip */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                <span className="font-medium text-foreground">{siteConfig.ceremony.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold" />
                <span className="font-medium text-foreground">{siteConfig.ceremony.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" />
                <span className="font-medium text-foreground">{siteConfig.ceremony.capacity} attendees</span>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild size="lg" className="bg-forest hover:bg-forest-light text-cream font-semibold h-13 px-7">
                <a href="/#ceremony">
                  Register to attend
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="py-16 lg:py-24 bg-savanna-gradient">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-forest/30 bg-forest/10 text-forest">
              2026 Theme
            </div>
            <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest italic">
              &ldquo;{siteConfig.ceremony.theme}&rdquo;
            </h2>
            <p className="mt-6 text-lg text-foreground/75 leading-relaxed">
              The 2026 edition focuses on locally-led climate action, innovative finance, and the continent&apos;s
              vision for COP31. The ceremony will spotlight solutions that are designed and led by Africans,
              for Africans — and the leaders making them possible.
            </p>
          </div>
        </section>

        {/* Schedule */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
                Schedule
              </div>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
                Four days of continental convening.
              </h2>
            </div>
            <div className="space-y-4">
              {schedule.map((s) => (
                <div key={s.day} className="rounded-2xl border border-forest/15 bg-card p-6 lg:p-8 shadow-warm">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="lg:w-40 flex-shrink-0">
                      <div className="text-xs uppercase tracking-wider font-semibold text-gold">{s.day}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.time}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl lg:text-2xl font-bold text-forest">{s.title}</h3>
                      <p className="mt-2 text-foreground/75 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practical info */}
        <section className="py-16 lg:py-24 bg-savanna-gradient">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-forest/30 bg-forest/10 text-forest">
                Practical information
              </div>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
                Plan your visit.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practicalInfo.map((info) => (
                <div key={info.title} className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-forest/10 ring-1 ring-forest/30 grid place-items-center flex-shrink-0">
                      <info.icon className="h-5 w-5 text-forest" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-forest">{info.title}</h3>
                      <p className="mt-1 text-sm text-foreground/75 leading-relaxed">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-forest text-cream">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              Seats are limited. Early-bird closes March 31.
            </h2>
            <p className="mt-4 text-cream/80 text-lg">
              Join 850 climate leaders in Kigali this September.
            </p>
            <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-semibold h-13 px-8">
              <a href="/#ceremony">
                Register now
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
