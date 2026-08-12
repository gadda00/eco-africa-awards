import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.name || !body?.email || !body?.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const email = String(body.email).toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const validCategories = ["general", "partnership", "press", "nominate-help", "other"];
    const category = validCategories.includes(body.category) ? body.category : "general";

    const msg = await db.contactMessage.create({
      data: {
        name: body.name,
        email,
        subject: body.subject ?? "(no subject)",
        message: body.message,
        organization: body.organization ?? null,
        category,
        status: "new",
      },
    });

    return NextResponse.json({ ok: true, id: msg.id });
  } catch (e: any) {
    console.error("Contact error:", e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
