import Link from "next/link";
import { db } from "@/lib/db";
import { awardCategories } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { safeJsonArray } from "@/lib/safe-json";
import { StatTile } from "@/components/admin/stat-tile";

export const dynamic = "force-dynamic";

export default async function JudgeDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();
  const judgeId = session.user.id;

  // Fetch the judge's assigned categories
  const judge = await db.user.findUnique({
    where: { id: judgeId },
    select: { assignedCategories: true, name: true, title: true, organization: true },
  });
  if (!judge) notFound();

  const assignedCategoryIds: string[] = safeJsonArray<string>(judge.assignedCategories);

  // Nominations in assigned categories
  const allNominations = await db.nomination.findMany({
    where: {
      categoryId: { in: assignedCategoryIds },
      status: { in: ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "FINALIST"] },
    },
    select: {
      id: true,
      referenceCode: true,
      nomineeName: true,
      nomineeCountry: true,
      categoryId: true,
      status: true,
      summary: true,
      createdAt: true,
      reviews: {
        where: { judgeId },
        select: { id: true, totalScore: true, recommendation: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const reviewed = allNominations.filter((n) => n.reviews.length > 0);
  const pending = allNominations.filter((n) => n.reviews.length === 0);

  const avgScore =
    reviewed.length > 0
      ? reviewed.reduce((s, n) => s + (n.reviews[0]?.totalScore ?? 0), 0) / reviewed.length
      : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-forest">
          Welcome, {judge.name?.split(" ")[0] ?? "Judge"}
        </h1>
        <p className="text-foreground/70 mt-1">
          {[judge.title, judge.organization].filter(Boolean).join(" · ") || "Continental judging panel"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile label="Assigned" value={allNominations.length} icon={FileText} accent="forest" />
        <StatTile label="Pending review" value={pending.length} icon={Clock} accent="gold" />
        <StatTile label="Reviewed" value={reviewed.length} icon={CheckCircle2} accent="savanna" />
        <StatTile label="Avg score given" value={avgScore.toFixed(1)} icon={AlertCircle} accent="terracotta" />
      </div>

      {/* Pending */}
      <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm mb-4">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-forest">
            Pending review ({pending.length})
          </h2>
          <Link href="/judge/nominations" className="text-xs font-semibold text-forest hover:text-gold">
            View all assignments →
          </Link>
        </div>
        {pending.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto text-forest mb-2" />
            All caught up — no pending reviews.
          </div>
        ) : (
          <div className="space-y-2">
            {pending.slice(0, 8).map((n) => {
              const cat = awardCategories.find((c) => c.id === n.categoryId);
              return (
                <Link
                  key={n.id}
                  href={`/judge/nominations/${n.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-gold/15 grid place-items-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-gold" />
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
                      {new Date(n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviewed */}
      <div className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
        <h2 className="font-display text-lg font-bold text-forest mb-4">
          Your reviews ({reviewed.length})
        </h2>
        {reviewed.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No reviews submitted yet.
          </div>
        ) : (
          <div className="space-y-2">
            {reviewed.map((n) => {
              const cat = awardCategories.find((c) => c.id === n.categoryId);
              const review = n.reviews[0];
              return (
                <Link
                  key={n.id}
                  href={`/judge/nominations/${n.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-forest/10 grid place-items-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-forest" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm truncate">{n.nomineeName}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {cat?.shortName ?? n.categoryId} · {n.nomineeCountry}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-display text-lg font-bold text-forest tabular-nums">
                      {review?.totalScore.toFixed(1)}
                    </div>
                    {review?.recommendation && (
                      <div className="text-[10px] text-muted-foreground">{review.recommendation}</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

