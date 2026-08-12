import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { NominationDetailClient } from "@/components/admin/nomination-detail";

export const dynamic = "force-dynamic";

export default async function NominationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nomination = await db.nomination.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { judge: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
      statusChanges: {
        include: { changedBy: { select: { name: true, email: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!nomination) notFound();

  // Flatten for the client component (avoid Date serialization issues)
  const flat = {
    ...nomination,
    reviews: nomination.reviews.map((r) => ({
      id: r.id,
      judgeId: r.judgeId,
      judgeName: r.judge.name ?? r.judgeId,
      scoreImpact: r.scoreImpact,
      scoreInnovation: r.scoreInnovation,
      scoreScale: r.scoreScale,
      scoreSustainability: r.scoreSustainability,
      scoreLeadership: r.scoreLeadership,
      scoreEquity: r.scoreEquity,
      totalScore: r.totalScore,
      comments: r.comments,
      recommendation: r.recommendation,
      createdAt: r.createdAt.toISOString(),
    })),
    statusChanges: nomination.statusChanges.map((c) => ({
      id: c.id,
      fromStatus: c.fromStatus,
      toStatus: c.toStatus,
      reason: c.reason,
      createdAt: c.createdAt.toISOString(),
      changedBy: c.changedBy ? { name: c.changedBy.name, email: c.changedBy.email } : null,
    })),
    createdAt: nomination.createdAt.toISOString(),
    updatedAt: nomination.updatedAt.toISOString(),
    submittedAt: nomination.submittedAt?.toISOString() ?? null,
  };

  return <NominationDetailClient nomination={flat as any} />;
}
