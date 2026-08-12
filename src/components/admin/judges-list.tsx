"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Trash2, Loader2, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { africanCountries } from "@/lib/data";

type Judge = {
  id: string;
  email: string;
  name: string;
  title: string;
  organization: string;
  country: string;
  expertise: string[];
  assignedCategories: string[];
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  reviewsCount: number;
  avgScore: number | null;
};

export function AdminJudgesClient({
  judges, categories,
}: {
  judges: Judge[];
  categories: { id: string; shortName: string }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: "", name: "", title: "", organization: "", country: "",
    expertise: "", password: "", assignedCategories: [] as string[],
  });
  const [creating, setCreating] = useState(false);

  const createJudge = async () => {
    if (!form.email || !form.name || !form.password) {
      toast.error("Email, name, and password are required.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/judges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          expertise: form.expertise.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed");
      }
      toast.success("Judge created");
      setForm({ email: "", name: "", title: "", organization: "", country: "", expertise: "", password: "", assignedCategories: [] });
      setShowForm(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setCreating(false);
    }
  };

  const toggleCategory = (catId: string) => {
    setForm((f) => ({
      ...f,
      assignedCategories: f.assignedCategories.includes(catId)
        ? f.assignedCategories.filter((c) => c !== catId)
        : [...f.assignedCategories, catId],
    }));
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/judges/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(isActive ? "Deactivated" : "Activated");
      router.refresh();
    } catch {
      toast.error("Failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Permanently delete this judge? Their reviews will be preserved.")) return;
    try {
      const res = await fetch(`/api/admin/judges/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Judge deleted");
      router.refresh();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Judges</h1>
          <p className="text-foreground/70 mt-1">
            {judges.length} judges · {judges.filter((j) => j.isActive).length} active
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} className="bg-forest hover:bg-forest-light text-cream">
          <UserPlus className="mr-1.5 h-4 w-4" />Add judge
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-forest/30 bg-card p-6 mb-6 shadow-warm">
          <h2 className="font-display text-lg font-bold text-forest mb-4">New judge account</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email *">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Full name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Title">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Director, Senior Researcher" />
            </Field>
            <Field label="Organisation">
              <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            </Field>
            <Field label="Country">
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select…</option>
                {africanCountries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Expertise (comma-separated)">
              <Input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder="Policy, Adaptation, Finance" />
            </Field>
            <Field label="Temporary password *">
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Field>
          </div>

          <div className="mt-4">
            <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-2 block">
              Assigned categories
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCategory(c.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all",
                    form.assignedCategories.includes(c.id)
                      ? "bg-forest/10 border-forest/40 text-forest"
                      : "border-border text-foreground/70 hover:border-forest/30"
                  )}
                >
                  {c.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button onClick={createJudge} disabled={creating} className="bg-forest hover:bg-forest-light text-cream">
              {creating ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Creating…</> : "Create judge"}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Judges grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {judges.length === 0 && (
          <div className="col-span-full p-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl">
            No judges yet. Click "Add judge" to create the first one.
          </div>
        )}
        {judges.map((j) => (
          <div
            key={j.id}
            className={cn(
              "rounded-2xl border bg-card p-5 shadow-warm",
              j.isActive ? "border-forest/15" : "border-muted opacity-70"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-forest to-gold grid place-items-center text-cream font-bold flex-shrink-0">
                {j.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground truncate">{j.name || "Unnamed"}</div>
                <div className="text-xs text-muted-foreground truncate">{j.title || j.email}</div>
                {j.organization && <div className="text-xs text-muted-foreground truncate">{j.organization}</div>}
                {j.country && <div className="text-xs text-muted-foreground">{j.country}</div>}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-secondary/40 p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Reviews</div>
                <div className="font-bold text-foreground tabular-nums">{j.reviewsCount}</div>
              </div>
              <div className="rounded-lg bg-secondary/40 p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Avg score</div>
                <div className="font-bold text-foreground tabular-nums">{j.avgScore ?? "—"}</div>
              </div>
            </div>

            {j.assignedCategories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {j.assignedCategories.map((cid) => {
                  const cat = categories.find((c) => c.id === cid);
                  return (
                    <span key={cid} className="px-1.5 py-0.5 rounded text-[10px] bg-forest/10 text-forest">
                      {cat?.shortName ?? cid}
                    </span>
                  );
                })}
              </div>
            )}

            {j.expertise.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {j.expertise.map((e) => (
                  <span key={e} className="px-1.5 py-0.5 rounded text-[10px] bg-gold/15 text-gold">
                    {e}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
              <a
                href={`mailto:${j.email}`}
                className="text-xs text-muted-foreground hover:text-forest inline-flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />{j.email}
              </a>
              <div className="flex gap-1">
                <button
                  onClick={() => toggleActive(j.id, j.isActive)}
                  className={cn(
                    "h-7 px-2 rounded text-[10px] font-semibold",
                    j.isActive ? "bg-terracotta/10 text-terracotta" : "bg-forest/10 text-forest"
                  )}
                >
                  <Shield className="h-3 w-3 mr-0.5 inline" />
                  {j.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => remove(j.id)}
                  className="h-7 w-7 rounded grid place-items-center text-muted-foreground hover:text-terracotta hover:bg-terracotta/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
