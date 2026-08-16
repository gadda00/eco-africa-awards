"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

export function HomeHero() {
  const { scrollYProgress } = useScroll();
  const skyY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const sunY = useTransform(scrollYProgress, [0, 0.3], [0, 40]);
  const hillsY = useTransform(scrollYProgress, [0, 0.3], [0, 50]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, 30]);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-[#FBE8B0] via-[#F5C26B] to-[#E89B2C]">
      {/* Sky gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100/40 via-transparent to-forest/20" />

      {/* Animated sun with rays */}
      <motion.div
        style={{ y: sunY }}
        className="absolute top-[12%] right-[10%] lg:top-[15%] lg:right-[15%]"
      >
        <div className="relative h-56 w-56 lg:h-72 lg:w-72">
          <div className="absolute inset-0 rounded-full blur-3xl opacity-70 bg-gradient-to-br from-amber-200 to-orange-400 animate-pulse" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-orange-300 shadow-[0_0_120px_50px_rgba(251,191,36,0.4)]" />
          {/* Sun rays */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 origin-left h-1"
                style={{
                  width: "200px",
                  background: "linear-gradient(to right, rgba(245,158,11,0.6), transparent)",
                  transform: `rotate(${i * 22.5}deg)`,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <Cloud className="absolute top-[20%] left-[5%] w-32 opacity-70 animate-float-slow" />
        <Cloud className="absolute top-[35%] left-[55%] w-24 opacity-50 animate-float-fast" style={{ animationDelay: "2s" }} />
        <Cloud className="absolute top-[15%] left-[40%] w-20 opacity-60 animate-float-slow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-32"
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-forest/30 bg-white/70 backdrop-blur-md text-forest shadow-warm"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {siteConfig.parentOrgShort} · {siteConfig.stats.editions}th Edition · 2026
          </motion.div>

          {/* Massive title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-forest"
          >
            Africa Climate
            <br />
            <span className="italic text-gradient-sunset">Leadership</span>
            <br />
            Awards.
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-lg sm:text-xl lg:text-2xl text-foreground/80 leading-relaxed max-w-2xl"
          >
            The continental celebration honouring the visionaries, innovators, and communities
            driving Africa&apos;s climate future — across{" "}
            <span className="font-bold text-forest">54 countries</span> and{" "}
            <span className="font-bold text-forest">12 categories</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="group bg-forest hover:bg-forest-light text-cream font-bold text-base h-14 px-8 shadow-forest">
              <Link href="/nominate">
                Nominate a Leader
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-forest/40 bg-white/70 backdrop-blur-md text-forest hover:bg-white font-semibold text-base h-14 px-8 shadow-warm">
              <Link href="/categories">
                <Trophy className="mr-2 h-5 w-5 text-gold" />
                Explore Categories
              </Link>
            </Button>
          </motion.div>

          {/* Ceremony meta strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm"
          >
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="h-5 w-5 text-forest" />
              <span className="font-semibold">{siteConfig.ceremony.date}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <MapPin className="h-5 w-5 text-forest" />
              <span className="font-semibold">{siteConfig.ceremony.venue}</span>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-forest text-cream">
              {siteConfig.ceremony.theme}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Landscape SVG */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        <motion.div style={{ y: hillsY }}>
          <SavannaScene />
        </motion.div>
      </div>

      {/* Marquee at bottom */}
      <div className="absolute bottom-0 inset-x-0 z-10">
        <Marquee />
      </div>
    </section>
  );
}

function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 50" className={className} style={style} fill="white" aria-hidden="true">
      <ellipse cx="35" cy="35" rx="25" ry="14" />
      <ellipse cx="60" cy="28" rx="32" ry="18" />
      <ellipse cx="90" cy="35" rx="22" ry="13" />
    </svg>
  );
}

function SavannaScene() {
  return (
    <svg
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      className="w-full h-auto"
      aria-hidden="true"
    >
      {/* Back hills */}
      <path
        d="M0 300 L0 160 Q200 120 400 140 T800 130 T1200 150 T1440 120 L1440 300 Z"
        fill="oklch(0.55 0.08 158 / 0.6)"
      />
      {/* Baobab tree silhouette */}
      <g transform="translate(1100, 80)">
        <path d="M30 220 Q28 180 30 160 Q35 140 30 120 L40 120 Q45 140 40 160 Q42 180 40 220 Z" fill="oklch(0.30 0.04 35)" />
        <path d="M35 130 Q15 110 -5 100 M35 125 Q55 105 75 95 M35 120 Q20 100 15 80 M35 120 Q50 100 55 80" stroke="oklch(0.30 0.04 35)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="98" r="28" fill="oklch(0.42 0.09 158)" />
        <circle cx="-12" cy="85" r="20" fill="oklch(0.45 0.10 158)" />
        <circle cx="75" cy="93" r="26" fill="oklch(0.42 0.09 158)" />
        <circle cx="85" cy="80" r="18" fill="oklch(0.45 0.10 158)" />
        <circle cx="35" cy="60" r="35" fill="oklch(0.40 0.10 158)" />
        <circle cx="20" cy="55" r="22" fill="oklch(0.46 0.10 158)" />
        <circle cx="50" cy="50" r="24" fill="oklch(0.46 0.10 158)" />
        <circle cx="35" cy="35" r="18" fill="oklch(0.48 0.10 158)" />
      </g>
      {/* Front hills */}
      <path
        d="M0 300 L0 200 Q150 160 320 180 T640 180 T960 190 T1280 170 T1440 190 L1440 300 Z"
        fill="oklch(0.40 0.10 158)"
      />
      {/* Grass tufts */}
      <g opacity="0.5" fill="oklch(0.30 0.08 165)">
        <path d="M120 190 L115 178 L122 186 L118 173 L125 186 L130 176 L128 190 Z" />
        <path d="M380 182 L375 170 L382 178 L378 165 L385 178 L390 168 L388 182 Z" />
        <path d="M680 188 L675 176 L682 184 L678 171 L685 184 L690 174 L688 188 Z" />
        <path d="M980 192 L975 180 L982 188 L978 175 L985 188 L990 178 L988 192 Z" />
        <path d="M1240 184 L1235 172 L1242 180 L1238 167 L1245 180 L1250 170 L1248 184 Z" />
      </g>
    </svg>
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
          <span key={i} className="mx-6 inline-flex items-center gap-3 text-sm font-display font-bold tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-gold-light" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
