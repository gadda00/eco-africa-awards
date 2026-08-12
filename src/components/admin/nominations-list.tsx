"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Filter, Download, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { awardCategories, africanCountries } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Nomination = {
  id: string;
  referenceCode: string;
  nomineeName: string;
  nomineeCountry: string;
  categoryId: string;
  status: string;
  createdAt: string;
  totalScore: number | null;
  reviewsCount: number;
};

const STATUSES = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "FINALIST", "WINNER", "NOT_SELECTED"];

export function AdminNominationsClient({
  nominations,
  totalCount,
  page,
  pageSize,
  filters,
}: {
  nominations: Nomination[];
  totalCount: number;
  page: number;
  pageSize: number;
  filters: { status: string; categoryId: string; country: string; q: string };
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const allChecked = nominations.length > 0 && selected.size === nominations.length;
  const someChecked = selected.size > 0 && !allChecked;

  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(nominations.map((n) => n.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(filters as any);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/admin/nominations?${params.toString()}`);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(filters as any);
    params.set("page", String(p));
    router.push(`/admin/nominations?${params.toString()}`);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  const exportCsv = () => {
    const headers = ["Reference", "Nominee", "Country", "Category", "Status", "Score", "Reviews", "Submitted"];
    const rows = nominations.map((n) => [
      n.referenceCode,
      n.nomineeName,
      n.nomineeCountry,
      awardCategories.find((c) => c.id === n.categoryId)?.name ?? n.categoryId,
      n.status,
      n.totalScore?.toFixed(2) ?? "",
      n.reviewsCount,
      new Date(n.createdAt).toISOString().slice(0, 10),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nominations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${nominations.length} nominations`);
  };

  const applyBulkStatus = async () => {
    if (!bulkStatus || selected.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/nominations/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), action: "setStatus", status: bulkStatus }),
      });
      if (!res.ok) throw new Error("Bulk update failed");
      const data = await res.json();
      toast.success(`Updated ${data.updated} nominations to ${bulkStatus}`);
      setSelected(new Set());
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Bulk update failed");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-forest">Nominations</h1>
        <p className="text-foreground/70 mt-1">
          {totalCount.toLocaleString()} total · managing all 12 categories
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-forest/15 bg-card p-4 mb-4 shadow-warm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nominee, ref code…"
              defaultValue={filters.q}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <select
            value={filters.categoryId}
            onChange={(e) => updateFilter("categoryId", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {awardCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.shortName}</option>
            ))}
          </select>
          <select
            value={filters.country}
            onChange={(e) => updateFilter("country", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All countries</option>
            {africanCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="rounded-xl border border-gold/40 bg-gold/10 p-3 mb-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {selected.size} selected
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="">Change status to…</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={applyBulkStatus}
            disabled={!bulkStatus || bulkLoading}
            className="bg-forest hover:bg-forest-light text-cream"
          >
            {bulkLoading ? "Applying…" : "Apply"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-forest/15 bg-card shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked;
                    }}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-border"
                  />
                </th>
                <th className="p-3 text-left font-semibold text-foreground/80">Nominee</th>
                <th className="p-3 text-left font-semibold text-foreground/80 hidden md:table-cell">Category</th>
                <th className="p-3 text-left font-semibold text-foreground/80 hidden lg:table-cell">Country</th>
                <th className="p-3 text-left font-semibold text-foreground/80">Status</th>
                <th className="p-3 text-right font-semibold text-foreground/80 hidden sm:table-cell">Score</th>
                <th className="p-3 text-right font-semibold text-foreground/80 hidden sm:table-cell">Reviews</th>
                <th className="p-3 text-right font-semibold text-foreground/80">Submitted</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {nominations.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-muted-foreground">
                    No nominations match your filters.
                  </td>
                </tr>
              )}
              {nominations.map((n) => {
                const cat = awardCategories.find((c) => c.id === n.categoryId);
                return (
                  <tr
                    key={n.id}
                    className={cn(
                      "border-b border-border/40 hover:bg-secondary/30 transition-colors",
                      selected.has(n.id) && "bg-gold/5"
                    )}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(n.id)}
                        onChange={() => toggleOne(n.id)}
                        className="h-4 w-4 rounded border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Link href={`/admin/nominations/${n.id}`} className="group">
                        <div className="font-medium text-foreground group-hover:text-forest">{n.nomineeName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{n.referenceCode}</div>
                      </Link>
                    </td>
                    <td className="p-3 hidden md:table-cell text-foreground/80">{cat?.shortName ?? n.categoryId}</td>
                    <td className="p-3 hidden lg:table-cell text-foreground/80">{n.nomineeCountry}</td>
                    <td className="p-3"><StatusBadge status={n.status} /></td>
                    <td className="p-3 text-right tabular-nums hidden sm:table-cell">
                      {n.totalScore !== null ? n.totalScore.toFixed(1) : "—"}
                    </td>
                    <td className="p-3 text-right tabular-nums hidden sm:table-cell">{n.reviewsCount}</td>
                    <td className="p-3 text-right text-xs text-muted-foreground tabular-nums">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/nominations/${n.id}`}
                        className="text-forest hover:text-gold inline-flex"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {nominations.length > 0 ? `Showing ${from}–${to} of ${totalCount.toLocaleString()}` : "No results"}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportCsv}
              className="ml-2 text-forest"
              title="Export current page as CSV"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
