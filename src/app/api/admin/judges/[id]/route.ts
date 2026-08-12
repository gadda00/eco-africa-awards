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
    const updates: any = {};
    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;
    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.title === "string") updates.title = body.title;
    if (typeof body.organization === "string") updates.organization = body.organization;
    if (typeof body.country === "string") updates.country = body.country;
    if (Array.isArray(body.expertise)) updates.expertise = JSON.stringify(body.expertise);
    if (Array.isArray(body.assignedCategories)) updates.assignedCategories = JSON.stringify(body.assignedCategories);

    const updated = await db.user.update({
      where: { id: id },
      data: updates,
    });

    await audit(guard.user.id, "judge.update", "user", id, updates);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
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
    // Don't actually delete if they have reviews - just deactivate
    const reviewsCount = await db.review.count({ where: { judgeId: id } });
    if (reviewsCount > 0) {
      await db.user.update({
        where: { id: id },
        data: { isActive: false },
      });
      await audit(guard.user.id, "judge.deactivate", "user", id, { reason: "had reviews" });
      return NextResponse.json({ ok: true, deactivated: true });
    }

    await db.user.delete({ where: { id: id } });
    await audit(guard.user.id, "judge.delete", "user", id);
    return NextResponse.json({ ok: true, deleted: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
