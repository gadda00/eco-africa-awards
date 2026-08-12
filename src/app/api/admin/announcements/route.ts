import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, audit } from "@/lib/auth-guards";
import { createAnnouncementSchema } from "@/lib/validation";

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

    const parsed = createAnnouncementSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { title, slug, excerpt, body: bodyText, category, isPublished, isPinned } = parsed.data;

    // Use upsert to handle TOCTOU race on duplicate slug
    try {
      const ann = await db.announcement.create({
        data: {
          title,
          slug,
          excerpt,
          body: bodyText,
          category,
          isPublished,
          isPinned,
          publishedAt: isPublished ? new Date() : null,
        },
      });
      await audit(guard.user.id, "announcement.create", "announcement", ann.id, { slug });
      return NextResponse.json({ ok: true, id: ann.id }, { status: 201 });
    } catch (e: any) {
      // P2002 = unique constraint violation (slug already in use)
      if (e?.code === "P2002") {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
      throw e;
    }
  } catch (e: any) {
    console.error("Announcement create error:", e);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
