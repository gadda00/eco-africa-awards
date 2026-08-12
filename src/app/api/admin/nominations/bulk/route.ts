import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    const body = await req.json();
    const { ids, action } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
    }

    if (action === "setStatus") {
      const { status } = body;
      const valid = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "FINALIST", "WINNER", "NOT_SELECTED"];
      if (!valid.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      // Fetch current state for audit
      const current = await db.nomination.findMany({
        where: { id: { in: ids } },
        select: { id: true, status: true },
      });

      // Update all
      const result = await db.nomination.updateMany({
        where: { id: { in: ids } },
        data: { status },
      });

      // Create status change records for those whose status actually changed
      const changes = current.filter((c) => c.status !== status);
      if (changes.length > 0) {
        await db.statusChange.createMany({
          data: changes.map((c) => ({
            nominationId: c.id,
            changedById: guard.user.id,
            fromStatus: c.status,
            toStatus: status,
          })),
        });
      }

      await audit(guard.user.id, "nomination.bulk_status_change", "nomination", null, {
        count: result.count,
        from_statuses: changes.map((c) => c.status),
        to: status,
      });

      return NextResponse.json({ ok: true, updated: result.count });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    console.error("Admin bulk action error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
