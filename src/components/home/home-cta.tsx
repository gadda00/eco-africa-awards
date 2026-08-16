"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function HomeCTA() {
  return (
    <section className="relative py-20 lg:py-28 bg-forest text-cream overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-terracotta/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-gold to-terracotta shadow-gold mb-6"
        >
          <Sparkles className="h-8 w-8 text-cream" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl lg:text-6xl font-bold leading-tight"
        >
          Be part of Africa&apos;s{" "}
          <span className="text-gradient-gold italic">climate future.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg lg:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed"
        >
          Nominate a leader, register for the ceremony, partner with us, or join the judging panel.
          The Africa Climate Leadership Awards are a continental movement — and there&apos;s a role for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-bold h-14 px-8 shadow-gold">
            <Link href="/nominate">
              Nominate a leader
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-cream/30 text-cream hover:bg-cream/10 font-bold h-14 px-8">
            <Link href="/ceremony">
              Register for ceremony
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        {/* Contact strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm"
        >
          <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-cream/70 hover:text-gold-light transition-colors">
            <Mail className="h-4 w-4" />
            {siteConfig.email}
          </a>
          <span className="hidden sm:block h-3 w-px bg-cream/20" />
          <a href="/#contact" className="flex items-center gap-2 text-cream/70 hover:text-gold-light transition-colors">
            <MessageCircle className="h-4 w-4" />
            Contact the team
          </a>
          <span className="hidden sm:block h-3 w-px bg-cream/20" />
          <Link href="/about" className="text-cream/70 hover:text-gold-light transition-colors">
            Learn more about us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
