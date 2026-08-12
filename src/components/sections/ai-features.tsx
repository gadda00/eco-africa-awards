"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Scale,
  Calculator,
  Library,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import * as Icons from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { aiFeatures, awardCategories } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const accentMap: Record<string, { ring: string; text: string; bg: string }> = {
  emerald: { ring: "ring-forest/30", text: "text-forest", bg: "bg-forest/10" },
  amber: { ring: "ring-gold/30", text: "text-gold", bg: "bg-gold/10" },
  terracotta: { ring: "ring-terracotta/30", text: "text-terracotta", bg: "bg-terracotta/10" },
  "deep-teal": { ring: "ring-sky/30", text: "text-sky", bg: "bg-sky/8" },
};

type MatchResult = {
  categoryId: string;
  score: number;
  rationale: string;
}[];

export function AiFeaturesSection() {
  const [matcherInput, setMatcherInput] = useState("");
  const [matcherLoading, setMatcherLoading] = useState(false);
  const [matcherResults, setMatcherResults] = useState<MatchResult | null>(null);

  const runMatcher = async () => {
    if (matcherInput.trim().length < 20) {
      toast.error("Please describe the nominee in at least a sentence.");
      return;
    }
    setMatcherLoading(true);
    setMatcherResults(null);
    try {
      const res = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: matcherInput }),
      });
      if (!res.ok) throw new Error("Match failed");
      const data = await res.json();
      setMatcherResults(data.matches);
      toast.success("Category matches generated");
    } catch {
      toast.error("AI matchmaker temporarily unavailable — try again later.");
    } finally {
      setMatcherLoading(false);
    }
  };

  return (
    <section
      id="ai-features"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-card/40 to-background"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-forest/40 to-transparent" />
      <div className="absolute top-1/4 right-0 h-72 w-72 rounded-full bg-forest/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI-Powered Awards"
          title={
            <>
              The first awards platform{" "}
              <span className="text-gradient-sunset">built with AI at its core.</span>
            </>
          }
          description="From nomination to judging, our AI tools make the awards more rigorous, more accessible, and more transparent — without ever replacing human judgement. Try the live Category Matchmaker below."
        />

        {/* Features grid */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiFeatures.map((feat, i) => {
            const Icon = (Icons as any)[feat.icon] ?? Icons.Sparkles;
            const accent = accentMap[feat.accent];
            return (
              <Reveal key={feat.title} delay={(i % 3) * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6"
                >
                  <div className={`absolute -top-12 -right-12 h-24 w-24 rounded-full ${accent.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative">
                    <div className={`h-12 w-12 rounded-xl ${accent.bg} ${accent.ring} ring-1 grid place-items-center`}>
                      <Icon className={`h-6 w-6 ${accent.text}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* Live AI Category Matchmaker */}
        <Reveal delay={0.1}>
          <div className="mt-12 lg:mt-16 relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card/60 to-gold/10 p-7 lg:p-10">
            <div className="absolute inset-0 bg-dots opacity-30" />
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-forest/20 blur-3xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/30 bg-gold/10 text-gold-light">
                  <Compass className="h-3.5 w-3.5" />
                  Live Demo
                </div>
                <h3 className="mt-5 font-display text-2xl lg:text-3xl font-bold text-foreground">
                  AI Category Matchmaker
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Describe your nominee&apos;s climate work in plain English. Our AI will rank the
                  twelve categories by fit, with confidence scores and brief rationales — so you
                  submit to the category that gives your nominee the strongest case.
                </p>
                <div className="mt-5 space-y-3">
                  <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold">
                    Describe the nominee&apos;s work
                  </Label>
                  <Textarea
                    value={matcherInput}
                    onChange={(e) => setMatcherInput(e.target.value)}
                    rows={4}
                    placeholder="e.g., A 28-year-old Kenyan founder of a solar-powered cold-chain platform that has served 12,000 smallholder farmers, cutting post-harvest losses by 35% and avoiding 4,200 tonnes of food waste."
                    className="bg-background/60 backdrop-blur-sm"
                  />
                  <Button
                    onClick={runMatcher}
                    disabled={matcherLoading}
                    className="bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-semibold"
                  >
                    {matcherLoading ? (
                      <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Matching…</>
                    ) : (
                      <><Sparkles className="mr-1.5 h-4 w-4" />Find best category</>
                    )}
                  </Button>
                </div>
              </div>

              <div className="lg:pl-8 lg:border-l lg:border-border/40">
                <div className="text-xs uppercase tracking-wider text-forest font-semibold mb-3">
                  Recommended Categories
                </div>
                <div className="space-y-3 min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {matcherResults ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        {matcherResults.slice(0, 4).map((m, i) => {
                          const cat = awardCategories.find((c) => c.id === m.categoryId);
                          return (
                            <motion.div
                              key={m.categoryId}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={cn(
                                "rounded-xl border p-4",
                                i === 0
                                  ? "border-forest/40 bg-forest/10"
                                  : "border-border/60 bg-background/40"
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {i === 0 && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-forest/30 text-forest-light">
                                      Best fit
                                    </span>
                                  )}
                                  <span className="text-sm font-semibold text-foreground">
                                    {cat?.name}
                                  </span>
                                </div>
                                <span className="text-xs text-gold-light tabular-nums">
                                  {m.score}%
                                </span>
                              </div>
                              <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-forest to-gold"
                                  style={{ width: `${m.score}%` }}
                                />
                              </div>
                              <p className="mt-2 text-xs text-muted-foreground leading-snug">
                                {m.rationale}
                              </p>
                            </motion.div>
                          );
                        })}
                        <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                          <a href="#nominate">
                            Nominate in this category
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </motion.div>
                    ) : matcherLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                      >
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                            <div className="mt-2 h-1 w-full bg-muted rounded animate-pulse" />
                            <div className="mt-2 h-3 w-3/4 bg-muted rounded animate-pulse" />
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid place-items-center h-full text-center text-sm text-muted-foreground py-12"
                      >
                        <div>
                          <Compass className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                          <p>Run the matchmaker to see results here.</p>
                          <p className="text-xs mt-1">It takes about 5 seconds.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-5 pt-4 border-t border-border/40 text-xs text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-forest flex-shrink-0 mt-0.5" />
                  <span>
                    AI suggestions are advisory. Final category choice rests with the nominator,
                    and all nominations are reviewed by human judges.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
