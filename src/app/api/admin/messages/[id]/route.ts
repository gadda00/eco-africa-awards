import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { messageStatusSchema } from "@/lib/validation";

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

    const parsed = messageStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { status } = parsed.data;

    const existing = await db.contactMessage.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!existing) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const updated = await db.contactMessage.update({
      where: { id },
      data: { status },
    });
    await audit(guard.user.id, "message.status_change", "contactMessage", id, {
      from: existing.status,
      to: status,
    });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (e: any) {
    console.error("Message PATCH error:", e);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
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

    const existing = await db.contactMessage.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await db.contactMessage.delete({ where: { id } });
    await audit(guard.user.id, "message.delete", "contactMessage", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Message DELETE error:", e);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
