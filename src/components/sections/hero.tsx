"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Trophy, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/section-primitives";
import { siteConfig } from "@/lib/site-config";

// Dynamically import the 3D canvas (client-only)
const EarthCanvas = dynamic(
  () => import("@/components/earth-canvas").then((m) => m.EarthCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="h-48 w-48 rounded-full bg-gradient-to-br from-emerald-500/40 to-amber-500/30 blur-2xl animate-pulse" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>
    ),
  }
);

export function HeroSection() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-background">
      {/* Background layers */}
      <div className="absolute inset-0 bg-radial-emerald" />
      <div className="absolute inset-0 bg-grid opacity-30 mask-fade-b" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      {/* The 3D Earth — desktop right side; mobile backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 lg:left-[35%] pointer-events-auto">
          <EarthCanvas className="h-full w-full opacity-90" />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pt-36 lg:pb-24 min-h-[100svh] flex items-center">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {siteConfig.parentOrgShort} · {siteConfig.stats.editions}th Edition
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.2rem] font-bold leading-[1.02] tracking-tight">
              <span className="block text-foreground">Africa&apos;s Climate</span>
              <span className="block text-gradient-emerald">Leaders Deserve</span>
              <span className="block text-foreground">A Continental Stage.</span>
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={0.16}>
            <p className="mt-7 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              The <span className="text-foreground font-medium">Eco Africa Awards</span> honour the visionaries, innovators, and communities driving Africa&apos;s climate future — across 54 countries, 12 categories, and one continent rising to the challenge.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-background font-semibold text-base h-13 px-7 shadow-xl shadow-emerald-500/30"
              >
                <a href="#nominate">
                  Nominate a Leader
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/70 bg-background/40 backdrop-blur-md text-foreground hover:bg-foreground/5 font-medium text-base h-13 px-7"
              >
                <a href="#categories">
                  <Trophy className="mr-1.5 h-4 w-4 text-amber-400" />
                  Explore Categories
                </a>
              </Button>
            </div>
          </Reveal>

          {/* Ceremony meta strip */}
          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>{siteConfig.ceremony.venue}</span>
              </div>
              <div className="hidden sm:block h-3 w-px bg-border" />
              <div className="font-medium text-foreground/80">{siteConfig.ceremony.date}</div>
              <div className="hidden sm:block h-3 w-px bg-border" />
              <div className="text-amber-300/90 font-medium">{siteConfig.ceremony.theme}</div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="relative h-9 w-5 rounded-full border border-border/70">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1 rounded-full bg-emerald-400"
          />
        </div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
