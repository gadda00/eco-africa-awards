import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { registrationStatusSchema } from "@/lib/validation";

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

    const parsed = registrationStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { status } = parsed.data;

    const existing = await db.registration.findUnique({ where: { id }, select: { id: true, status: true } });
    if (!existing) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const updated = await db.registration.update({
      where: { id },
      data: { status },
    });
    await audit(guard.user.id, "registration.status_change", "registration", id, {
      from: existing.status,
      to: status,
    });
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (e: any) {
    console.error("Registration PATCH error:", e);
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}
