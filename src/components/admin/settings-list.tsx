"use client";

import { Activity, Settings, Database } from "lucide-react";

type Setting = { id: string; key: string; value: string; updatedAt: string };
type AuditEntry = {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  metadata: string | null;
  createdAt: string;
  user: { name: string | null; email: string } | null;
};

export function AdminSettingsClient({ settings, audit }: { settings: Setting[]; audit: AuditEntry[] }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70 mt-1">Platform configuration & recent activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site settings */}
        <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
          <h2 className="font-display text-lg font-bold text-forest mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />Site settings
          </h2>
          <div className="space-y-2">
            {settings.map((s) => (
              <div key={s.id} className="flex items-baseline justify-between gap-3 p-3 rounded-lg bg-secondary/40">
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {s.key}
                  </div>
                  <div className="text-sm text-foreground truncate">{s.value}</div>
                </div>
                <div className="text-[10px] text-muted-foreground tabular-nums flex-shrink-0">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg border border-gold/30 bg-gold/5 text-xs text-foreground/70">
            Settings are stored in the database and editable via <code className="bg-secondary/60 px-1 py-0.5 rounded">scripts/seed.ts</code> or programmatically.
          </div>
        </div>

        {/* Audit log */}
        <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
          <h2 className="font-display text-lg font-bold text-forest mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />Recent activity
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-warm">
            {audit.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No activity yet.</p>
            )}
            {audit.map((a) => (
              <div key={a.id} className="p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-mono text-forest">{a.action}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-foreground/70 mt-0.5">
                  {a.user?.name ?? a.user?.email ?? "system"}
                  {a.entity && <> · <span className="text-muted-foreground">{a.entity}</span></>}
                  {a.entityId && <> · <span className="font-mono text-[10px]">{a.entityId.slice(-8)}</span></>}
                </div>
                {a.metadata && (
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono truncate">
                    {a.metadata.slice(0, 100)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Database info */}
      <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm mt-6">
        <h2 className="font-display text-lg font-bold text-forest mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />Database
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <Info label="Provider" value="SQLite (dev) / Postgres (prod)" />
          <Info label="Schema" value="prisma/schema.prisma" />
          <Info label="Migrations" value="bun run db:push" />
        </div>
        <div className="mt-4 p-3 rounded-lg border border-terracotta/30 bg-terracotta/5 text-xs text-foreground/80">
          <strong className="text-terracotta">Production:</strong> Set <code className="bg-secondary/60 px-1 py-0.5 rounded">DATABASE_URL</code> to a Postgres connection string in Netlify env vars,
          change the provider in <code className="bg-secondary/60 px-1 py-0.5 rounded">schema.prisma</code> from <code>sqlite</code> to <code>postgresql</code>, then run <code className="bg-secondary/60 px-1 py-0.5 rounded">bun run db:push</code> and <code className="bg-secondary/60 px-1 py-0.5 rounded">bun run seed</code> locally.
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/40">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className="text-sm text-foreground mt-0.5">{value}</div>
    </div>
  );
}
