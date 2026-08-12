import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validation";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, RATE_LIMITS.form, "newsletter");
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

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const email = data.email.toLowerCase().trim();

    await db.newsletterSubscriber.upsert({
      where: { email },
      create: { email, name: data.name ?? null, source: "site" },
      update: {},
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    console.error("Newsletter error:", e);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
