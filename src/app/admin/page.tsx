import Link from "next/link";
import { db } from "@/lib/db";
import { awardCategories } from "@/lib/data";
import {
  FileText,
  Users,
  CalendarCheck,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { CategoryDistributionChart, StatusDistributionChart, TimeSeriesChart } from "@/components/admin/charts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    nominationsCount,
    registrationsCount,
    messagesCount,
    judgesCount,
    activeAnnouncements,
    nominationsByStatus,
    nominationsByCategory,
    nominationsByCountry,
    recentNominations,
    recentRegistrations,
    dailyNominations,
  ] = await Promise.all([
    db.nomination.count(),
    db.registration.count(),
    db.contactMessage.count({ where: { status: "new" } }),
    db.user.count({ where: { role: "JUDGE", isActive: true } }),
    db.announcement.count({ where: { isPublished: true } }),
    db.nomination.groupBy({ by: ["status"], _count: true }),
    db.nomination.groupBy({ by: ["categoryId"], _count: true }),
    db.nomination.groupBy({ by: ["nomineeCountry"], _count: true, orderBy: { _count: { nomineeCountry: "desc" } }, take: 8 }),
    db.nomination.findMany({ take: 6, orderBy: { createdAt: "desc" }, select: { id: true, referenceCode: true, nomineeName: true, nomineeCountry: true, categoryId: true, status: true, createdAt: true } }),
    db.registration.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, referenceCode: true, fullName: true, country: true, ticketType: true, createdAt: true } }),
    (async () => {
      const rows = await db.nomination.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) } },
        select: { createdAt: true },
      });
      const map: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        map[key] = 0;
      }
      rows.forEach((r) => {
        const key = r.createdAt.toISOString().slice(0, 10);
        if (key in map) map[key]++;
      });
      return Object.entries(map).map(([date, count]) => ({ date, count }));
    })(),
  ]);

  const shortlistedCount = nominationsByStatus.find((s) => s.status === "SHORTLISTED")?._count ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-forest">Dashboard</h1>
        <p className="text-foreground/70 mt-1">
          Welcome back — here&apos;s what&apos;s happening across the Africa Climate Leadership Awards.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile label="Nominations" value={nominationsCount} icon={FileText} accent="forest" link="/admin/nominations" trend={`${shortlistedCount} shortlisted`} />
        <StatTile label="Registrations" value={registrationsCount} icon={CalendarCheck} accent="gold" link="/admin/registrations" trend="Ceremony attendees" />
        <StatTile label="New Messages" value={messagesCount} icon={MessageSquare} accent="terracotta" link="/admin/messages" trend="Awaiting reply" />
        <StatTile label="Active Judges" value={judgesCount} icon={Users} accent="savanna" link="/admin/judges" trend={`${activeAnnouncements} announcements`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-forest">Nominations by status</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Current workflow distribution</p>
            </div>
            <Link href="/admin/nominations" className="text-xs font-semibold text-forest hover:text-gold inline-flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <StatusDistributionChart data={nominationsByStatus} />
        </div>

        <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-forest">Nominations by category</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Across all 12 categories</p>
            </div>
            <Link href="/admin/nominations" className="text-xs font-semibold text-forest hover:text-gold inline-flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <CategoryDistributionChart data={nominationsByCategory} categories={awardCategories} />
        </div>
      </div>

      <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-forest">Nominations over the last 30 days</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Daily submission volume</p>
          </div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-forest" />
            <span className="tabular-nums font-semibold text-forest">
              {dailyNominations.reduce((s, d) => s + d.count, 0)} total
            </span>
          </div>
        </div>
        <TimeSeriesChart data={dailyNominations} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-forest">Recent nominations</h2>
            <Link href="/admin/nominations" className="text-xs font-semibold text-forest hover:text-gold">View all</Link>
          </div>
          <div className="space-y-2">
            {recentNominations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No nominations yet.</p>
            )}
            {recentNominations.map((n) => {
              const cat = awardCategories.find((c) => c.id === n.categoryId);
              return (
                <Link
                  key={n.id}
                  href={`/admin/nominations/${n.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-forest/10 grid place-items-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-forest" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm truncate">{n.nomineeName}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {cat?.shortName ?? n.categoryId} · {n.nomineeCountry}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <StatusBadge status={n.status} />
                    <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                      {n.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-forest">Recent registrations</h2>
            <Link href="/admin/registrations" className="text-xs font-semibold text-forest hover:text-gold">View all</Link>
          </div>
          <div className="space-y-2">
            {recentRegistrations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No registrations yet.</p>
            )}
            {recentRegistrations.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-gold/15 grid place-items-center flex-shrink-0">
                  <CalendarCheck className="h-4 w-4 text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground text-sm truncate">{r.fullName}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.country} · {r.ticketType}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold/15 text-gold">
                    {r.referenceCode}
                  </span>
                  <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                    {r.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm mt-4">
        <h2 className="font-display text-lg font-bold text-forest mb-4">Top countries by nominations</h2>
        <div className="space-y-2">
          {nominationsByCountry.map((c) => {
            const max = nominationsByCountry[0]?._count ?? 1;
            const pct = Math.round((c._count / max) * 100);
            return (
              <div key={c.nomineeCountry} className="flex items-center gap-3">
                <div className="w-40 text-sm text-foreground truncate">{c.nomineeCountry}</div>
                <div className="flex-1 h-7 rounded-lg bg-secondary/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-forest to-gold rounded-lg flex items-center justify-end pr-2 transition-all" style={{ width: `${pct}%` }}>
                    <span className="text-xs font-bold text-cream tabular-nums">{c._count.nomineeCountry}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label, value, icon: Icon, accent, link, trend,
}: {
  label: string;
  value: number;
  icon: any;
  accent: "forest" | "gold" | "terracotta" | "savanna";
  link: string;
  trend?: string;
}) {
  const styles = {
    forest: { bg: "bg-forest/10", text: "text-forest", ring: "ring-forest/30" },
    gold: { bg: "bg-gold/15", text: "text-gold", ring: "ring-gold/40" },
    terracotta: { bg: "bg-terracotta/10", text: "text-terracotta", ring: "ring-terracotta/40" },
    savanna: { bg: "bg-savanna/25", text: "text-terracotta", ring: "ring-savanna/50" },
  }[accent];

  return (
    <Link
      href={link}
      className="group rounded-2xl border border-forest/15 bg-card p-5 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all"
    >
      <div className={`h-10 w-10 rounded-xl ${styles.bg} ${styles.ring} ring-1 grid place-items-center mb-3`}>
        <Icon className={`h-5 w-5 ${styles.text}`} />
      </div>
      <div className="font-display text-3xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {trend && <div className="text-[10px] text-muted-foreground mt-1">{trend}</div>}
    </Link>
  );
}
