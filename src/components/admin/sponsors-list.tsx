"use client";

import { ExternalLink, Building2, Handshake } from "lucide-react";

const tierStyles: Record<string, string> = {
  Platinum: "bg-gold/15 text-gold border-gold/40",
  Gold: "bg-forest/10 text-forest border-forest/30",
  Silver: "bg-savanna/30 text-terracotta border-savanna/50",
  Partner: "bg-secondary text-foreground/70 border-border",
  Media: "bg-sky/10 text-sky border-sky/30",
};

export function AdminSponsorsClient({ sponsors }: { sponsors: typeof import("@/lib/data").sponsors }) {
  const grouped = sponsors.reduce((acc, s) => {
    (acc[s.tier] = acc[s.tier] || []).push(s);
    return acc;
  }, {} as Record<string, typeof sponsors>);

  const tierOrder = ["Platinum", "Gold", "Silver", "Partner", "Media"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Sponsors & Partners</h1>
        <p className="text-foreground/70 mt-1">{sponsors.length} partners across 5 tiers</p>
      </div>

      <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card to-forest/5 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gold/20 ring-1 ring-gold/40 grid place-items-center flex-shrink-0">
            <Handshake className="h-6 w-6 text-gold" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold text-forest">Managing sponsors</h2>
            <p className="text-sm text-foreground/70 mt-1 leading-relaxed">
              Sponsor data is currently managed in the codebase (<code className="text-xs bg-secondary/60 px-1.5 py-0.5 rounded">src/lib/data.ts</code>).
              For frequent updates, contact the development team or extend this admin to use the database.
              The current list is rendered on the public <a href="/#sponsors" className="text-forest underline">sponsors section</a>.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {tierOrder.map((tier) => {
          const list = grouped[tier] || [];
          if (list.length === 0) return null;
          return (
            <div key={tier}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-display text-lg font-bold text-foreground">{tier} Partners</h2>
                <span className="text-xs text-muted-foreground">({list.length})</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-forest/15 bg-card p-4 shadow-warm flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{s.category}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tierStyles[tier]}`}>
                      {tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
