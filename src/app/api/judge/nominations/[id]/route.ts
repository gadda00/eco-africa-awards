import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireJudgeOrAdmin, audit } from "@/lib/auth-guards";
import { awardCategories } from "@/lib/data";

const CRITERIA_WEIGHTS = {
  scoreImpact: 0.25,
  scoreInnovation: 0.18,
  scoreScale: 0.17,
  scoreSustainability: 0.15,
  scoreLeadership: 0.15,
  scoreEquity: 0.10,
} as const;

function computeTotal(scores: Record<string, number>): number {
  // Each criterion scored 0-10, weighted, result on 0-10 scale.
  // weighted_avg = sum(score_i * weight_i) / sum(weight_i)
  // weights sum to 1, so result is naturally on 0-10 scale (since each score is 0-10).
  const total = Object.entries(CRITERIA_WEIGHTS).reduce((sum, [key, weight]) => {
    return sum + (scores[key] ?? 0) * weight;
  }, 0);
  return Math.round(total * 10) / 10; // 0-10 with one decimal
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await requireJudgeOrAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const body = await req.json();
    const {
      scoreImpact, scoreInnovation, scoreScale, scoreSustainability,
      scoreLeadership, scoreEquity, comments, recommendation, coiDeclared,
    } = body;

    // Validate scores
    const scores = { scoreImpact, scoreInnovation, scoreScale, scoreSustainability, scoreLeadership, scoreEquity };
    for (const [k, v] of Object.entries(scores)) {
      const n = parseInt(String(v), 10);
      if (isNaN(n) || n < 0 || n > 10) {
        return NextResponse.json({ error: `${k} must be an integer 0-10` }, { status: 400 });
      }
      scores[k as keyof typeof scores] = n as any;
    }

    if (!["SELECT", "SHORTLIST", "DECLINE"].includes(recommendation)) {
      return NextResponse.json({ error: "Invalid recommendation" }, { status: 400 });
    }
    if (!coiDeclared) {
      return NextResponse.json({ error: "COI declaration required" }, { status: 400 });
    }

    const nomination = await db.nomination.findUnique({ where: { id: id } });
    if (!nomination) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }

    // Check judge is assigned to this category (admins can review any)
    if (guard.user.role === "JUDGE") {
      const judge = await db.user.findUnique({
        where: { id: guard.user.id },
        select: { assignedCategories: true },
      });
      const assigned: string[] = judge?.assignedCategories
        ? JSON.parse(judge.assignedCategories)
        : [];
      if (!assigned.includes(nomination.categoryId)) {
        return NextResponse.json({ error: "Not assigned to this category" }, { status: 403 });
      }
    }

    const totalScore = computeTotal(scores);

    // Upsert review
    const review = await db.review.upsert({
      where: {
        nominationId_judgeId: {
          nominationId: id,
          judgeId: guard.user.id,
        },
      },
      create: {
        nominationId: id,
        judgeId: guard.user.id,
        ...scores,
        totalScore,
        comments: comments || null,
        recommendation,
        coiDeclared: !!coiDeclared,
      },
      update: {
        ...scores,
        totalScore,
        comments: comments || null,
        recommendation,
        coiDeclared: !!coiDeclared,
      },
    });

    // Recompute nomination aggregate score
    const allReviews = await db.review.findMany({
      where: { nominationId: id },
      select: { totalScore: true },
    });
    const avg = allReviews.length > 0
      ? Math.round((allReviews.reduce((s, r) => s + r.totalScore, 0) / allReviews.length) * 100) / 100
      : null;

    await db.nomination.update({
      where: { id: id },
      data: {
        totalScore: avg,
        reviewsCount: allReviews.length,
        status: nomination.status === "SUBMITTED" ? "UNDER_REVIEW" : nomination.status,
      },
    });

    await audit(guard.user.id, "review.submit", "review", review.id, {
      nominationId: id,
      totalScore,
      recommendation,
    });

    return NextResponse.json({ ok: true, reviewId: review.id, totalScore });
  } catch (e: any) {
    console.error("Judge review POST error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // PATCH is the same as POST (upsert) for judges
  return POST(req, { params });
}
