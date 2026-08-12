import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { updateJudgeSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status });

  try {
    const { id } = await params;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = updateJudgeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const updates = parsed.data;

    // Build Prisma update payload
    const prismaUpdate: any = {};
    if (typeof updates.isActive === "boolean") prismaUpdate.isActive = updates.isActive;
    if (typeof updates.name === "string") prismaUpdate.name = updates.name;
    if (typeof updates.title === "string") prismaUpdate.title = updates.title;
    if (typeof updates.organization === "string") prismaUpdate.organization = updates.organization;
    if (typeof updates.country === "string") prismaUpdate.country = updates.country;
    if (Array.isArray(updates.expertise)) prismaUpdate.expertise = JSON.stringify(updates.expertise);
    if (Array.isArray(updates.assignedCategories))
      prismaUpdate.assignedCategories = JSON.stringify(updates.assignedCategories);

    // Fetch prior role for audit (in case role changes are added in future)
    const existing = await db.user.findUnique({
      where: { id },
      select: { role: true, email: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.user.update({
      where: { id },
      data: prismaUpdate,
    });

    await audit(guard.user.id, "judge.update", "user", id, {
      ...prismaUpdate,
      previousRole: existing.role,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Judge PATCH error:", e);
    return NextResponse.json({ error: "Failed to update judge" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status });

  try {
    const { id } = await params;

    // Don't actually delete if they have reviews — just deactivate (foreign-key safety)
    const reviewsCount = await db.review.count({ where: { judgeId: id } });
    if (reviewsCount > 0) {
      await db.user.update({
        where: { id },
        data: { isActive: false },
      });
      await audit(guard.user.id, "judge.deactivate", "user", id, { reason: "had reviews" });
      return NextResponse.json({ ok: true, deactivated: true });
    }

    try {
      await db.user.delete({ where: { id } });
      await audit(guard.user.id, "judge.delete", "user", id);
      return NextResponse.json({ ok: true, deleted: true });
    } catch (e: any) {
      // Foreign-key constraint violation (P2003) — fall back to deactivate
      if (e?.code === "P2003") {
        await db.user.update({ where: { id }, data: { isActive: false } });
        await audit(guard.user.id, "judge.deactivate", "user", id, { reason: "FK constraint" });
        return NextResponse.json({ ok: true, deactivated: true });
      }
      throw e;
    }
  } catch (e: any) {
    console.error("Judge DELETE error:", e);
    return NextResponse.json({ error: "Failed to delete judge" }, { status: 500 });
  }
}
