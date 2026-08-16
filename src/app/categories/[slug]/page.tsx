import { notFound } from "next/navigation";
import Link from "next/link";
import { awardCategories, pastWinners } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Trophy, Users, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import type { Metadata } from "next";
import { safeGetCategoryWinners, safeGetCategoryStats } from "@/lib/safe-queries";

export const revalidate = 3600;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = awardCategories.find((c) => c.slug === slug);
  if (!category) {
    return { title: "Category Not Found" };
  }
  return {
    title: category.name,
    description: category.tagline,
    alternates: { canonical: `https://ecoawardsafrica.com/categories/${slug}` },
    openGraph: {
      title: `${category.name} — Africa Climate Leadership Awards`,
      description: category.description.slice(0, 200),
      url: `https://ecoawardsafrica.com/categories/${slug}`,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return awardCategories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = awardCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const Icon = (Icons as any)[category.icon] ?? Icons.Award;

  // Past winners for this category (static data)
  const staticWinners = pastWinners.filter((w) => w.categoryId === category.id);
  // Live winners from DB (safe — returns [] if DB unavailable at build time)
  const liveWinners = await safeGetCategoryWinners(category.id);
  // Live stats (safe — returns zeros if DB unavailable)
  const { totalNominations, totalReviews, shortlistedCount } = await safeGetCategoryStats(category.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-sunrise-gradient">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link href="/categories" className="inline-flex items-center gap-1.5 text-sm text-forest/80 hover:text-forest mb-6">
              <ArrowLeft className="h-3.5 w-3.5" />
              All categories
            </Link>

            <div className="flex items-start gap-5 mb-6">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-forest to-gold grid place-items-center shadow-forest flex-shrink-0">
                <Icon className="h-10 w-10 text-cream" strokeWidth={1.5} />
              </div>
              <div>
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-forest/15 text-forest ring-1 ring-forest/30">
                  {category.level} Category
                </div>
                <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-forest leading-tight">
                  {category.name}
                </h1>
              </div>
            </div>

            <p className="text-xl sm:text-2xl text-foreground/80 italic font-medium max-w-3xl">
              {category.tagline}
            </p>
            <p className="mt-6 text-lg text-foreground/75 leading-relaxed max-w-3xl">
              {category.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-forest hover:bg-forest-light text-cream font-semibold h-13 px-7">
                <a href="/nominate">
                  Nominate in this category
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-forest/30 bg-white/60 backdrop-blur-md text-forest h-13 px-7">
                <a href="#criteria">View criteria</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Trophy} label="Total nominations" value={totalNominations} accent="forest" />
              <StatCard icon={Check} label="Shortlisted" value={shortlistedCount} accent="gold" />
              <StatCard icon={Users} label="Reviews" value={totalReviews} accent="terracotta" />
              <StatCard icon={Sparkles} label="Past winners" value={staticWinners.length + liveWinners.length} accent="savanna" />
            </div>
          </div>
        </section>

        {/* Criteria */}
        <section id="criteria" className="py-16 lg:py-24 bg-savanna-gradient">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                Judging Criteria
              </div>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl font-bold text-forest">
                What we look for
              </h2>
              <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
                Every nomination in this category is scored by 3+ judges across these criteria, weighted as below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.criteria.map((c, i) => (
                <div key={i} className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-forest/10 ring-1 ring-forest/30 grid place-items-center text-forest font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-foreground/85 leading-relaxed pt-1">{c}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Who should enter */}
            <div className="mt-12 rounded-2xl border border-forest/30 bg-card p-8 shadow-warm">
              <h3 className="font-display text-2xl font-bold text-forest mb-3">Who should enter</h3>
              <p className="text-foreground/80 leading-relaxed">{category.whoShouldEnter}</p>
            </div>

            {/* Prize */}
            <div className="mt-6 rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent p-8">
              <h3 className="font-display text-2xl font-bold text-gold mb-3">What the winner receives</h3>
              <p className="text-foreground/85 leading-relaxed">{category.prize}</p>
            </div>
          </div>
        </section>

        {/* Past winners */}
        {(staticWinners.length > 0 || liveWinners.length > 0) && (
          <section className="py-16 lg:py-24 bg-background">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest mb-2">
                Past winners of this category
              </h2>
              <p className="text-foreground/70 mb-8">
                A lineage of African climate leadership.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staticWinners.map((w, i) => (
                  <div key={`s-${i}`} className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-gold/15 text-gold">
                        {w.year} Winner
                      </span>
                      <Trophy className="h-5 w-5 text-gold/60" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-forest">{w.winnerName}</h3>
                    <p className="text-sm text-muted-foreground">{w.winnerTitle}</p>
                    <div className="text-xs text-forest mt-1">{w.country} · {w.winnerOrg}</div>
                    <p className="text-sm text-foreground/80 italic mt-3">{w.highlight}</p>
                  </div>
                ))}
                {liveWinners.map((w, i) => (
                  <Link
                    key={`l-${i}`}
                    href={`/winners/${w.winnerYear}/${w.id}`}
                    className="rounded-2xl border border-forest/15 bg-card p-6 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-gold/15 text-gold">
                        {w.winnerYear} Winner
                      </span>
                      <Trophy className="h-5 w-5 text-gold/60" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-forest">{w.nomineeName}</h3>
                    <p className="text-sm text-muted-foreground">{w.nomineeTitle ?? "—"}</p>
                    <div className="text-xs text-forest mt-1">{w.nomineeCountry}{w.nomineeOrg ? ` · ${w.nomineeOrg}` : ""}</div>
                    {w.winnerHighlight && (
                      <p className="text-sm text-foreground/80 italic mt-3">{w.winnerHighlight}</p>
                    )}
                    <div className="mt-3 text-xs text-forest font-semibold inline-flex items-center gap-1">
                      Read full story <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-forest text-cream">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              Know a leader who belongs in this category?
            </h2>
            <p className="mt-4 text-cream/80 text-lg">
              Nominations are free, confidential, and open to anyone.
              Use our AI assistant to strengthen your case.
            </p>
            <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-gold to-terracotta hover:from-gold-light hover:to-terracotta text-cream font-semibold h-13 px-8">
              <a href="/nominate">
                Submit a nomination
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: "forest" | "gold" | "terracotta" | "savanna" }) {
  const styles = {
    forest: { bg: "bg-forest/10", text: "text-forest", ring: "ring-forest/30" },
    gold: { bg: "bg-gold/15", text: "text-gold", ring: "ring-gold/40" },
    terracotta: { bg: "bg-terracotta/10", text: "text-terracotta", ring: "ring-terracotta/40" },
    savanna: { bg: "bg-savanna/25", text: "text-terracotta", ring: "ring-savanna/50" },
  }[accent];
  return (
    <div className="rounded-2xl border border-forest/15 bg-card p-5 shadow-warm text-center">
      <div className={`mx-auto h-10 w-10 rounded-xl ${styles.bg} ${styles.ring} ring-1 grid place-items-center mb-2`}>
        <Icon className={`h-5 w-5 ${styles.text}`} />
      </div>
      <div className="font-display text-3xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
