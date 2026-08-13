import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { nominationStatusSchema, nominationWinnerSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
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

    // Discriminate by `action` field
    if (body && typeof body === "object" && "action" in body && body.action === "status") {
      const parsed = nominationStatusSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Validation failed" },
          { status: 400 }
        );
      }
      const { status, reason } = parsed.data;

      const nomination = await db.nomination.findUnique({
        where: { id },
        select: { id: true, status: true },
      });
      if (!nomination) {
        return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
      }

      const fromStatus = nomination.status;
      if (fromStatus === status) {
        return NextResponse.json({ ok: true, status, message: "No change" });
      }

      // Transaction: update + status change record + audit
      const [, statusChange] = await db.$transaction([
        db.nomination.update({
          where: { id },
          data: { status, statusReason: reason || null },
        }),
        db.statusChange.create({
          data: {
            nominationId: id,
            changedById: guard.user.id,
            fromStatus,
            toStatus: status,
            reason: reason || null,
          },
        }),
      ]);

      await audit(guard.user.id, "nomination.status_change", "nomination", id, {
        from: fromStatus,
        to: status,
        reason,
        statusChangeId: statusChange.id,
      });

      return NextResponse.json({ ok: true, status });
    }

    if (body && typeof body === "object" && "action" in body && body.action === "winner") {
      const parsed = nominationWinnerSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Validation failed" },
          { status: 400 }
        );
      }
      const { winnerYear, winnerHighlight, winnerStory, winnerPhotoUrl, isPublic } = parsed.data;

      const existing = await db.nomination.findUnique({ where: { id }, select: { id: true } });
      if (!existing) {
        return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
      }

      await db.nomination.update({
        where: { id },
        data: {
          winnerYear: winnerYear ?? null,
          winnerHighlight: winnerHighlight || null,
          winnerStory: winnerStory || null,
          winnerPhotoUrl: winnerPhotoUrl || null,
          isPublic: !!isPublic,
        },
      });

      await audit(guard.user.id, "nomination.update_winner", "nomination", id, {
        winnerYear,
        isPublic,
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    console.error("Admin nomination PATCH error:", e);
    return NextResponse.json({ error: "Failed to update nomination" }, { status: 500 });
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
    const { id } = await params;

    const existing = await db.nomination.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
    }

    await db.nomination.delete({ where: { id } });
    await audit(guard.user.id, "nomination.delete", "nomination", id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Admin nomination DELETE error:", e);
    return NextResponse.json({ error: "Failed to delete nomination" }, { status: 500 });
  }
}
