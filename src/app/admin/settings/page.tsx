import { db } from "@/lib/db";
import { AdminSettingsClient } from "@/components/admin/settings-list";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, recentAudit] = await Promise.all([
    db.siteSetting.findMany({ orderBy: { key: "asc" } }),
    db.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <AdminSettingsClient
      settings={settings}
      audit={recentAudit.map((a) => ({
        id: a.id,
        action: a.action,
        entity: a.entity,
        entityId: a.entityId,
        metadata: a.metadata,
        createdAt: a.createdAt.toISOString(),
        user: a.user ? { name: a.user.name, email: a.user.email } : null,
      }))}
    />
  );
}
