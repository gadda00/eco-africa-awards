import { db } from "@/lib/db";
import { AdminNominationsClient } from "@/components/admin/nominations-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminNominationsPage({
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
    categoryId: sp("categoryId"),
    country: sp("country"),
    q: sp("q"),
  };
  const page = Math.max(1, parseInt(sp("page") || "1", 10));

  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.country) where.nomineeCountry = filters.country;
  if (filters.q) {
    where.OR = [
      { nomineeName: { contains: filters.q } },
      { referenceCode: { contains: filters.q.toUpperCase() } },
      { nomineeOrg: { contains: filters.q } },
      { nominatorName: { contains: filters.q } },
    ];
  }

  const [nominations, totalCount] = await Promise.all([
    db.nomination.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        id: true,
        referenceCode: true,
        nomineeName: true,
        nomineeCountry: true,
        categoryId: true,
        status: true,
        createdAt: true,
        totalScore: true,
        reviewsCount: true,
      },
    }),
    db.nomination.count({ where }),
  ]);

  return (
    <AdminNominationsClient
      nominations={nominations.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }))}
      totalCount={totalCount}
      page={page}
      pageSize={PAGE_SIZE}
      filters={filters}
    />
  );
}
