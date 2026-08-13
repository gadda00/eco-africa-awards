"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Trophy, MapPin, ArrowRight } from "lucide-react";

type Winner = {
  type: "live" | "static";
  id: string;
  year: number;
  nomineeName: string;
  nomineeTitle: string | null;
  nomineeOrg: string | null;
  nomineeCountry: string;
  categoryId: string;
  highlight: string;
};

export function WinnersIndexClient({
  winners,
  categories,
}: {
  winners: Winner[];
  categories: { id: string; shortName: string; name: string; slug: string }[];
}) {
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const years = useMemo(() => {
    return Array.from(new Set(winners.map((w) => w.year))).sort((a, b) => b - a);
  }, [winners]);

  const filtered = useMemo(() => {
    return winners.filter((w) => {
      if (yearFilter !== "all" && w.year !== yearFilter) return false;
      if (categoryFilter !== "all" && w.categoryId !== categoryFilter) return false;
      return true;
    });
  }, [winners, yearFilter, categoryFilter]);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setYearFilter("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              yearFilter === "all"
                ? "bg-forest text-cream"
                : "border border-forest/30 text-foreground/70 hover:text-forest"
            }`}
          >
            All Years
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYearFilter(y)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                yearFilter === y
                  ? "bg-forest text-cream"
                  : "border border-forest/30 text-foreground/70 hover:text-forest"
              }`}
            >
              {y}
            </button>
          ))}

          <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-forest/30 bg-background text-foreground/70"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.shortName}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
              No winners match your filters.
            </div>
          )}
          {filtered.map((w) => {
            const cat = categories.find((c) => c.id === w.categoryId);
            const href = w.type === "live" ? `/winners/${w.year}/${w.id}` : `/categories/${cat?.slug ?? ""}`;
            const isLink = w.type === "live";
            return (
              <Link
                key={w.id}
                href={href}
                className={`block rounded-2xl border border-forest/15 bg-card p-6 shadow-warm ${
                  isLink ? "hover:shadow-warm-lg hover:-translate-y-0.5 transition-all cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-gold to-terracotta text-cream">
                    {w.year}
                  </span>
                  <Trophy className="h-5 w-5 text-gold/60" />
                </div>
                <h3 className="font-display text-lg font-bold text-forest leading-tight">{w.nomineeName}</h3>
                {w.nomineeTitle && <p className="text-sm text-muted-foreground mt-0.5">{w.nomineeTitle}</p>}
                <div className="mt-1 text-xs text-forest inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {w.nomineeCountry}
                  {w.nomineeOrg && <span className="text-muted-foreground"> · {w.nomineeOrg}</span>}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-wider text-forest font-semibold">
                  {cat?.name}
                </div>
                <p className="mt-3 text-sm text-foreground/80 italic leading-relaxed line-clamp-3">
                  &ldquo;{w.highlight}&rdquo;
                </p>
                {isLink && (
                  <div className="mt-4 text-xs text-forest font-semibold inline-flex items-center gap-1">
                    Read full story <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
