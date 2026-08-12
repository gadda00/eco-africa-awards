"use client";

import { motion } from "framer-motion";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { sponsors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";

const tierOrder = ["Platinum", "Gold", "Silver", "Partner", "Media"] as const;

const tierStyles: Record<string, string> = {
  Platinum: "border-gold/30 bg-gradient-to-br from-gold/10 to-transparent",
  Gold: "border-forest/30 bg-gradient-to-br from-forest/10 to-transparent",
  Silver: "border-border/60 bg-gradient-to-br from-muted/30 to-transparent",
  Partner: "border-border/60 bg-card/40",
  Media: "border-border/60 bg-card/40",
};

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Partners & Sponsors"
          title={
            <>
              The institutions standing{" "}
              <span className="text-gradient-sunset">behind the awards.</span>
            </>
          }
          description="The Eco Africa Awards are made possible by partners who share ACLA's conviction that African climate leadership deserves a continental stage. We're grateful for their support."
        />

        <div className="mt-14 lg:mt-20 space-y-10">
          {tierOrder.map((tier) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            if (tierSponsors.length === 0) return null;
            return (
              <Reveal key={tier}>
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="text-xs uppercase tracking-[0.3em] font-semibold text-muted-foreground">
                      {tier} Partners
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tierSponsors.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className={`group relative overflow-hidden rounded-xl border ${tierStyles[tier]} p-5 flex flex-col items-center justify-center text-center min-h-[110px]`}
                      >
                        <div className="font-display text-base lg:text-lg font-bold text-foreground leading-tight">
                          {s.name}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {s.category}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 relative overflow-hidden rounded-3xl border border-forest/30 bg-gradient-to-br from-forest/10 via-card/60 to-gold/10 p-8 lg:p-12 text-center">
            <div className="absolute inset-0 bg-dots opacity-30" />
            <div className="relative">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-forest/20 to-gold/10 ring-1 ring-forest/30 grid place-items-center">
                <Handshake className="h-7 w-7 text-forest" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-2xl lg:text-3xl font-bold text-foreground">
                Become a partner of the 2026 edition.
              </h3>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Partner with the Eco Africa Awards to celebrate African climate leadership, connect with the continent's climate community, and shape the future of the programme. We partner with mission-aligned institutions across finance, academia, media, and the public sector.
              </p>
              <Button
                asChild
                className="mt-7 bg-gradient-to-r from-forest to-forest-light hover:from-forest hover:to-forest-light text-cream font-semibold"
              >
                <a href="#contact">
                  Request a partnership pack
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
