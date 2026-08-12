import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JudgeScoringClient } from "@/components/admin/judge-scoring";

export const dynamic = "force-dynamic";

export default async function JudgeNominationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();

  const nomination = await db.nomination.findUnique({
    where: { id },
    select: {
      id: true,
      referenceCode: true,
      categoryId: true,
      nomineeName: true,
      nomineeTitle: true,
      nomineeOrg: true,
      nomineeCountry: true,
      nomineeEmail: true,
      nomineeWebsite: true,
      summary: true,
      justification: true,
      impactMetrics: true,
      supportingLinks: true,
      status: true,
      createdAt: true,
      reviews: {
        where: { judgeId: session.user.id },
        select: {
          id: true,
          scoreImpact: true,
          scoreInnovation: true,
          scoreScale: true,
          scoreSustainability: true,
          scoreLeadership: true,
          scoreEquity: true,
          totalScore: true,
          comments: true,
          recommendation: true,
          coiDeclared: true,
        },
      },
    },
  });

  if (!nomination) notFound();

  const flat = {
    ...nomination,
    createdAt: nomination.createdAt.toISOString(),
    myExistingReview: nomination.reviews[0] ?? null,
  };

  return <JudgeScoringClient nomination={flat as any} />;
}
