"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { timelinePhases, awardCategories } from "@/lib/data";

export function TimelineSection() {
  return (
    <section
      id="timeline"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-card/30 to-background"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="2026 Awards Timeline"
          title={
            <>
              From nominations open to{" "}
              <span className="text-gradient-sunset">the continental stage.</span>
            </>
          }
          description="A transparent, eight-month process — designed to give every nomination the consideration it deserves, and every nominee the dignity of a fair hearing."
        />

        {/* Timeline */}
        <div className="mt-16 lg:mt-20 relative">
          {/* Vertical line — desktop center / mobile left */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px lg:-translate-x-1/2 bg-gradient-to-b from-forest/40 via-border to-gold/40" />

          <div className="space-y-8 lg:space-y-12">
            {timelinePhases.map((phase, i) => {
              const Icon = (Icons as any)[phase.icon] ?? Icons.Calendar;
              const isLeft = i % 2 === 0;
              return (
                <Reveal key={phase.id} delay={i * 0.05}>
                  <div
                    className={`relative pl-12 lg:pl-0 ${
                      isLeft ? "lg:pr-[52%] lg:text-right" : "lg:pl-[52%]"
                    }`}
                  >
                    {/* Node */}
                    <div
                      className={`absolute top-2 ${
                        isLeft
                          ? "left-2.5 lg:left-auto lg:right-0 lg:translate-x-1/2"
                          : "left-2.5 lg:left-0 lg:-translate-x-1/2"
                      }`}
                    >
                      <div
                        className={`relative h-8 w-8 lg:h-10 lg:w-10 rounded-full grid place-items-center ${
                          phase.status === "active"
                            ? "bg-gradient-to-br from-forest to-forest-light shadow-forest"
                            : phase.status === "completed"
                            ? "bg-forest/20 ring-2 ring-forest/40"
                            : "bg-muted/80 ring-1 ring-border"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 lg:h-5 lg:w-5 ${
                            phase.status === "active" ? "text-cream" : "text-muted-foreground"
                          }`}
                        />
                        {phase.status === "active" && (
                          <span className="absolute inset-0 rounded-full ring-2 ring-forest-light animate-ping opacity-60" />
                        )}
                      </div>
                    </div>

                    {/* Card */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`inline-block max-w-xl rounded-2xl border ${
                        phase.status === "active"
                          ? "border-forest/40 bg-forest/10"
                          : "border-border/60 bg-card/50"
                      } backdrop-blur-sm p-5 lg:p-6 ${
                        isLeft ? "lg:ml-auto" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          isLeft ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <span
                          className={`text-[10px] uppercase tracking-[0.22em] font-semibold ${
                            phase.status === "active" ? "text-forest-light" : "text-muted-foreground"
                          }`}
                        >
                          {phase.phase}
                        </span>
                        {phase.status === "active" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-forest/30 text-forest-light border border-forest/40">
                            LIVE NOW
                          </span>
                        )}
                      </div>
                      <h3 className={`mt-2 font-display text-xl font-bold text-foreground ${isLeft ? "lg:text-right" : ""}`}>
                        {phase.title}
                      </h3>
                      <div className={`mt-1 text-sm ${phase.status === "active" ? "text-forest-light" : "text-gold-light/90"} font-medium`}>
                        {phase.date}
                      </div>
                      <p className={`mt-3 text-sm text-muted-foreground leading-relaxed ${isLeft ? "lg:text-right" : ""}`}>
                        {phase.description}
                      </p>
                    </motion.div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
