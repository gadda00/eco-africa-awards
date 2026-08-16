"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function HomeNominate() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-forest to-forest-light text-cream overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 25% 25%, oklch(0.86 0.13 75) 1.5px, transparent 1.5px)",
        backgroundSize: "40px 40px"
      }} />
      <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute bottom-1/3 -right-32 h-72 w-72 rounded-full bg-terracotta/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-gold/40 bg-gold/10 text-gold-light"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Submit a Nomination
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 font-display text-4xl lg:text-5xl font-bold leading-tight"
            >
              Five steps to honour a{" "}
              <span className="text-gradient-gold italic">climate leader.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-lg text-cream/80 leading-relaxed"
            >
              Nominations are free, confidential, and open to anyone. Use our AI Nomination Assistant
              at any time to strengthen your case before submitting.
            </motion.p>

            {/* Key dates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 space-y-3"
            >
              {[
                { label: "Nominations open", date: siteConfig.nomination.openDate, done: true },
                { label: "Early-bird deadline", date: siteConfig.nomination.earlyDeadline, done: false },
                { label: "Final deadline", date: siteConfig.nomination.finalDeadline, done: false },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${d.done ? "bg-gold" : "bg-cream/30 border border-cream/40"}`} />
                  <span className="text-sm text-cream/70 w-44">{d.label}</span>
                  <span className="text-sm font-bold text-cream">{d.date}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-bold h-14 px-8 shadow-gold">
                <Link href="/nominate">
                  Start a nomination
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right: steps card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border border-cream/20 bg-cream/5 backdrop-blur-md p-8 shadow-2xl"
          >
            <h3 className="font-display text-2xl font-bold text-cream mb-6">The 5-step process</h3>
            <div className="space-y-4">
              {[
                { num: "01", title: "Choose category", desc: "Pick from 12 categories or use our AI matchmaker" },
                { num: "02", title: "Nominee details", desc: "Name, country, organisation, contact info" },
                { num: "03", title: "Your details", desc: "Nominator info or self-nomination" },
                { num: "04", title: "Make the case", desc: "Summary, justification, impact metrics — with AI assist" },
                { num: "05", title: "Review & submit", desc: "Confirm consent, get reference code" },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-gold/20 to-terracotta/10 ring-1 ring-gold/30 grid place-items-center">
                    <span className="font-display text-lg font-bold text-gold-light">{step.num}</span>
                  </div>
                  <div>
                    <div className="font-bold text-cream">{step.title}</div>
                    <div className="text-sm text-cream/60 mt-0.5">{step.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-cream/15 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-gold-light flex-shrink-0 mt-0.5" />
              <p className="text-xs text-cream/60 leading-relaxed">
                All nominations are confidential. AI assistance is optional and advisory only — every
                nomination is reviewed by human judges.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
