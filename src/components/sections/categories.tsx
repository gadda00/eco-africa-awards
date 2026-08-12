"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import * as Icons from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { awardCategories } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const accentClasses: Record<string, { ring: string; text: string; bg: string; gradient: string; glow: string }> = {
  emerald: {
    ring: "ring-emerald-500/30",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500/25 via-emerald-700/5 to-transparent",
    glow: "oklch(0.72 0.19 158)",
  },
  amber: {
    ring: "ring-amber-500/30",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    gradient: "from-amber-500/25 via-amber-700/5 to-transparent",
    glow: "oklch(0.80 0.16 75)",
  },
  terracotta: {
    ring: "ring-orange-500/30",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/25 via-orange-700/5 to-transparent",
    glow: "oklch(0.62 0.18 38)",
  },
  savanna: {
    ring: "ring-yellow-500/30",
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    gradient: "from-yellow-500/25 via-yellow-700/5 to-transparent",
    glow: "oklch(0.78 0.13 68)",
  },
  "deep-teal": {
    ring: "ring-teal-500/30",
    text: "text-teal-400",
    bg: "bg-teal-500/10",
    gradient: "from-teal-500/25 via-teal-700/5 to-transparent",
    glow: "oklch(0.68 0.14 195)",
  },
};

function TiltCard({ category, index }: { category: typeof awardCategories[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const [open, setOpen] = useState(false);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px - 0.5);
    y.set(py - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const accent = accentClasses[category.accent];
  const Icon = (Icons as any)[category.icon] ?? Icons.Award;

  return (
    <Reveal delay={(index % 3) * 0.08}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className={`group relative h-full preserve-3d rounded-2xl border border-border/60 bg-gradient-to-br ${accent.gradient} p-6 lg:p-7 cursor-pointer overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />

        {/* Popular badge */}
        {category.popular && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="h-3 w-3" />
            Popular
          </div>
        )}

        <div className="relative">
          {/* Icon */}
          <div className={`h-14 w-14 rounded-2xl ${accent.bg} ${accent.ring} ring-1 grid place-items-center`}>
            <Icon className={`h-7 w-7 ${accent.text}`} strokeWidth={1.5} />
          </div>

          {/* Level chip */}
          <div className={`mt-4 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}>
            {category.level}
          </div>

          {/* Title */}
          <h3 className="mt-2.5 font-display text-xl lg:text-2xl font-bold text-foreground leading-tight">
            {category.name}
          </h3>

          {/* Tagline */}
          <p className={`mt-1.5 text-sm ${accent.text} font-medium italic`}>
            {category.tagline}
          </p>

          {/* Description */}
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {category.description}
          </p>

          {/* CTA */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-emerald-400 transition-colors">
                View criteria
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border/60 max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl ${accent.bg} ring-1 ${accent.ring} grid place-items-center`}>
                    <Icon className={`h-6 w-6 ${accent.text}`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}>
                      {category.level}
                    </div>
                    <DialogTitle className="font-display text-2xl font-bold mt-1">
                      {category.name}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base text-muted-foreground leading-relaxed pt-2">
                  {category.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 pt-3">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-400 mb-2">
                    Who Should Enter
                  </h4>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {category.whoShouldEnter}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-emerald-400 mb-2">
                    Judging Criteria
                  </h4>
                  <ul className="space-y-2">
                    {category.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                        <Check className={`h-4 w-4 ${accent.text} mt-0.5 flex-shrink-0`} />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-amber-400 mb-2">
                    What the Winner Receives
                  </h4>
                  <p className="text-sm text-foreground/85 leading-relaxed">{category.prize}</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-background font-semibold">
                    <a href="#nominate" onClick={() => setOpen(false)}>
                      Nominate in this category
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="#selection">See judging process</a>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 0 1px ${accent.glow}55, 0 0 60px -10px ${accent.glow}44`,
          }}
        />
      </motion.div>
    </Reveal>
  );
}

export function CategoriesSection() {
  return (
    <section
      id="categories"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-card/30 to-background"
    >
      {/* Background accents */}
      <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="12 Award Categories"
          title={
            <>
              Twelve stages.{" "}
              <span className="text-gradient-emerald">One continent rising.</span>
            </>
          }
          description="From grassroots resilience to continental policy, from youth mobilisation to lifetime achievement — explore the twelve categories that together recognise the full spectrum of African climate leadership."
        />

        {/* Cards grid */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 perspective-1000">
          {awardCategories.map((cat, i) => (
            <TiltCard key={cat.id} category={cat} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal delay={0.1}>
          <div className="mt-14 text-center">
            <p className="text-muted-foreground mb-4">
              Not sure which category fits your nominee?
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/70 bg-card/40 backdrop-blur-md text-foreground hover:bg-foreground/5 font-medium"
            >
              <a href="#ai-features">
                <Sparkles className="mr-1.5 h-4 w-4 text-amber-400" />
                Try our AI Category Matchmaker
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
