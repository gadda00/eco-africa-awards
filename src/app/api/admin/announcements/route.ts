import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status });

  try {
    const body = await req.json();
    const { title, slug, excerpt, body: bodyText, category, isPublished, isPinned } = body;
    if (!title || !slug || !excerpt || !bodyText) {
      return NextResponse.json({ error: "title, slug, excerpt, and body are required" }, { status: 400 });
    }
    const existing = await db.announcement.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

    const ann = await db.announcement.create({
      data: {
        title, slug, excerpt, body: bodyText,
        category: category || "news",
        isPublished: !!isPublished,
        isPinned: !!isPinned,
        publishedAt: isPublished ? new Date() : null,
      },
    });
    await audit(guard.user.id, "announcement.create", "announcement", ann.id, { slug });
    return NextResponse.json({ ok: true, id: ann.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
