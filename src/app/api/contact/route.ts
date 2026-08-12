import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, RATE_LIMITS.form, "contact");
  if (limited) {
    return NextResponse.json(limited.body, { status: limited.status, headers: limited.headers });
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? "Validation failed", field: firstError?.path.join(".") },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const email = data.email.toLowerCase().trim();

    const msg = await db.contactMessage.create({
      data: {
        name: data.name,
        email,
        subject: data.subject,
        message: data.message,
        organization: data.organization ?? null,
        category: data.category,
        status: "new",
      },
    });

    return NextResponse.json({ ok: true, id: msg.id }, { status: 201 });
  } catch (e: any) {
    console.error("Contact error:", e);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
