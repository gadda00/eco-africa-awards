import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowLeft, ArrowRight, Megaphone, Calendar } from "lucide-react";
import Markdown from "react-markdown";

export const dynamic = "force-dynamic";

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await db.announcement.findUnique({
    where: { slug },
  });

  if (!a || !a.isPublished) notFound();

  // Other announcements
  const others = await db.announcement.findMany({
    where: {
      isPublished: true,
      id: { not: a.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <article className="pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm text-forest/80 hover:text-forest mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All news
            </Link>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
                <Megaphone className="h-3 w-3" />
                {a.category}
              </span>
              {a.publishedAt && (
                <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-forest leading-tight">
              {a.title}
            </h1>

            <p className="mt-5 text-xl text-foreground/70 leading-relaxed">{a.excerpt}</p>

            <div className="mt-10 prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest prose-a:text-forest prose-strong:text-foreground">
              <Markdown>{a.body}</Markdown>
            </div>
          </div>
        </article>

        {others.length > 0 && (
          <section className="py-16 lg:py-20 bg-savanna-gradient">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-forest mb-6">
                More from the awards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {others.map((o) => (
                  <Link
                    key={o.id}
                    href={`/news/${o.slug}`}
                    className="block rounded-2xl border border-forest/15 bg-card p-5 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-forest mb-2">
                      {o.category}
                    </div>
                    <h3 className="font-display text-lg font-bold text-forest leading-tight">{o.title}</h3>
                    <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{o.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
