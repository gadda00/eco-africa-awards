import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

function generateRef(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}-${ts}${rand}`;
}

export async function POST(req: NextRequest) {
  const limited = applyRateLimit(req, RATE_LIMITS.form, "register");
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

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message ?? "Validation failed", field: firstError?.path.join(".") },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const email = data.email.toLowerCase().trim();

    const referenceCode = generateRef("EAC"); // Eco Africa Ceremony

    const reg = await db.registration.create({
      data: {
        referenceCode,
        fullName: data.fullName,
        email,
        phone: data.phone ?? null,
        organization: data.organization ?? null,
        role: data.role ?? null,
        country: data.country,
        ticketType: data.ticketType,
        dietary: data.dietary ?? null,
        accessibility: data.accessibility ?? null,
        agreesTerms: data.agreesTerms,
        newsletter: data.newsletter,
      },
    });

    if (data.newsletter) {
      try {
        await db.newsletterSubscriber.upsert({
          where: { email },
          create: { email, name: data.fullName, source: "ceremony" },
          update: {},
        });
      } catch {
        /* no-op — newsletter is best-effort */
      }
    }

    return NextResponse.json(
      { ok: true, referenceCode: reg.referenceCode },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Register error:", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
