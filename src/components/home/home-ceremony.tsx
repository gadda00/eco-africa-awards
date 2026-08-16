"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Plane, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function HomeCeremony() {
  return (
    <section className="relative py-20 lg:py-28 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: ceremony info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-gold/40 bg-gold/10 text-gold"
            >
              <Calendar className="h-3.5 w-3.5" />
              The Ceremony
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest"
            >
              Four days. One continental stage.{" "}
              <span className="text-gradient-sunset italic">850 climate leaders.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-lg text-foreground/70 leading-relaxed"
            >
              Join the 2026 Africa Climate Leadership Awards Ceremony at the Kigali Convention Centre —
              held in partnership with the Africa Climate Leadership Summit. The night the continent celebrates its own.
            </motion.p>

            {/* Meta cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <MetaCard icon={Calendar} label="Dates" value={siteConfig.ceremony.date} sub="Ceremony: Sep 16" />
              <MetaCard icon={MapPin} label="Venue" value="Kigali Convention Centre" sub="Rwanda" />
              <MetaCard icon={Users} label="Capacity" value="850 attendees" sub="54 countries" />
            </motion.div>

            {/* Practical info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 p-4 rounded-2xl border border-forest/15 bg-card"
            >
              <div className="flex items-start gap-3">
                <Plane className="h-5 w-5 text-forest flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-forest">Travel:</span>{" "}
                  <span className="text-foreground/70">Kigali International Airport (KGL) is 8 km from the venue. Visa-on-arrival available for most African passport holders.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-2">
                <Hotel className="h-5 w-5 text-forest flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-forest">Accommodation:</span>{" "}
                  <span className="text-foreground/70">Partner hotels offer discounted rates. Booking details shared upon registration.</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <Button asChild size="lg" className="bg-forest hover:bg-forest-light text-cream font-bold h-14 px-8 shadow-forest">
                <Link href="/ceremony">
                  Register to attend
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right: schedule card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl border-2 border-forest/15 bg-card p-8 shadow-warm-lg"
          >
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-forest">4-Day Schedule</h3>
              <p className="text-sm text-muted-foreground mt-1">September 14 – 17, 2026 · Kigali</p>
            </div>
            <div className="space-y-4">
              {[
                { day: "Day 1", date: "Sep 14", title: "Arrival & Welcome", desc: "Registration, welcome kits, informal reception." },
                { day: "Day 2", date: "Sep 15", title: "Climate Leadership Summit", desc: "Keynotes, panels, State of African Climate Leadership address." },
                { day: "Day 3", date: "Sep 16", title: "Awards Ceremony & Gala", desc: "12 winners announced. Black-tie optional, African heritage encouraged." },
                { day: "Day 4", date: "Sep 17", title: "Fellowship & Closing", desc: "2027 cycle kick-off, ACLA Fellowship announcement." },
              ].map((s, i) => (
                <motion.div
                  key={s.day}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4 pb-4 border-b border-forest/10 last:border-0 last:pb-0"
                >
                  <div className="flex-shrink-0 w-20">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-gold">{s.day}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.date}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-forest text-sm">{s.title}</div>
                    <div className="text-xs text-foreground/70 mt-0.5">{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MetaCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-forest/15 bg-card p-5 shadow-warm">
      <div className="h-10 w-10 rounded-xl bg-forest/10 ring-1 ring-forest/30 grid place-items-center mb-3">
        <Icon className="h-5 w-5 text-forest" />
      </div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">{label}</div>
      <div className="mt-1 font-bold text-foreground text-sm">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
