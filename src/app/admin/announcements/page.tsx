import { db } from "@/lib/db";
import { AdminAnnouncementsClient } from "@/components/admin/announcements-list";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const announcements = await db.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AdminAnnouncementsClient
      announcements={announcements.map((a) => ({
        ...a,
        publishedAt: a.publishedAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      }))}
    />
  );
}
