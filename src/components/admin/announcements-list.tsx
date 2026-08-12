"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Loader2, Pin, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Announcement = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  isPublished: boolean;
  isPinned: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const empty = {
  title: "",
  excerpt: "",
  body: "",
  category: "news",
};

export function AdminAnnouncementsClient({ announcements }: { announcements: Announcement[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const startCreate = () => {
    setForm(empty);
    setEditing(null);
    setCreating(true);
  };

  const startEdit = (a: Announcement) => {
    setForm({ title: a.title, excerpt: a.excerpt, body: a.body, category: a.category });
    setEditing(a);
    setCreating(false);
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(empty);
  };

  const save = async () => {
    if (!form.title || !form.excerpt || !form.body) {
      toast.error("Title, excerpt, and body are required.");
      return;
    }
    setSaving(true);
    try {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
      if (editing) {
        const res = await fetch(`/api/admin/announcements/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed");
        toast.success("Announcement updated");
      } else {
        const res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, slug }),
        });
        if (!res.ok) throw new Error("Failed");
        toast.success("Announcement created");
      }
      cancel();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (a: Announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: !a.isPublished,
          publishedAt: !a.isPublished ? new Date().toISOString() : a.publishedAt,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(a.isPublished ? "Unpublished" : "Published");
      router.refresh();
    } catch {
      toast.error("Failed");
    }
  };

  const togglePin = async (a: Announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !a.isPinned }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(a.isPinned ? "Unpinned" : "Pinned");
      router.refresh();
    } catch {
      toast.error("Failed");
    }
  };

  const remove = async (a: Announcement) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/announcements/${a.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Deleted");
      router.refresh();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-foreground/70 mt-1">{announcements.length} total · {announcements.filter((a) => a.isPublished).length} published</p>
        </div>
        <Button onClick={startCreate} className="bg-forest hover:bg-forest-light text-cream">
          <Plus className="mr-1.5 h-4 w-4" />New announcement
        </Button>
      </div>

      {(creating || editing) && (
        <div className="rounded-2xl border border-forest/30 bg-card p-6 mb-6 shadow-warm">
          <h2 className="font-display text-lg font-bold text-forest mb-4">
            {editing ? "Edit announcement" : "New announcement"}
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nominations open for the 2026 cycle" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">Excerpt</Label>
              <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="One-sentence summary for cards and previews" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">Body (Markdown)</Label>
              <Textarea rows={10} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder={"## Heading\n\nBody in markdown…"} className="font-mono text-sm" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-foreground/80 font-semibold mb-1.5 block">Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="news">News</option>
                <option value="update">Update</option>
                <option value="deadline">Deadline</option>
                <option value="ceremony">Ceremony</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={saving} className="bg-forest hover:bg-forest-light text-cream">
                {saving ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Saving…</> : (editing ? "Update" : "Create")}
              </Button>
              <Button variant="ghost" onClick={cancel}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {announcements.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl">
            No announcements yet. Click "New announcement" to create the first.
          </div>
        )}
        {announcements.map((a) => (
          <div key={a.id} className="rounded-2xl border border-forest/15 bg-card p-5 shadow-warm">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                    a.isPublished ? "bg-forest/10 text-forest ring-1 ring-forest/30" : "bg-muted text-muted-foreground"
                  }`}>
                    {a.isPublished ? "Published" : "Draft"}
                  </span>
                  {a.isPinned && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-gold/15 text-gold ring-1 ring-gold/40">
                      <Pin className="h-3 w-3 inline mr-0.5" />Pinned
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-secondary text-foreground/70">
                    {a.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">/{a.slug}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-forest">{a.title}</h3>
                <p className="text-sm text-foreground/70 mt-1">{a.excerpt}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  {a.publishedAt ? `Published ${new Date(a.publishedAt).toLocaleDateString()}` : "Not yet published"}
                  {" · "}Updated {new Date(a.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="ghost" onClick={() => startEdit(a)} className="justify-start h-7">
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => togglePublish(a)} className="justify-start h-7">
                  {a.isPublished ? <><EyeOff className="h-3.5 w-3.5 mr-1.5" />Unpublish</> : <><Eye className="h-3.5 w-3.5 mr-1.5" />Publish</>}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => togglePin(a)} className="justify-start h-7">
                  <Pin className={`h-3.5 w-3.5 mr-1.5 ${a.isPinned ? "text-gold" : ""}`} />{a.isPinned ? "Unpin" : "Pin"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(a)} className="justify-start h-7 text-terracotta hover:text-terracotta">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
