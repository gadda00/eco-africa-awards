"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, MapPin, Quote, ArrowRight } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { Button } from "@/components/ui/button";
import { pastWinners, awardCategories } from "@/lib/data";

export function WinnersSection() {
  const years = useMemo(() => {
    const ys = Array.from(new Set(pastWinners.map((w) => w.year))).sort((a, b) => b - a);
    return ys;
  }, []);

  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    if (yearFilter === "all") return pastWinners;
    return pastWinners.filter((w) => w.year === yearFilter);
  }, [yearFilter]);

  const findCategory = (id: string) => awardCategories.find((c) => c.id === id);

  return (
    <section id="winners" className="relative py-24 lg:py-32 bg-background">
      <div className="absolute inset-0 bg-grid opacity-[0.05]" />
      <div className="absolute top-1/4 left-0 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hall of Fame"
          title={
            <>
              The leaders who&apos;ve{" "}
              <span className="text-gradient-emerald">already shaped the continent.</span>
            </>
          }
          description="Four editions of the Eco Africa Awards have honoured climate leaders whose work has redefined what's possible on the African continent. Meet a selection of past winners."
        />

        {/* Year filter */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setYearFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                yearFilter === "all"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-background"
                  : "border border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              All Years
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  yearFilter === y
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-background"
                    : "border border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Winners grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((w, i) => {
            const cat = findCategory(w.categoryId);
            return (
              <Reveal key={`${w.year}-${w.categoryId}`} delay={(i % 3) * 0.06}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm"
                >
                  {/* Top strip */}
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-emerald-500/15 via-amber-500/10 to-emerald-500/5">
                    <div className="absolute inset-0 bg-grid opacity-[0.1]" />
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
                      <div className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {w.year} Winner
                      </div>
                      <Trophy className="h-6 w-6 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">
                        {cat?.name}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground leading-tight">
                      {w.winnerName}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{w.winnerTitle}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                      <MapPin className="h-3 w-3" />
                      <span>{w.country}</span>
                      <span className="text-muted-foreground">· {w.winnerOrg}</span>
                    </div>

                    <div className="mt-4 relative pl-4">
                      <Quote className="absolute top-0 left-0 h-3 w-3 text-amber-400/60" />
                      <p className="text-sm text-foreground/85 leading-relaxed italic">
                        {w.highlight}
                      </p>
                    </div>
                  </div>

                  {/* hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: "inset 0 0 0 1px oklch(0.72 0.19 158 / 0.4)" }}
                  />
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 text-center">
            <p className="text-muted-foreground mb-4">
              Want to see your nominee join this list?
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-background font-semibold"
            >
              <a href="#nominate">
                Submit a nomination
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
