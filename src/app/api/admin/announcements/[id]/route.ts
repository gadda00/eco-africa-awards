import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status });

  try {
    const body = await req.json();
    const updates: any = {};
    for (const k of ["title", "slug", "excerpt", "body", "category"]) {
      if (typeof body[k] === "string") updates[k] = body[k];
    }
    if (typeof body.isPublished === "boolean") updates.isPublished = body.isPublished;
    if (typeof body.isPinned === "boolean") updates.isPinned = body.isPinned;
    if (body.publishedAt !== undefined) {
      updates.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    }

    const updated = await db.announcement.update({
      where: { id: id },
      data: updates,
    });
    await audit(guard.user.id, "announcement.update", "announcement", id, updates);
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
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status });

  try {
    await db.announcement.delete({ where: { id: id } });
    await audit(guard.user.id, "announcement.delete", "announcement", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
