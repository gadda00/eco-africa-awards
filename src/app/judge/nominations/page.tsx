import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { awardCategories, africanCountries } from "@/lib/data";
import { JudgeNominationsClient } from "@/components/admin/judge-nominations-list";

export const dynamic = "force-dynamic";

export default async function JudgeNominationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();
  const judgeId = session.user.id;

  const judge = await db.user.findUnique({
    where: { id: judgeId },
    select: { assignedCategories: true },
  });
  if (!judge) notFound();

  const assignedCategoryIds: string[] = judge.assignedCategories
    ? JSON.parse(judge.assignedCategories)
    : [];

  const resolved = await searchParams;
  const sp = (k: string) => {
    const v = resolved[k];
    if (Array.isArray(v)) return v[0] || "";
    return v || "";
  };

  const filters = {
    status: sp("status"),
    categoryId: sp("categoryId"),
    reviewed: sp("reviewed"),
    q: sp("q"),
  };

  const where: any = {
    categoryId: { in: assignedCategoryIds },
  };
  if (filters.status) where.status = filters.status;
  else where.status = { in: ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "FINALIST"] };

  if (filters.categoryId) where.categoryId = filters.categoryId;

  if (filters.q) {
    where.OR = [
      { nomineeName: { contains: filters.q } },
      { referenceCode: { contains: filters.q.toUpperCase() } },
      { nomineeOrg: { contains: filters.q } },
    ];
  }

  const nominations = await db.nomination.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      referenceCode: true,
      nomineeName: true,
      nomineeCountry: true,
      categoryId: true,
      status: true,
      createdAt: true,
      reviews: {
        where: { judgeId },
        select: { id: true, totalScore: true, recommendation: true },
      },
    },
    take: 100,
  });

  let filtered = nominations;
  if (filters.reviewed === "yes") filtered = nominations.filter((n) => n.reviews.length > 0);
  if (filters.reviewed === "no") filtered = nominations.filter((n) => n.reviews.length === 0);

  return (
    <JudgeNominationsClient
      nominations={filtered.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
        reviewed: n.reviews.length > 0,
        myScore: n.reviews[0]?.totalScore ?? null,
        myRecommendation: n.reviews[0]?.recommendation ?? null,
      }))}
      assignedCategoryIds={assignedCategoryIds}
      filters={filters}
    />
  );
}
