import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WinnersIndexClient } from "@/components/sections/winners-index-client";
import { pastWinners, awardCategories } from "@/lib/data";
import { safeGetLiveWinners } from "@/lib/safe-queries";

export const revalidate = 3600;

export const metadata = {
  title: "Hall of Fame",
  description: "All past winners of the Africa Climate Leadership Awards.",
};

export default async function WinnersIndexPage() {
  // Live winners from DB (safe — returns [] if DB unavailable at build time)
  const liveWinners = await safeGetLiveWinners();

  const allWinners = [
    ...liveWinners.map((w) => ({
      type: "live" as const,
      id: w.id,
      year: w.winnerYear ?? new Date().getFullYear(),
      nomineeName: w.nomineeName,
      nomineeTitle: w.nomineeTitle,
      nomineeOrg: w.nomineeOrg,
      nomineeCountry: w.nomineeCountry,
      categoryId: "", // will be set below
      highlight: w.winnerHighlight ?? "",
    })),
    ...pastWinners.map((w) => ({
      type: "static" as const,
      id: `static-${w.year}-${w.categoryId}`,
      year: w.year,
      nomineeName: w.winnerName,
      nomineeTitle: w.winnerTitle,
      nomineeOrg: w.winnerOrg,
      nomineeCountry: w.country,
      categoryId: w.categoryId,
      highlight: w.highlight,
    })),
  ].sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-sunrise-gradient">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Hall of Fame
            </div>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-bold text-forest leading-tight">
              {allWinners.length} climate leaders, {allWinners.length > 0 ? `across ${new Set(allWinners.map((w) => w.year)).size} editions` : "and counting"}.
            </h1>
            <p className="mt-5 text-lg text-foreground/70 max-w-2xl">
              Every winner of the Africa Climate Leadership Awards — past, present, and the leaders soon to join this lineage.
            </p>
          </div>
        </section>

        <WinnersIndexClient winners={allWinners} categories={awardCategories} />
      </main>
      <SiteFooter />
    </div>
  );
}
