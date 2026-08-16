"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";

const stats = [
  { label: "Nominees (2025)", value: 1240, suffix: "+" },
  { label: "African Countries", value: 54, suffix: "" },
  { label: "Award Categories", value: 12, suffix: "" },
  { label: "Continental Judges", value: 32, suffix: "" },
  { label: "Cash Grants (2022–25)", value: 280, suffix: "K USD" },
  { label: "Alumni Network", value: 2400, suffix: "+" },
];

export function HomeStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-forest text-cream overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 25% 25%, oklch(0.86 0.13 75) 1px, transparent 1px), radial-gradient(circle at 75% 75%, oklch(0.86 0.13 75) 1px, transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 h-72 w-72 rounded-full bg-terracotta/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-gold/40 bg-gold/10 text-gold-light"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            By the Numbers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 font-display text-4xl lg:text-5xl font-bold"
          >
            Four editions. One continental movement.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-cream/70 max-w-2xl mx-auto"
          >
            Measurable, durable, African-led climate leadership — recognised across the continent since 2022.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-cream/10 rounded-3xl overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="bg-forest p-8 lg:p-10 text-center hover:bg-forest-light/20 transition-colors"
            >
              <div className="font-display text-5xl lg:text-6xl font-bold text-gradient-gold tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-sm text-cream/70 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
