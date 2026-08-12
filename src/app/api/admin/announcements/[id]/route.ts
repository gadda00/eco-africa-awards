import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { updateAnnouncementSchema } from "@/lib/validation";

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

    const parsed = updateAnnouncementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const updates = parsed.data;

    const existing = await db.announcement.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    const prismaUpdate: any = {};
    for (const [k, v] of Object.entries(updates)) {
      if (k === "publishedAt") {
        prismaUpdate.publishedAt = v ? new Date(v) : null;
      } else if (v !== undefined) {
        prismaUpdate[k] = v;
      }
    }

    await db.announcement.update({
      where: { id },
      data: prismaUpdate,
    });
    await audit(guard.user.id, "announcement.update", "announcement", id, prismaUpdate);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
    console.error("Announcement PATCH error:", e);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
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

    const existing = await db.announcement.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    await db.announcement.delete({ where: { id } });
    await audit(guard.user.id, "announcement.delete", "announcement", id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Announcement DELETE error:", e);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
