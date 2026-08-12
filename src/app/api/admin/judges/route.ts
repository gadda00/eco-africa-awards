import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { createJudgeSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status });

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = createJudgeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { email, name, title, organization, country, expertise, password, assignedCategories } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        name,
        title: title || null,
        organization: organization || null,
        country: country || null,
        expertise: expertise ? JSON.stringify(expertise) : null,
        assignedCategories: assignedCategories ? JSON.stringify(assignedCategories) : null,
        role: "JUDGE",
        passwordHash,
        isActive: true,
      },
    });

    await audit(guard.user.id, "judge.create", "user", user.id, { email: normalizedEmail, name });

    return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
  } catch (e: any) {
    console.error("Judge create error:", e);
    return NextResponse.json({ error: "Failed to create judge" }, { status: 500 });
  }
}
