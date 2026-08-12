import { db } from "@/lib/db";
import { AdminJudgesClient } from "@/components/admin/judges-list";
import { awardCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminJudgesPage() {
  const judges = await db.user.findMany({
    where: { role: "JUDGE" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      title: true,
      organization: true,
      country: true,
      expertise: true,
      assignedCategories: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      reviews: { select: { id: true, totalScore: true } },
    },
  });

  return (
    <AdminJudgesClient
      judges={judges.map((j) => ({
        id: j.id,
        email: j.email,
        name: j.name ?? "",
        title: j.title ?? "",
        organization: j.organization ?? "",
        country: j.country ?? "",
        expertise: j.expertise ? JSON.parse(j.expertise) : [],
        assignedCategories: j.assignedCategories ? JSON.parse(j.assignedCategories) : [],
        isActive: j.isActive,
        lastLoginAt: j.lastLoginAt?.toISOString() ?? null,
        createdAt: j.createdAt.toISOString(),
        reviewsCount: j.reviews.length,
        avgScore: j.reviews.length > 0
          ? Math.round((j.reviews.reduce((s, r) => s + r.totalScore, 0) / j.reviews.length) * 10) / 10
          : null,
      }))}
      categories={awardCategories}
    />
  );
}
