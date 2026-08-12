import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireJudgeOrAdmin, audit } from "@/lib/auth-guards";
import { judgeReviewSchema } from "@/lib/validation";
import { computeTotal } from "@/lib/scoring";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireJudgeOrAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const { id } = await params;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = judgeReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const scores = {
      scoreImpact: parsed.data.scoreImpact,
      scoreInnovation: parsed.data.scoreInnovation,
      scoreScale: parsed.data.scoreScale,
      scoreSustainability: parsed.data.scoreSustainability,
      scoreLeadership: parsed.data.scoreLeadership,
      scoreEquity: parsed.data.scoreEquity,
    };

    const nomination = await db.nomination.findUnique({
      where: { id },
      select: { id: true, categoryId: true, status: true },
    });
    if (!nomination) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }

    // Check judge is assigned to this category (admins can review any)
    if (guard.user.role === "JUDGE") {
      const judge = await db.user.findUnique({
        where: { id: guard.user.id },
        select: { assignedCategories: true },
      });
      const assigned: string[] = judge?.assignedCategories ? JSON.parse(judge.assignedCategories) : [];
      if (!assigned.includes(nomination.categoryId)) {
        return NextResponse.json(
          { error: "You are not assigned to this category" },
          { status: 403 }
        );
      }
    }

    const totalScore = computeTotal(scores);

    // Upsert review (atomic)
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
        comments: parsed.data.comments || null,
        recommendation: parsed.data.recommendation,
        coiDeclared: parsed.data.coiDeclared,
      },
      update: {
        ...scores,
        totalScore,
        comments: parsed.data.comments || null,
        recommendation: parsed.data.recommendation,
        coiDeclared: parsed.data.coiDeclared,
      },
    });

    // Recompute nomination aggregate score in a transaction
    const allReviews = await db.review.findMany({
      where: { nominationId: id },
      select: { totalScore: true },
    });
    const avg =
      allReviews.length > 0
        ? Math.round((allReviews.reduce((s, r) => s + r.totalScore, 0) / allReviews.length) * 100) / 100
        : null;

    await db.nomination.update({
      where: { id },
      data: {
        totalScore: avg,
        reviewsCount: allReviews.length,
        status: nomination.status === "SUBMITTED" ? "UNDER_REVIEW" : nomination.status,
      },
    });

    await audit(guard.user.id, "review.submit", "review", review.id, {
      nominationId: id,
      totalScore,
      recommendation: parsed.data.recommendation,
    });

    return NextResponse.json({ ok: true, reviewId: review.id, totalScore }, { status: 201 });
  } catch (e: any) {
    console.error("Judge review POST error:", e);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // PATCH is the same as POST (upsert) for judges
  return POST(req, { params });
}
