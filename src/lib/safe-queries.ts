/**
 * Safe database query helpers — gracefully handle build-time DB unavailability.
 *
 * On Netlify's build server, the SQLite file (or Postgres DB) may not be
 * available during `next build`. These wrappers catch PrismaClientInitializationError
 * and return fallback data so pages can prerender with static content.
 *
 * At runtime (when the DB is configured), the queries succeed normally.
 * For ISR pages (`revalidate = 3600`), the first render uses fallback data
 * and the background revalidation fetches live data.
 */
import { db } from "@/lib/db";

type NominationWinner = {
  id: string;
  nomineeName: string;
  nomineeTitle: string | null;
  nomineeOrg: string | null;
  nomineeCountry: string;
  winnerYear: number | null;
  winnerHighlight: string | null;
  winnerStory: string | null;
  winnerPhotoUrl: string | null;
};

type AnnouncementSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  isPinned: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type AnnouncementFull = AnnouncementSummary & {
  body: string;
  isPublished: boolean;
};

/**
 * Fetch live public winners from the DB. Returns [] if DB is unavailable.
 */
export async function safeGetLiveWinners(): Promise<NominationWinner[]> {
  try {
    return await db.nomination.findMany({
      where: { status: "WINNER", isPublic: true },
      orderBy: { winnerYear: "desc" },
      select: {
        id: true,
        nomineeName: true,
        nomineeTitle: true,
        nomineeOrg: true,
        nomineeCountry: true,
        winnerYear: true,
        winnerHighlight: true,
        winnerStory: true,
        winnerPhotoUrl: true,
      },
    });
  } catch {
    return [];
  }
}

/**
 * Fetch live public winners for a specific category. Returns [] if DB is unavailable.
 */
export async function safeGetCategoryWinners(categoryId: string): Promise<NominationWinner[]> {
  try {
    return await db.nomination.findMany({
      where: { categoryId, status: "WINNER", isPublic: true },
      orderBy: { winnerYear: "desc" },
      select: {
        id: true,
        nomineeName: true,
        nomineeTitle: true,
        nomineeOrg: true,
        nomineeCountry: true,
        winnerYear: true,
        winnerHighlight: true,
        winnerStory: true,
        winnerPhotoUrl: true,
      },
    });
  } catch {
    return [];
  }
}

/**
 * Fetch category stats (nomination count, review count, shortlisted count).
 * Returns zeros if DB is unavailable.
 */
export async function safeGetCategoryStats(categoryId: string): Promise<{
  totalNominations: number;
  totalReviews: number;
  shortlistedCount: number;
}> {
  try {
    const [totalNominations, totalReviews, shortlistedCount] = await Promise.all([
      db.nomination.count({ where: { categoryId } }),
      db.review.count({ where: { nomination: { categoryId } } }),
      db.nomination.count({ where: { categoryId, status: "SHORTLISTED" } }),
    ]);
    return { totalNominations, totalReviews, shortlistedCount };
  } catch {
    return { totalNominations: 0, totalReviews: 0, shortlistedCount: 0 };
  }
}

/**
 * Fetch published announcements (summary). Returns [] if DB is unavailable.
 */
export async function safeGetAnnouncements(limit: number = 50): Promise<AnnouncementSummary[]> {
  try {
    return await db.announcement.findMany({
      where: { isPublished: true },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        isPinned: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch {
    return [];
  }
}

/**
 * Fetch a single published announcement by slug. Returns null if DB is unavailable or not found.
 */
export async function safeGetAnnouncement(slug: string): Promise<AnnouncementFull | null> {
  try {
    return await db.announcement.findUnique({
      where: { slug },
    });
  } catch {
    return null;
  }
}

/**
 * Fetch other published announcements (for "related" sections).
 * Returns [] if DB is unavailable.
 */
export async function safeGetOtherAnnouncements(excludeId: string, limit: number = 3): Promise<AnnouncementSummary[]> {
  try {
    return await db.announcement.findMany({
      where: { isPublished: true, id: { not: excludeId } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        isPinned: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch {
    return [];
  }
}

/**
 * Fetch a single public winner by ID. Returns null if DB is unavailable or not found.
 */
export async function safeGetWinner(id: string): Promise<{
  id: string;
  nomineeName: string;
  nomineeTitle: string | null;
  nomineeOrg: string | null;
  nomineeCountry: string;
  categoryId: string;
  summary: string;
  justification: string;
  winnerYear: number | null;
  winnerHighlight: string | null;
  winnerStory: string | null;
  winnerPhotoUrl: string | null;
  isPublic: boolean;
  status: string;
  reviews: Array<{ totalScore: number; comments: string | null; recommendation: string | null }>;
} | null> {
  try {
    return await db.nomination.findUnique({
      where: { id },
      include: {
        reviews: {
          take: 3,
          orderBy: { totalScore: "desc" },
          select: { totalScore: true, comments: true, recommendation: true },
        },
      },
    }) as any;
  } catch {
    return null;
  }
}

/**
 * Fetch winner metadata for generateMetadata (lightweight query).
 */
export async function safeGetWinnerMeta(id: string): Promise<{
  nomineeName: string;
  winnerHighlight: string | null;
  nomineeCountry: string;
  categoryId: string;
  isPublic: boolean;
  status: string;
  winnerYear: number | null;
} | null> {
  try {
    return await db.nomination.findUnique({
      where: { id },
      select: {
        nomineeName: true,
        winnerHighlight: true,
        nomineeCountry: true,
        categoryId: true,
        isPublic: true,
        status: true,
        winnerYear: true,
      },
    });
  } catch {
    return null;
  }
}

/**
 * Fetch announcement metadata for generateMetadata (lightweight query).
 */
export async function safeGetAnnouncementMeta(slug: string): Promise<{
  title: string;
  excerpt: string;
  category: string;
  publishedAt: Date | null;
} | null> {
  try {
    return await db.announcement.findUnique({
      where: { slug },
      select: { title: true, excerpt: true, category: true, publishedAt: true },
    });
  } catch {
    return null;
  }
}
