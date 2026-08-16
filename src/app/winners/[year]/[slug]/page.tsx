import { notFound } from "next/navigation";
import Link from "next/link";
import { awardCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MapPin, Building2, Trophy, Quote, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { safeGetWinner, safeGetWinnerMeta } from "@/lib/safe-queries";

export const revalidate = 3600;

type Params = { year: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const winner = await safeGetWinnerMeta(slug);
  if (!winner || !winner.isPublic || winner.status !== "WINNER") {
    return { title: "Winner Not Found" };
  }
  const category = awardCategories.find((c) => c.id === winner.categoryId);
  const title = `${winner.nomineeName} — ${winner.winnerYear} ${category?.shortName ?? "Award"} Winner`;
  const description = winner.winnerHighlight || `Meet ${winner.nomineeName}, ${category?.name ?? "Award"} winner of the Africa Climate Leadership Awards.`;
  return {
    title,
    description,
    alternates: { canonical: `https://ecoawardsafrica.com/winners/${winner.winnerYear}/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://ecoawardsafrica.com/winners/${winner.winnerYear}/${slug}`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function WinnerProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const winner = await safeGetWinner(slug);

  if (!winner || !winner.isPublic || winner.status !== "WINNER") {
    notFound();
  }

  const category = awardCategories.find((c) => c.id === winner.categoryId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-sunrise-gradient">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-gold/20 blur-3xl animate-pulse-soft" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link href="/winners" className="inline-flex items-center gap-1.5 text-sm text-forest/80 hover:text-forest mb-6">
              <ArrowLeft className="h-3.5 w-3.5" />
              Hall of Fame
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.22em] font-semibold bg-gradient-to-r from-gold to-terracotta text-cream shadow-gold mb-4">
              <Trophy className="h-3.5 w-3.5" />
              {winner.winnerYear} {category?.shortName ?? "Award"} Winner
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-forest leading-tight">
              {winner.nomineeName}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
              {winner.nomineeTitle && <span className="text-foreground/80 font-medium">{winner.nomineeTitle}</span>}
              {winner.nomineeOrg && (
                <span className="inline-flex items-center gap-1.5 text-foreground/70">
                  <Building2 className="h-4 w-4 text-forest" />
                  {winner.nomineeOrg}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-foreground/70">
                <MapPin className="h-4 w-4 text-forest" />
                {winner.nomineeCountry}
              </span>
            </div>

            {winner.winnerHighlight && (
              <p className="mt-8 text-2xl text-forest italic font-medium max-w-3xl leading-relaxed">
                &ldquo;{winner.winnerHighlight}&rdquo;
              </p>
            )}
          </div>
        </section>

        {winner.winnerStory && (
          <section className="py-16 lg:py-24 bg-background">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="text-foreground/85 leading-relaxed whitespace-pre-wrap text-lg">
                {winner.winnerStory}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 lg:py-16 bg-savanna-gradient">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-forest/15 bg-card p-8 shadow-warm">
              <div className="text-[10px] uppercase tracking-[0.22em] text-forest font-semibold mb-2">
                Original nomination summary
              </div>
              <p className="text-foreground/85 leading-relaxed">{winner.summary}</p>
              <div className="mt-4 pt-4 border-t border-border/40">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Justification (excerpt)</div>
                <p className="text-sm text-foreground/70 italic line-clamp-4">{winner.justification}</p>
              </div>
            </div>
          </div>
        </section>

        {winner.reviews && winner.reviews.length > 0 && (
          <section className="py-12 lg:py-16 bg-background">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-forest mb-6">
                How the panel scored this winner
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {winner.reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-forest/15 bg-card p-5 shadow-warm text-center">
                    <div className="font-display text-4xl font-bold text-gradient-sunset tabular-nums">
                      {r.totalScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">/ 10.0 · Review #{i + 1}</div>
                    {r.recommendation && (
                      <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-forest/10 text-forest">
                        {r.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {winner.reviews.some((r) => r.comments) && (
                <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-6">
                  <div className="flex items-start gap-3">
                    <Quote className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                    <div className="space-y-3">
                      {winner.reviews.filter((r) => r.comments).map((r, i) => (
                        <p key={i} className="text-foreground/80 italic leading-relaxed">&ldquo;{r.comments}&rdquo;</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {category && (
          <section className="py-12 lg:py-16 bg-forest text-cream">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
              <Sparkles className="h-8 w-8 mx-auto text-gold-light mb-4" />
              <h2 className="font-display text-2xl lg:text-3xl font-bold">{category.name}</h2>
              <p className="mt-2 text-cream/80">{category.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button asChild variant="outline" className="border-cream/30 text-cream hover:bg-cream/10">
                  <Link href={`/categories/${category.slug}`}>
                    About this category <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-semibold">
                  <a href="/nominate">
                    Nominate next year <ArrowRight className="ml-1.5 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
