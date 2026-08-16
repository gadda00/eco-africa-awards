"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { awardCategories } from "@/lib/data";

export function HomeCategories() {
  return (
    <section className="relative py-20 lg:py-28 bg-savanna-gradient overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-forest/30 bg-forest/10 text-forest">
            <Trophy className="h-3.5 w-3.5 text-gold" />
            12 Award Categories
          </div>
          <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
            Twelve stages. <span className="text-gradient-sunset italic">One continent rising.</span>
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            From grassroots resilience to continental policy — explore the categories recognising the full
            spectrum of African climate leadership.
          </p>
        </div>

        {/* Featured categories (3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {awardCategories.slice(0, 3).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border-2 border-forest/20 bg-card p-8 shadow-warm hover:shadow-warm-lg transition-all"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-gold/20 to-terracotta/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-forest/10 text-forest ring-1 ring-forest/30">
                    {cat.level}
                  </span>
                  {cat.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/40">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="font-display text-2xl font-bold text-forest">{cat.name}</h3>
                <p className="mt-2 text-sm italic text-gold font-medium">{cat.tagline}</p>
                <p className="mt-4 text-sm text-foreground/70 leading-relaxed line-clamp-3">{cat.description}</p>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-gold transition-colors"
                >
                  View category details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* "View all" CTA */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="border-forest/40 bg-white/60 backdrop-blur-md text-forest hover:bg-white font-bold h-12 px-6 shadow-warm">
            <Link href="/categories">
              View all 12 categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
