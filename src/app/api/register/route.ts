import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function generateRef(prefix: string): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}-${ts}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.fullName || !body?.email || !body?.country || !body?.agreesTerms) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const email = String(body.email).toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const validTickets = ["GENERAL", "VIP", "PRESS", "SPEAKER", "STUDENT"];
    if (!validTickets.includes(body.ticketType)) {
      return NextResponse.json({ error: "Invalid ticket type" }, { status: 400 });
    }

    const referenceCode = generateRef("EAC"); // Eco Africa Ceremony

    const reg = await db.registration.create({
      data: {
        referenceCode,
        fullName: body.fullName,
        email,
        phone: body.phone ?? null,
        organization: body.organization ?? null,
        role: body.role ?? null,
        country: body.country,
        ticketType: body.ticketType,
        dietary: body.dietary ?? null,
        accessibility: body.accessibility ?? null,
        agreesTerms: !!body.agreesTerms,
        newsletter: body.newsletter ?? true,
      },
    });

    if (body.newsletter) {
      try {
        await db.newsletterSubscriber.upsert({
          where: { email },
          create: { email, name: body.fullName, source: "ceremony" },
          update: {},
        });
      } catch {}
    }

    return NextResponse.json({ ok: true, referenceCode: reg.referenceCode });
  } catch (e: any) {
    console.error("Register error:", e);
    return NextResponse.json({ error: e?.message ?? "Registration failed" }, { status: 500 });
  }
}
