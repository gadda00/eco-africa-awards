import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const body = await req.json();
    const { action } = body;
    const nomination = await db.nomination.findUnique({ where: { id: id } });
    if (!nomination) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }

    if (action === "status") {
      const { status, reason } = body;
      const valid = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "FINALIST", "WINNER", "NOT_SELECTED"];
      if (!valid.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      const fromStatus = nomination.status;
      const updated = await db.nomination.update({
        where: { id: id },
        data: { status, statusReason: reason || null },
      });
      if (fromStatus !== status) {
        await db.statusChange.create({
          data: {
            nominationId: id,
            changedById: guard.user.id,
            fromStatus,
            toStatus: status,
            reason: reason || null,
          },
        });
        await audit(guard.user.id, "nomination.status_change", "nomination", id, { from: fromStatus, to: status, reason });
      }
      return NextResponse.json({ ok: true, status: updated.status });
    }

    if (action === "winner") {
      const { winnerYear, winnerHighlight, winnerStory, winnerPhotoUrl, isPublic } = body;
      const updated = await db.nomination.update({
        where: { id: id },
        data: {
          winnerYear: winnerYear ?? null,
          winnerHighlight: winnerHighlight || null,
          winnerStory: winnerStory || null,
          winnerPhotoUrl: winnerPhotoUrl || null,
          isPublic: !!isPublic,
        },
      });
      await audit(guard.user.id, "nomination.update_winner", "nomination", id, {
        winnerYear, isPublic,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    console.error("Admin nomination PATCH error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }
  try {
    await db.nomination.delete({ where: { id: id } });
    await audit(guard.user.id, "nomination.delete", "nomination", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
