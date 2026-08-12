import { db } from "@/lib/db";
import { AdminMessagesClient } from "@/components/admin/messages-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const sp = (k: string) => {
    const v = resolved[k];
    if (Array.isArray(v)) return v[0] || "";
    return v || "";
  };
  const filters = { status: sp("status"), category: sp("category"), q: sp("q") };
  const page = Math.max(1, parseInt(sp("page") || "1", 10));

  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { email: { contains: filters.q } },
      { subject: { contains: filters.q } },
      { message: { contains: filters.q } },
    ];
  }

  const [messages, totalCount, newCount] = await Promise.all([
    db.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.contactMessage.count({ where }),
    db.contactMessage.count({ where: { status: "new" } }),
  ]);

  return (
    <AdminMessagesClient
      messages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
      totalCount={totalCount}
      newCount={newCount}
      page={page}
      pageSize={PAGE_SIZE}
      filters={filters}
    />
  );
}
