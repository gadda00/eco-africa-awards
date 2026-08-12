"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/section-primitives";
import { siteConfig } from "@/lib/site-config";

/**
 * Africa Climate Leadership Awards — Hero
 * Lightweight, GPU-friendly hero with:
 * - Layered parallax hills (SVG, no canvas)
 * - Animated sunrise / warm gradient sky
 * - Baobab tree silhouette (SVG)
 * - Floating climate iconography
 * - Animated "Africa" callout text
 * - Marquee strip at the bottom
 */
export function HeroSection() {
  const { scrollY } = useScroll();
  const skyY = useTransform(scrollY, [0, 800], [0, 80]);
  const hillsBackY = useTransform(scrollY, [0, 800], [0, 50]);
  const hillsFrontY = useTransform(scrollY, [0, 800], [0, 120]);
  const treeY = useTransform(scrollY, [0, 800], [0, 30]);
  const sunScale = useTransform(scrollY, [0, 600], [1, 1.15]);
  const textY = useTransform(scrollY, [0, 600], [0, 60]);

  return (
    <section id="top" className="relative overflow-hidden bg-sunrise-gradient">
      {/* Top scroll progress bar */}
      <ScrollProgressBar />

      {/* Sun + Sky layer */}
      <motion.div
        style={{ y: skyY }}
        className="absolute inset-x-0 top-0 h-[80vh] pointer-events-none"
      >
        <motion.div
          style={{ scale: sunScale }}
          className="absolute top-[18%] right-[12%] lg:top-[20%] lg:right-[18%]"
        >
          <div className="relative h-64 w-64 lg:h-80 lg:w-80">
            {/* Sun glow */}
            <div className="absolute inset-0 rounded-full blur-3xl opacity-60 bg-gradient-to-br from-gold-light to-terracotta animate-pulse-soft" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gold-light via-gold to-terracotta shadow-gold" />
            {/* Sun rays */}
            <div className="absolute inset-0 animate-spin-slow">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 origin-left h-px"
                  style={{
                    width: "180px",
                    background: "linear-gradient(to right, rgba(245,158,11,0.5), transparent)",
                    transform: `rotate(${i * 30}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating clouds (CSS) */}
      <div className="absolute inset-0 pointer-events-none">
        <Cloud className="absolute top-[28%] left-[8%] animate-float-slow opacity-70" />
        <Cloud className="absolute top-[42%] left-[60%] animate-float-slow opacity-50" style={{ animationDelay: "2s" }} />
        <Cloud className="absolute top-[14%] right-[35%] animate-float-fast opacity-60" />
      </div>

      {/* Floating climate icons */}
      <FloatingIcons />

      {/* Content (top layer) */}
      <motion.div
        style={{ y: textY }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-24 lg:pb-32"
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-forest/30 bg-white/70 backdrop-blur-md text-forest shadow-warm">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {siteConfig.parentOrgShort} · {siteConfig.stats.editions}th Edition · 2026
            </div>
          </Reveal>

          {/* Massive title */}
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight text-forest">
              Africa Climate
              <br />
              <span className="text-gradient-sunset italic">Leadership</span>
              <br />
              Awards.
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={0.18}>
            <p className="mt-8 text-lg sm:text-xl lg:text-2xl text-foreground/75 leading-relaxed max-w-2xl">
              The continental celebration honouring the visionaries, innovators, and communities
              shaping Africa&apos;s climate future — across{" "}
              <span className="text-forest font-semibold">54 countries</span> and{" "}
              <span className="text-forest font-semibold">12 categories</span>.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.28}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <MagneticButton
                asChild
                className="bg-forest hover:bg-forest-light text-cream font-semibold text-base h-14 px-8 shadow-forest group"
              >
                <a href="#nominate">
                  Nominate a Leader
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>
              <MagneticButton
                asChild
                variant="outline"
                className="border-forest/30 bg-white/60 backdrop-blur-md text-forest hover:bg-white font-medium text-base h-14 px-8 shadow-warm"
              >
                <a href="#categories">
                  Explore Categories
                </a>
              </MagneticButton>
            </div>
          </Reveal>

          {/* Ceremony meta strip */}
          <Reveal delay={0.36}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/70">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold" />
                <span className="font-medium">{siteConfig.ceremony.venue}</span>
              </div>
              <div className="hidden sm:block h-3 w-px bg-forest/30" />
              <div className="font-medium text-foreground/85">{siteConfig.ceremony.date}</div>
              <div className="hidden sm:block h-3 w-px bg-forest/30" />
              <div className="text-terracotta font-medium">{siteConfig.ceremony.theme}</div>
            </div>
          </Reveal>
        </div>
      </motion.div>

      {/* Landscape layer (SVG) */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        {/* Back hills */}
        <motion.div style={{ y: hillsBackY }} className="relative">
          <HillsBack />
        </motion.div>
        {/* Baobab tree */}
        <motion.div
          style={{ y: treeY }}
          className="absolute bottom-[12%] lg:bottom-[10%] right-[8%] lg:right-[16%] w-32 lg:w-56 pointer-events-none"
        >
          <BaobabTree />
        </motion.div>
        {/* Front hills */}
        <motion.div style={{ y: hillsFrontY }} className="relative">
          <HillsFront />
        </motion.div>
      </div>

      {/* Marquee strip at very bottom of hero */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <Marquee />
      </div>
    </section>
  );
}

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 50"
      className={className}
      style={style}
      fill="white"
      aria-hidden="true"
    >
      <ellipse cx="35" cy="35" rx="25" ry="14" />
      <ellipse cx="60" cy="28" rx="32" ry="18" />
      <ellipse cx="90" cy="35" rx="22" ry="13" />
    </svg>
  );
}

function BaobabTree() {
  return (
    <svg viewBox="0 0 200 280" className="w-full h-auto" aria-hidden="true">
      {/* Trunk */}
      <path
        d="M95 280 Q90 200 95 160 Q100 130 95 100 L105 100 Q110 130 105 160 Q110 200 105 280 Z"
        fill="oklch(0.30 0.04 35)"
      />
      {/* Branches */}
      <path
        d="M100 110 Q70 90 50 80 M100 105 Q130 85 155 75 M100 100 Q85 80 80 60 M100 100 Q115 80 125 55"
        stroke="oklch(0.30 0.04 35)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Canopy — clusters of leaves */}
      <g opacity="0.92">
        <circle cx="50" cy="78" r="22" fill="oklch(0.42 0.09 158)" />
        <circle cx="40" cy="65" r="18" fill="oklch(0.45 0.10 158)" />
        <circle cx="155" cy="75" r="24" fill="oklch(0.42 0.09 158)" />
        <circle cx="165" cy="62" r="18" fill="oklch(0.45 0.10 158)" />
        <circle cx="100" cy="55" r="32" fill="oklch(0.40 0.10 158)" />
        <circle cx="80" cy="58" r="22" fill="oklch(0.46 0.10 158)" />
        <circle cx="120" cy="50" r="22" fill="oklch(0.46 0.10 158)" />
        <circle cx="100" cy="35" r="18" fill="oklch(0.48 0.10 158)" />
      </g>
    </svg>
  );
}

function HillsBack() {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className="w-full h-auto"
      aria-hidden="true"
    >
      <path
        d="M0 200 L0 130 Q200 90 400 110 T800 100 T1200 120 T1440 90 L1440 200 Z"
        fill="oklch(0.55 0.08 158 / 0.55)"
      />
    </svg>
  );
}

function HillsFront() {
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      className="w-full h-auto"
      aria-hidden="true"
    >
      <path
        d="M0 240 L0 150 Q150 110 320 130 T640 130 T960 140 T1280 120 T1440 140 L1440 240 Z"
        fill="oklch(0.40 0.10 158)"
      />
      {/* Grass tufts */}
      <g opacity="0.4" fill="oklch(0.30 0.08 165)">
        <path d="M120 140 L115 130 L122 138 L118 125 L125 138 L130 128 L128 140 Z" />
        <path d="M380 132 L375 122 L382 130 L378 117 L385 130 L390 120 L388 132 Z" />
        <path d="M680 138 L675 128 L682 136 L678 123 L685 136 L690 126 L688 138 Z" />
        <path d="M980 142 L975 132 L982 140 L978 127 L985 140 L990 130 L988 142 Z" />
        <path d="M1240 134 L1235 124 L1242 132 L1238 119 L1245 132 L1250 122 L1248 134 Z" />
      </g>
    </svg>
  );
}

function FloatingIcons() {
  const icons = [
    { Icon: HandHeart, top: "22%", left: "8%", color: "text-gold", delay: 0 },
    { Icon: Sparkles, top: "62%", left: "12%", color: "text-terracotta", delay: 1.5 },
    { Icon: MapPin, top: "38%", left: "78%", color: "text-forest-light", delay: 0.8 },
    { Icon: ArrowRight, top: "72%", left: "82%", color: "text-gold", delay: 2.2 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((it, i) => (
        <motion.div
          key={i}
          className={`absolute ${it.color} ${it.top.includes("%") ? "" : ""}`}
          style={{ top: it.top, left: it.left }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, delay: it.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/70 backdrop-blur-md border border-forest/15 grid place-items-center shadow-warm">
            <it.Icon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.75} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Marquee() {
  const items = [
    "54 African Countries",
    "12 Award Categories",
    "32 Continental Judges",
    "Kigali 2026",
    "African Solutions",
    "Just Transition",
    "Continental Stage",
    "Climate Leadership",
  ];
  return (
    <div className="bg-forest text-cream py-3 overflow-hidden border-y border-forest-light/40">
      <div className="flex animate-scroll-x whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-3 text-sm font-display font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-gold-light" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest via-gold to-terracotta origin-left z-[60]"
    />
  );
}

/** Magnetic button — pulls slightly toward the cursor */
function MagneticButton({
  children,
  className,
  variant,
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  asChild?: boolean;
}) {
  // We rely on the underlying Button component for asChild semantics.
  return (
    <Button asChild={asChild} variant={variant} className={className}>
      {children}
    </Button>
  );
}
