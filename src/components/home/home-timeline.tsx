"use client";

import { motion } from "framer-motion";
import { CalendarClock, DoorOpen, Bell, Cpu, Users, Trophy, PartyPopper } from "lucide-react";
import { timelinePhases } from "@/lib/data";

const icons: Record<string, any> = {
  DoorOpen,
  Bell,
  CalendarClock,
  Cpu,
  Users,
  Trophy,
  PartyPopper,
};

export function HomeTimeline() {
  return (
    <section className="relative py-20 lg:py-28 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-forest/40 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-gold/40 bg-gold/10 text-gold">
            <CalendarClock className="h-3.5 w-3.5" />
            2026 Timeline
          </div>
          <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
            From nominations open to{" "}
            <span className="text-gradient-sunset italic">the continental stage.</span>
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            A transparent, eight-month process — designed to give every nomination the consideration it deserves.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-forest via-gold to-terracotta lg:-translate-x-1/2 rounded-full" />

          <div className="space-y-8">
            {timelinePhases.map((phase, i) => {
              const Icon = icons[phase.icon] ?? CalendarClock;
              const isLeft = i % 2 === 0;
              const isActive = phase.status === "active";
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative pl-16 lg:pl-0 ${isLeft ? "lg:pr-[52%] lg:text-right" : "lg:pl-[52%]"}`}
                >
                  {/* Node */}
                  <div
                    className={`absolute top-3 left-3 lg:left-auto ${
                      isLeft ? "lg:right-0 lg:translate-x-1/2" : "lg:left-0 lg:-translate-x-1/2"
                    }`}
                  >
                    <div
                      className={`relative h-12 w-12 rounded-full grid place-items-center shadow-lg ${
                        isActive
                          ? "bg-gradient-to-br from-forest to-gold text-cream ring-4 ring-gold/30"
                          : "bg-card border-2 border-forest/30 text-forest"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {isActive && (
                        <span className="absolute inset-0 rounded-full ring-4 ring-gold/40 animate-ping" />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`rounded-2xl border-2 p-6 shadow-warm ${
                      isActive ? "border-gold/50 bg-gradient-to-br from-gold/10 to-card" : "border-forest/15 bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-forest/70">{phase.phase}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest text-cream">
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-forest">{phase.title}</h3>
                    <div className={`mt-1 text-sm font-semibold ${isActive ? "text-gold" : "text-forest/70"}`}>
                      {phase.date}
                    </div>
                    <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{phase.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
