"use client";

import { motion } from "framer-motion";
import { Globe2, Heart, Recycle, Users2 } from "lucide-react";
import { SectionHeading, Reveal, AnimatedCounter } from "@/components/section-primitives";
import { impactStats } from "@/lib/data";

const pillars = [
  {
    icon: Heart,
    title: "African-Led, Always",
    description:
      "Founded by the Africa Climate Leadership Academy, the awards are designed, judged, and celebrated by Africans — for Africans. Every category, criterion, and ceremony is rooted in the continent's realities, knowledge systems, and ambitions.",
    accent: "forest",
  },
  {
    icon: Recycle,
    title: "Impact Over Performance",
    description:
      "We measure what changed — ecosystems restored, communities resilient, policies enacted, capital mobilised — not what was promised. Every nomination is scored on verifiable outcomes and the durability of its leadership.",
    accent: "gold",
  },
  {
    icon: Users2,
    title: "Equity at the Centre",
    description:
      "Six of our twelve categories explicitly centre women, youth, indigenous knowledge, and grassroots communities. Equity isn't a scoring afterthought — it's one of the six criteria every judge applies to every nomination.",
    accent: "terracotta",
  },
  {
    icon: Globe2,
    title: "Continental by Design",
    description:
      "From Cairo to Cape Town, Dakar to Dar es Salaam — we honour leadership in all 54 African countries. Our judging panel reflects the geographic, linguistic, and disciplinary diversity of the continent itself.",
    accent: "savanna",
  },
];

const accentClasses: Record<string, { bg: string; ring: string; text: string; gradient: string }> = {
  forest: {
    bg: "bg-forest/10",
    ring: "ring-forest/30",
    text: "text-forest",
    gradient: "from-forest/12 via-forest-light/5 to-transparent",
  },
  gold: {
    bg: "bg-gold/15",
    ring: "ring-gold/40",
    text: "text-gold",
    gradient: "from-gold/15 via-gold/5 to-transparent",
  },
  terracotta: {
    bg: "bg-terracotta/10",
    ring: "ring-terracotta/40",
    text: "text-terracotta",
    gradient: "from-terracotta/15 via-terracotta/5 to-transparent",
  },
  savanna: {
    bg: "bg-savanna/20",
    ring: "ring-savanna/50",
    text: "text-terracotta",
    gradient: "from-savanna/25 via-savanna/8 to-transparent",
  },
};

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-background">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-forest/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About the Awards"
          title={
            <>
              The continental stage for{" "}
              <span className="text-gradient-sunset">African climate leadership.</span>
            </>
          }
          description="The Africa Climate Leadership Awards are the annual celebration of the Africa Climate Leadership Academy — recognising the leaders, innovations, and communities shaping the continent's response to the climate crisis across 54 countries and 12 categories."
        />

        {/* Pillars grid */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p, i) => {
            const accent = accentClasses[p.accent];
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={`group relative h-full overflow-hidden rounded-3xl border border-forest/15 bg-gradient-to-br ${accent.gradient} p-8 lg:p-10 shadow-warm`}
                >
                  <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/40 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className={`h-14 w-14 rounded-2xl ${accent.bg} ${accent.ring} ring-1 grid place-items-center`}>
                      <p.icon className={`h-7 w-7 ${accent.text}`} strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-6 font-display text-2xl lg:text-3xl font-bold text-forest">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-base text-foreground/70 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Impact stats */}
        <Reveal delay={0.1}>
          <div className="mt-16 lg:mt-20 relative overflow-hidden rounded-3xl border border-forest/15 bg-white shadow-warm-lg">
            <div className="absolute inset-0 bg-dots opacity-20" />
            <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-forest/10 blur-3xl" />

            <div className="relative grid grid-cols-2 lg:grid-cols-3 divide-x divide-y lg:divide-y-0 divide-forest/10">
              {impactStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`p-7 lg:p-10 ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 2 ? "border-b lg:border-b-0" : ""} ${i >= 3 ? "border-t lg:border-t-0" : ""}`}
                >
                  <div className="font-display text-5xl lg:text-6xl font-bold text-gradient-sunset tabular-nums">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-3 text-sm text-foreground/70 font-medium leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
