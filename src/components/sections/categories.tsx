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
import { cn } from "@/lib/utils";

const accentClasses: Record<string, { ring: string; text: string; bg: string; gradient: string; chip: string }> = {
  forest: {
    ring: "ring-forest/30",
    text: "text-forest",
    bg: "bg-forest/10",
    gradient: "from-forest/12 via-forest-light/5 to-transparent",
    chip: "bg-forest/10 text-forest ring-forest/25",
  },
  emerald: {
    ring: "ring-forest/30",
    text: "text-forest",
    bg: "bg-forest/10",
    gradient: "from-forest/12 via-forest-light/5 to-transparent",
    chip: "bg-forest/10 text-forest ring-forest/25",
  },
  gold: {
    ring: "ring-gold/40",
    text: "text-gold",
    bg: "bg-gold/15",
    gradient: "from-gold/15 via-gold/5 to-transparent",
    chip: "bg-gold/15 text-gold ring-gold/30",
  },
  amber: {
    ring: "ring-gold/40",
    text: "text-gold",
    bg: "bg-gold/15",
    gradient: "from-gold/15 via-gold/5 to-transparent",
    chip: "bg-gold/15 text-gold ring-gold/30",
  },
  terracotta: {
    ring: "ring-terracotta/40",
    text: "text-terracotta",
    bg: "bg-terracotta/10",
    gradient: "from-terracotta/15 via-terracotta/5 to-transparent",
    chip: "bg-terracotta/10 text-terracotta ring-terracotta/30",
  },
  savanna: {
    ring: "ring-savanna/60",
    text: "text-terracotta",
    bg: "bg-savanna/25",
    gradient: "from-savanna/25 via-savanna/8 to-transparent",
    chip: "bg-savanna/30 text-terracotta ring-savanna/50",
  },
  "deep-teal": {
    ring: "ring-sky/30",
    text: "text-sky",
    bg: "bg-sky/10",
    gradient: "from-sky/12 via-sky/5 to-transparent",
    chip: "bg-sky/10 text-sky ring-sky/25",
  },
};

function TiltCard({ category, index }: { category: typeof awardCategories[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

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
        className={cn(
          "group relative h-full preserve-3d rounded-3xl border border-forest/15 bg-gradient-to-br p-7 lg:p-8 cursor-pointer overflow-hidden shadow-warm",
          accent.gradient
        )}
      >
        {/* Decorative blob */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Popular badge */}
        {category.popular && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-gold/20 text-gold border border-gold/40">
            <Sparkles className="h-3 w-3" />
            Popular
          </div>
        )}

        <div className="relative">
          {/* Icon */}
          <div className={cn("h-16 w-16 rounded-2xl grid place-items-center ring-1", accent.bg, accent.ring)}>
            <Icon className={cn("h-8 w-8", accent.text)} strokeWidth={1.5} />
          </div>

          {/* Level chip */}
          <div className={cn("mt-5 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ring-1", accent.chip)}>
            {category.level}
          </div>

          {/* Title */}
          <h3 className="mt-3 font-display text-2xl lg:text-[1.65rem] font-bold text-forest leading-tight">
            {category.name}
          </h3>

          {/* Tagline */}
          <p className={cn("mt-2 text-sm font-medium italic", accent.text)}>
            {category.tagline}
          </p>

          {/* Description */}
          <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-3">
            {category.description}
          </p>

          {/* CTA */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-gold transition-colors">
                View criteria
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-background border-forest/20 max-h-[85vh] overflow-y-auto scrollbar-warm">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("h-14 w-14 rounded-2xl grid place-items-center ring-1", accent.bg, accent.ring)}>
                    <Icon className={cn("h-7 w-7", accent.text)} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ring-1", accent.chip)}>
                      {category.level}
                    </div>
                    <DialogTitle className="font-display text-2xl font-bold mt-1 text-forest">
                      {category.name}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base text-foreground/70 leading-relaxed pt-2">
                  {category.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 pt-3">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-forest mb-2">
                    Who Should Enter
                  </h4>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {category.whoShouldEnter}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-forest mb-2">
                    Judging Criteria
                  </h4>
                  <ul className="space-y-2">
                    {category.criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                        <Check className={cn("h-4 w-4 mt-0.5 flex-shrink-0", accent.text)} />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-gold mb-2">
                    What the Winner Receives
                  </h4>
                  <p className="text-sm text-foreground/85 leading-relaxed">{category.prize}</p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Button asChild className="bg-forest hover:bg-forest-light text-cream font-semibold">
                    <a href="#nominate" onClick={() => setOpen(false)}>
                      Nominate in this category
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-forest/30 text-forest">
                    <a href="#selection">See judging process</a>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function CategoriesSection() {
  return (
    <section
      id="categories"
      className="relative py-24 lg:py-32 bg-savanna-gradient"
    >
      {/* Background accents */}
      <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-forest/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="12 Award Categories"
          title={
            <>
              Twelve stages.{" "}
              <span className="text-gradient-sunset">One continent rising.</span>
            </>
          }
          description="From grassroots resilience to continental policy, from youth mobilisation to lifetime achievement — explore the twelve categories that together recognise the full spectrum of African climate leadership."
        />

        {/* Cards grid */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 perspective-1000">
          {awardCategories.map((cat, i) => (
            <TiltCard key={cat.id} category={cat} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal delay={0.1}>
          <div className="mt-16 text-center">
            <p className="text-foreground/70 mb-4 text-base">
              Not sure which category fits your nominee?
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-forest/30 bg-white/60 backdrop-blur-md text-forest hover:bg-white font-medium h-12 px-6 shadow-warm"
            >
              <a href="#ai-features">
                <Sparkles className="mr-1.5 h-4 w-4 text-gold" />
                Try our AI Category Matchmaker
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
