"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/status-badge";
import { awardCategories, africanCountries } from "@/lib/data";

type Nomination = {
  id: string;
  referenceCode: string;
  nomineeName: string;
  nomineeCountry: string;
  categoryId: string;
  status: string;
  createdAt: string;
  reviewed: boolean;
  myScore: number | null;
  myRecommendation: string | null;
};

export function JudgeNominationsClient({
  nominations,
  assignedCategoryIds,
  filters,
}: {
  nominations: Nomination[];
  assignedCategoryIds: string[];
  filters: { status: string; categoryId: string; reviewed: string; q: string };
}) {
  const router = useRouter();
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(filters as any);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/judge/nominations?${params.toString()}`);
  };

  const assignedCats = awardCategories.filter((c) => assignedCategoryIds.includes(c.id));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-forest">My Assignments</h1>
        <p className="text-foreground/70 mt-1">
          {nominations.length} nominations across {assignedCats.length} assigned categories
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-forest/15 bg-card p-4 mb-4 shadow-warm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nominee…"
              defaultValue={filters.q}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilter("categoryId", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All my categories</option>
            {assignedCats.map((c) => (
              <option key={c.id} value={c.id}>{c.shortName}</option>
            ))}
          </select>
          <select
            value={filters.reviewed}
            onChange={(e) => updateFilter("reviewed", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="no">Pending</option>
            <option value="yes">Reviewed</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All active statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="FINALIST">Finalist</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-forest/15 bg-card shadow-warm overflow-hidden">
        <div className="divide-y divide-border/40">
          {nominations.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No nominations match your filters.
            </div>
          )}
          {nominations.map((n) => {
            const cat = awardCategories.find((c) => c.id === n.categoryId);
            return (
              <Link
                key={n.id}
                href={`/judge/nominations/${n.id}`}
                className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors group"
              >
                <div className={`h-10 w-10 rounded-xl grid place-items-center flex-shrink-0 ${
                  n.reviewed ? "bg-forest/10" : "bg-gold/15"
                }`}>
                  {n.reviewed ? (
                    <CheckCircle2 className="h-5 w-5 text-forest" />
                  ) : (
                    <Clock className="h-5 w-5 text-gold" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-foreground group-hover:text-forest truncate">
                      {n.nomineeName}
                    </div>
                    <StatusBadge status={n.status} />
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {cat?.shortName ?? n.categoryId} · {n.nomineeCountry} · {n.referenceCode}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {n.myScore !== null && (
                    <div className="font-display text-xl font-bold text-forest tabular-nums">
                      {n.myScore.toFixed(1)}
                    </div>
                  )}
                  {n.myRecommendation && (
                    <div className="text-[10px] text-muted-foreground">{n.myRecommendation}</div>
                  )}
                  <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-forest group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
