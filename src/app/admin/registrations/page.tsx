import { db } from "@/lib/db";
import { AdminRegistrationsClient } from "@/components/admin/registrations-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminRegistrationsPage({
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
  const filters = {
    status: sp("status"),
    ticketType: sp("ticketType"),
    q: sp("q"),
  };
  const page = Math.max(1, parseInt(sp("page") || "1", 10));

  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.ticketType) where.ticketType = filters.ticketType;
  if (filters.q) {
    where.OR = [
      { fullName: { contains: filters.q } },
      { email: { contains: filters.q } },
      { referenceCode: { contains: filters.q.toUpperCase() } },
    ];
  }

  const [registrations, totalCount] = await Promise.all([
    db.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.registration.count({ where }),
  ]);

  return (
    <AdminRegistrationsClient
      registrations={registrations.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      totalCount={totalCount}
      page={page}
      pageSize={PAGE_SIZE}
      filters={filters}
    />
  );
}
