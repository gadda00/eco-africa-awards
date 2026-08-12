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
    const { status } = body;
    if (!["CONFIRMED", "CHECKED_IN", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await db.registration.update({
      where: { id: id },
      data: { status },
    });
    await audit(guard.user.id, "registration.status_change", "registration", id, { to: status });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
