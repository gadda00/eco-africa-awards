"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/section-primitives";
import { faqItems } from "@/lib/data";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "nominations", label: "Nominations" },
  { id: "judging", label: "Judging" },
  { id: "ceremony", label: "Ceremony" },
  { id: "general", label: "General" },
];

export function FaqSection() {
  const [open, setOpen] = useState<string | null>(faqItems[0]?.id ?? null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? faqItems : faqItems.filter((f) => f.category === filter);

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-background">
      <div className="absolute inset-0 bg-dots opacity-30" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frequently Asked"
          title={
            <>
              Answers to{" "}
              <span className="text-gradient-sunset">the questions you have.</span>
            </>
          }
          description="From eligibility to the ceremony night itself — if you can't find your answer here, reach out via the contact form below."
        />

        {/* Category filter */}
        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
                  filter === c.id
                    ? "bg-gradient-to-r from-forest to-forest-light text-cream"
                    : "border border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* FAQ items */}
        <div className="mt-10 space-y-3">
          {filtered.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <Reveal key={item.id} delay={(i % 6) * 0.04}>
                <motion.div
                  initial={false}
                  className={cn(
                    "rounded-2xl border overflow-hidden transition-colors",
                    isOpen ? "border-forest/40 bg-forest/5" : "border-border/60 bg-card/40"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}-content`}
                    id={`faq-${item.id}-button`}
                    className="w-full px-5 py-4 flex items-center gap-3 text-left"
                  >
                    <HelpCircle className={cn("h-5 w-5 flex-shrink-0 transition-colors", isOpen ? "text-forest" : "text-muted-foreground")} aria-hidden="true" />
                    <span className="flex-1 font-semibold text-foreground text-sm lg:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          id={`faq-${item.id}-content`}
                          role="region"
                          aria-labelledby={`faq-${item.id}-button`}
                          className="px-5 pb-5 pl-13 text-sm text-muted-foreground leading-relaxed"
                        >
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
