"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Mail, Trash2, CheckCircle2, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  organization: string | null;
  category: string;
  status: string;
  createdAt: string;
};

export function AdminMessagesClient({
  messages, totalCount, newCount, page, pageSize, filters,
}: {
  messages: Message[];
  totalCount: number;
  newCount: number;
  page: number;
  pageSize: number;
  filters: { status: string; category: string; q: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState<Message | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(filters as any);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/admin/messages?${params.toString()}`);
  };

  const setStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Marked as ${status}`);
      setOpen(null);
      router.refresh();
    } catch {
      toast.error("Failed");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Contact Messages</h1>
        <p className="text-foreground/70 mt-1">
          {totalCount.toLocaleString()} total · <span className="text-terracotta font-semibold">{newCount} new</span>
        </p>
      </div>

      <div className="rounded-2xl border border-forest/15 bg-card p-4 mb-4 shadow-warm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, subject…"
              defaultValue={filters.q}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            <option value="general">General</option>
            <option value="partnership">Partnership</option>
            <option value="press">Press</option>
            <option value="nominate-help">Nomination help</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-forest/15 bg-card shadow-warm overflow-hidden">
        <div className="divide-y divide-border/40">
          {messages.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">No messages match.</div>
          )}
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setOpen(m);
                if (m.status === "new") setStatus(m.id, "read");
              }}
              className="w-full text-left flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={m.status} />
                  <span className="text-xs text-muted-foreground">{m.category}</span>
                  {m.status === "new" && (
                    <span className="h-2 w-2 rounded-full bg-terracotta ml-auto" />
                  )}
                </div>
                <div className="font-medium text-foreground truncate">{m.subject}</div>
                <div className="text-sm text-muted-foreground truncate">
                  From <span className="font-medium">{m.name}</span> ({m.email})
                </div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{m.message}</div>
              </div>
              <div className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                {new Date(m.createdAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-card rounded-2xl border border-forest/15 shadow-warm-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto scrollbar-warm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-forest">{open.subject}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  From <span className="font-medium text-foreground">{open.name}</span>
                  {open.organization && <> · {open.organization}</>}
                </p>
                <a
                  href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`}
                  className="inline-flex items-center gap-1.5 mt-2 text-sm text-forest hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {open.email}
                </a>
              </div>
              <StatusBadge status={open.status} />
            </div>
            <div className="rounded-xl bg-secondary/40 p-4 mb-4">
              <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">{open.message}</p>
            </div>
            <div className="text-xs text-muted-foreground mb-4">
              Received {new Date(open.createdAt).toLocaleString()}
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-cream text-sm font-semibold"
              >
                <Mail className="h-4 w-4" />Reply via email
              </a>
              <Button
                variant="outline"
                onClick={() => setStatus(open.id, "replied")}
                disabled={updating === open.id}
                className="border-forest/30 text-forest"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />Mark replied
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStatus(open.id, "archived")}
                disabled={updating === open.id}
              >
                <Archive className="h-4 w-4 mr-1.5" />Archive
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
