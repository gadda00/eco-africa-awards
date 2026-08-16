"use client";

import { motion } from "framer-motion";
import { Trophy, MapPin, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pastWinners, awardCategories } from "@/lib/data";

export function HomeWinners() {
  const featured = pastWinners.slice(0, 6);
  return (
    <section className="relative py-20 lg:py-28 bg-savanna-gradient overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-forest/30 bg-forest/10 text-forest">
            <Trophy className="h-3.5 w-3.5 text-gold" />
            Hall of Fame
          </div>
          <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
            The leaders who&apos;ve{" "}
            <span className="text-gradient-sunset italic">shaped the continent.</span>
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            Four editions of the Africa Climate Leadership Awards have honoured climate leaders whose work
            has redefined what&apos;s possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((w, i) => {
            const cat = awardCategories.find((c) => c.id === w.categoryId);
            return (
              <motion.div
                key={`${w.year}-${w.categoryId}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border-2 border-forest/15 bg-card shadow-warm hover:shadow-warm-lg transition-all"
              >
                {/* Top banner */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-forest/15 via-gold/10 to-terracotta/8">
                  <div className="absolute inset-0 bg-dots opacity-20" />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-gold/20 text-gold border border-gold/40">
                      {w.year} Winner
                    </span>
                  </div>
                  <Trophy className="absolute top-4 right-4 h-7 w-7 text-gold/50 group-hover:text-gold transition-colors" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-forest">
                      {cat?.shortName}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-forest leading-tight">{w.winnerName}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{w.winnerTitle}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-forest">
                    <MapPin className="h-3 w-3" />
                    <span>{w.country}</span>
                    <span className="text-muted-foreground">· {w.winnerOrg}</span>
                  </div>
                  <div className="mt-4 relative pl-5">
                    <Quote className="absolute top-0 left-0 h-3 w-3 text-gold/60" />
                    <p className="text-sm text-foreground/75 italic leading-relaxed">{w.highlight}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-forest hover:bg-forest-light text-cream font-bold h-12 px-6 shadow-forest">
            <Link href="/winners">
              Explore the full Hall of Fame
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
