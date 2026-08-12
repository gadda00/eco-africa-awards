"use client";

import { motion } from "framer-motion";
import { Cpu, FileCheck, Scale, Trophy, Users, Eye } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { Button } from "@/components/ui/button";
import { judges } from "@/lib/data";

const criteria = [
  { name: "Impact", weight: 25, description: "Measurable climate outcomes — ecological, social, economic." },
  { name: "Innovation", weight: 18, description: "Originality of approach and problem framing." },
  { name: "Scale & Replicability", weight: 17, description: "Reach today and the potential to scale across contexts." },
  { name: "Sustainability", weight: 15, description: "Durability beyond the intervention or grant cycle." },
  { name: "Leadership", weight: 15, description: "Mentorship, pipeline-building, and influence beyond the work itself." },
  { name: "Equity & Inclusion", weight: 10, description: "Centre on women, youth, indigenous knowledge, and frontline communities." },
];

const stages = [
  {
    icon: FileCheck,
    title: "Eligibility & Completeness",
    description:
      "Every submission is screened for eligibility, completeness, and category-fit. Incomplete nominations are returned to the nominator with specific guidance.",
  },
  {
    icon: Cpu,
    title: "AI-Assisted Review",
    description:
      "Our AI scoring engine reads every eligible nomination and surfaces strengths, gaps, and internal consistency — flagging anything that needs human attention.",
  },
  {
    icon: Users,
    title: "Multi-Judge Scoring",
    description:
      "Each nomination is independently scored by at least three judges across the six weighted criteria. Scores are aggregated and outliers are discussed.",
  },
  {
    icon: Scale,
    title: "Panel Deliberation",
    description:
      "The shortlist is debated by the full panel. Equity, context, and continental balance are explicitly considered — not just the top aggregated scores.",
  },
  {
    icon: Eye,
    title: "Confidential Verification",
    description:
      "Shortlisted nominees are contacted for verification of claims, references, and consent. Final winners are confirmed by a secretariat vote.",
  },
  {
    icon: Trophy,
    title: "Award & Announcement",
    description:
      "Winners are announced at the continental ceremony and join the ACLA Fellowship and Awards Alumni Council, shaping the future of the programme.",
  },
];

export function SelectionSection() {
  return (
    <section id="selection" className="relative py-24 lg:py-32 bg-background">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-1/3 right-0 h-72 w-72 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Selection Process"
          title={
            <>
              Six stages. Six criteria.{" "}
              <span className="text-gradient-sunset">Zero shortcuts.</span>
            </>
          }
          description="Every nomination travels the same rigorous path — from eligibility screening to AI-assisted review to multi-judge scoring and confidential verification. Transparency and equity are engineered into every step."
        />

        {/* Stages */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stages.map((stage, i) => (
            <Reveal key={stage.title} delay={(i % 3) * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group relative h-full rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 overflow-hidden"
              >
                <div className="absolute top-0 right-0 font-display text-7xl font-bold text-border/30 leading-none translate-x-2 -translate-y-2 group-hover:text-forest/20 transition-colors">
                  {i + 1}
                </div>
                <div className="relative">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-forest/20 to-gold/10 ring-1 ring-forest/30 grid place-items-center">
                    <stage.icon className="h-5 w-5 text-forest" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Scoring criteria */}
        <Reveal delay={0.1}>
          <div className="mt-16 lg:mt-20 relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 to-card/40 p-7 lg:p-10">
            <div className="absolute inset-0 bg-dots opacity-30" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/30 bg-gold/10 text-gold-light">
                  <Scale className="h-3.5 w-3.5" />
                  Scoring Criteria
                </div>
                <h3 className="mt-5 font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Six weighted criteria, applied by every judge to every nomination.
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Scores are aggregated across judges, weighted, and audited for variance. Equity
                  is a stand-alone criterion — never a tiebreaker.
                </p>
              </div>
              <div className="space-y-3">
                {criteria.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-sm font-semibold text-foreground">{c.name}</span>
                      <span className="text-xs text-gold-light tabular-nums">{c.weight}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.weight * 3.5}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-forest via-forest-light to-gold rounded-full"
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Judging panel */}
        <div className="mt-16 lg:mt-24">
          <Reveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-forest/30 bg-forest/10 text-forest-light">
                <Users className="h-3.5 w-3.5" />
                Continental Judging Panel
              </div>
              <h3 className="mt-5 font-display text-3xl lg:text-4xl font-bold text-foreground">
                The leaders who choose the leaders.
              </h3>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                32 judges from across the continent — scientists, policymakers, financiers,
                movement-builders, and conservationists. A partial panel is shown below.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {judges.map((j, i) => (
              <Reveal key={j.id} delay={(i % 4) * 0.06}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="group relative rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-forest/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-forest to-gold grid place-items-center text-cream font-bold text-sm">
                        {j.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground leading-tight">{j.name}</div>
                        <div className="text-xs text-muted-foreground">{j.country}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground leading-snug">
                      {j.title}
                    </div>
                    <div className="mt-1 text-xs font-medium text-forest">{j.organization}</div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {j.expertise.map((e) => (
                        <span
                          key={e}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-muted/60 text-muted-foreground"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="border-border/70 bg-card/40 backdrop-blur-md">
                <a href="#ceremony">Join the 2026 panel</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
