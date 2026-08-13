import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { bulkNominationSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.message }, { status: guard.status });
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = bulkNominationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { ids, action, status } = parsed.data;

    if (action === "setStatus") {
      // Fetch current state for audit + status change records (transaction-safe)
      const current = await db.nomination.findMany({
        where: { id: { in: ids } },
        select: { id: true, status: true },
      });

      if (current.length === 0) {
        return NextResponse.json({ error: "No matching nominations found" }, { status: 404 });
      }

      const changes = current.filter((c) => c.status !== status);

      // Transaction: update all + create status change records for those that changed
      const [updateResult] = await db.$transaction([
        db.nomination.updateMany({
          where: { id: { in: ids } },
          data: { status },
        }),
        ...(changes.length > 0
          ? [
              db.statusChange.createMany({
                data: changes.map((c) => ({
                  nominationId: c.id,
                  changedById: guard.user.id,
                  fromStatus: c.status,
                  toStatus: status,
                })),
              }),
            ]
          : []),
      ]);

      await audit(guard.user.id, "nomination.bulk_status_change", "nomination", undefined, {
        count: updateResult.count,
        from_statuses: changes.map((c) => c.status),
        to: status,
        ids,
      });

      return NextResponse.json({ ok: true, updated: updateResult.count });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    console.error("Admin bulk action error:", e);
    return NextResponse.json({ error: "Bulk update failed" }, { status: 500 });
  }
}
