import { awardCategories } from "@/lib/data";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  // Get live counts per category
  const counts = await db.nomination.groupBy({
    by: ["categoryId"],
    _count: true,
  });
  const winnersCount = await db.nomination.groupBy({
    by: ["categoryId"],
    _count: true,
    where: { status: "WINNER" },
  });

  const countMap = new Map(counts.map((c) => [c.categoryId, c._count]));
  const winnerMap = new Map(winnersCount.map((c) => [c.categoryId, c._count]));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Award Categories</h1>
        <p className="text-foreground/70 mt-1">{awardCategories.length} categories across 4 levels</p>
      </div>

      <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card to-forest/5 p-4 mb-6">
        <p className="text-sm text-foreground/70">
          Categories are defined in <code className="text-xs bg-secondary/60 px-1.5 py-0.5 rounded">src/lib/data.ts</code>.
          To add or modify a category, edit that file (or extend the admin to manage categories via database).
        </p>
      </div>

      <div className="space-y-3">
        {awardCategories.map((cat) => {
          const count = countMap.get(cat.id) ?? 0;
          const winners = winnerMap.get(cat.id) ?? 0;
          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-forest/15 bg-card p-5 shadow-warm"
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-forest/10 text-forest ring-1 ring-forest/30">
                      {cat.level}
                    </span>
                    {cat.popular && (
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-gold/15 text-gold">
                        Popular
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">{cat.id}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-forest">{cat.name}</h3>
                  <p className="text-sm text-foreground/70 italic mt-0.5">{cat.tagline}</p>
                  <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{cat.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-secondary/40 p-3 min-w-16">
                    <div className="font-display text-2xl font-bold text-forest tabular-nums">{count}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Nominations</div>
                  </div>
                  <div className="rounded-lg bg-gold/10 p-3 min-w-16">
                    <div className="font-display text-2xl font-bold text-gold tabular-nums">{winners}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Winners</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/40">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Criteria</div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.criteria.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-secondary/60 text-foreground/80">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
