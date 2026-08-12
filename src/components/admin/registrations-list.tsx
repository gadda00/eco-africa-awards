"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Download, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";

type Registration = {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phone: string | null;
  organization: string | null;
  role: string | null;
  country: string;
  ticketType: string;
  dietary: string | null;
  accessibility: string | null;
  newsletter: boolean;
  status: string;
  createdAt: string;
};

const TICKET_TYPES = ["GENERAL", "VIP", "PRESS", "SPEAKER", "STUDENT"];

export function AdminRegistrationsClient({
  registrations, totalCount, page, pageSize, filters,
}: {
  registrations: Registration[];
  totalCount: number;
  page: number;
  pageSize: number;
  filters: { status: string; ticketType: string; q: string };
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(filters as any);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/admin/registrations?${params.toString()}`);
  };

  const goToPage = (p: number) => {
    const params = new URLSearchParams(filters as any);
    params.set("page", String(p));
    router.push(`/admin/registrations?${params.toString()}`);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const setStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Marked as ${status}`);
      router.refresh();
    } catch {
      toast.error("Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  const exportCsv = () => {
    const headers = ["Reference", "Name", "Email", "Phone", "Org", "Role", "Country", "Ticket", "Status", "Registered"];
    const rows = registrations.map((r) => [
      r.referenceCode, r.fullName, r.email, r.phone ?? "", r.organization ?? "",
      r.role ?? "", r.country, r.ticketType, r.status,
      new Date(r.createdAt).toISOString().slice(0, 10),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${registrations.length} registrations`);
  };

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Ceremony Registrations</h1>
          <p className="text-foreground/70 mt-1">{totalCount.toLocaleString()} total registrations</p>
        </div>
        <Button onClick={exportCsv} variant="outline" className="border-forest/30 text-forest">
          <Download className="mr-1.5 h-4 w-4" />Export CSV
        </Button>
      </div>

      <div className="rounded-2xl border border-forest/15 bg-card p-4 mb-4 shadow-warm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, ref code…"
              defaultValue={filters.q}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filters.ticketType}
            onChange={(e) => updateFilter("ticketType", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All ticket types</option>
            {TICKET_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked in</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-forest/15 bg-card shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="p-3 text-left font-semibold text-foreground/80">Attendee</th>
                <th className="p-3 text-left font-semibold text-foreground/80 hidden md:table-cell">Country</th>
                <th className="p-3 text-left font-semibold text-foreground/80">Ticket</th>
                <th className="p-3 text-left font-semibold text-foreground/80">Status</th>
                <th className="p-3 text-right font-semibold text-foreground/80 hidden lg:table-cell">Registered</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No registrations match.</td></tr>
              )}
              {registrations.map((r) => (
                <tr key={r.id} className="border-b border-border/40 hover:bg-secondary/30">
                  <td className="p-3">
                    <div className="font-medium text-foreground">{r.fullName}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{r.referenceCode}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-foreground/80">{r.country}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gold/15 text-gold">
                      {r.ticketType}
                    </span>
                  </td>
                  <td className="p-3"><StatusBadge status={r.status} /></td>
                  <td className="p-3 text-right text-xs text-muted-foreground tabular-nums hidden lg:table-cell">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    {r.status === "CONFIRMED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(r.id, "CHECKED_IN")}
                        disabled={updating === r.id}
                        className="border-forest/30 text-forest h-7 text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />Check in
                      </Button>
                    ) : r.status === "CHECKED_IN" ? (
                      <span className="text-xs text-forest font-semibold">Checked in</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {registrations.length > 0
              ? `Showing ${(page-1)*pageSize+1}–${Math.min(page*pageSize, totalCount)} of ${totalCount.toLocaleString()}`
              : "No results"}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page-1)} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goToPage(page+1)} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
