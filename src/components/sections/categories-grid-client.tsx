"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  level: string;
  tagline: string;
  description: string;
  prize: string;
  popular?: boolean;
  accent: string;
};

const accentClasses: Record<string, { ring: string; text: string; bg: string; gradient: string; chip: string }> = {
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

export function CategoriesGridClient({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 lg:py-24 bg-savanna-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {categories.map((cat, i) => (
            <TiltCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ category, index }: { category: Category; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

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

  const accent = accentClasses[category.accent] ?? accentClasses.gold;
  const Icon = (Icons as any)[category.icon] ?? Icons.Award;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group relative h-full preserve-3d rounded-3xl border-2 border-forest/15 bg-gradient-to-br p-7 lg:p-8 cursor-pointer overflow-hidden shadow-warm hover:shadow-warm-lg transition-shadow"
        // gradient class string applied below via className
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100", accent.gradient)} />
        {/* Decorative blob */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/40 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

        {/* Popular badge */}
        {category.popular && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-gold/20 text-gold border border-gold/40">
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
          <div className={cn("mt-5 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ring-1", accent.chip)}>
            {category.level}
          </div>

          {/* Title */}
          <h3 className="mt-3 font-display text-2xl font-bold text-forest leading-tight">
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
          <Link
            href={`/categories/${category.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-gold transition-colors"
          >
            View category details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
