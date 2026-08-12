"use client";

import { motion } from "framer-motion";
import { Globe2, Heart, Recycle, Users2 } from "lucide-react";
import { SectionHeading, Reveal, AnimatedCounter } from "@/components/section-primitives";
import { impactStats } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

const pillars = [
  {
    icon: Heart,
    title: "African-Led, Always",
    description:
      "Founded by the Africa Climate Leadership Academy, the awards are designed, judged, and celebrated by Africans — for Africans. Every category, criterion, and ceremony is rooted in the continent's realities, knowledge systems, and ambitions.",
    accent: "from-emerald-500/20 to-emerald-700/5",
  },
  {
    icon: Recycle,
    title: "Impact Over Performance",
    description:
      "We measure what changed — ecosystems restored, communities resilient, policies enacted, capital mobilised — not what was promised. Every nomination is scored on verifiable outcomes and the durability of its leadership.",
    accent: "from-amber-500/20 to-amber-700/5",
  },
  {
    icon: Users2,
    title: "Equity at the Centre",
    description:
      "Six of our twelve categories explicitly centre women, youth, indigenous knowledge, and grassroots communities. Equity isn't a scoring afterthought — it's one of the six criteria every judge applies to every nomination.",
    accent: "from-terracotta/20 to-terracotta/5",
  },
  {
    icon: Globe2,
    title: "Continental by Design",
    description:
      "From Cairo to Cape Town, Dakar to Dar es Salaam — we honour leadership in all 54 African countries. Our judging panel reflects the geographic, linguistic, and disciplinary diversity of the continent itself.",
    accent: "from-emerald-500/20 to-deep-teal/5",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid opacity-[0.07] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About the Awards"
          title={
            <>
              The continental stage for{" "}
              <span className="text-gradient-emerald">African climate leadership.</span>
            </>
          }
          description="The Eco Africa Awards are the annual celebration of the Africa Climate Leadership Academy — recognising the leaders, innovations, and communities shaping the continent's response to the climate crisis across 54 countries and 12 categories."
        />

        {/* Pillars grid */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className={`group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${p.accent} p-7 lg:p-8`}
              >
                <div className="absolute inset-0 bg-card/40 backdrop-blur-sm" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-500/10 border border-emerald-500/30 grid place-items-center">
                    <p.icon className="h-6 w-6 text-emerald-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  boxShadow: "inset 0 0 0 1px oklch(0.72 0.19 158 / 0.4), 0 0 60px -10px oklch(0.72 0.19 158 / 0.3)"
                }} />
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Impact stats */}
        <Reveal delay={0.1}>
          <div className="mt-16 lg:mt-20 relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative grid grid-cols-2 lg:grid-cols-3 divide-x divide-y lg:divide-y-0 divide-border/40">
              {impactStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`p-6 lg:p-8 ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 2 ? "border-b lg:border-b-0" : ""} ${i >= 3 ? "border-t lg:border-t-0" : ""}`}
                >
                  <div className="font-display text-4xl lg:text-5xl font-bold text-gradient-emerald tabular-nums">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground font-medium leading-snug">
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
