import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { ArrowRight, Megaphone, Pin } from "lucide-react";
import { safeGetAnnouncements } from "@/lib/safe-queries";

export const revalidate = 3600;

export const metadata = {
  title: "News & Announcements",
  description: "Latest updates from the Africa Climate Leadership Awards.",
};

export default async function NewsPage() {
  const announcements = await safeGetAnnouncements(50);

  const pinned = announcements.filter((a) => a.isPinned);
  const rest = announcements.filter((a) => !a.isPinned);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 bg-sunrise-gradient">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-semibold border border-gold/40 bg-gold/10 text-gold">
              <Megaphone className="h-3.5 w-3.5" />
              News & Announcements
            </div>
            <h1 className="mt-5 font-display text-5xl lg:text-6xl font-bold text-forest leading-tight">
              Updates from the awards
            </h1>
            <p className="mt-5 text-lg text-foreground/70 max-w-2xl">
              Latest news on nominations, deadlines, the ceremony, and the leaders joining the 2026 panel.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {announcements.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No announcements yet. Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {pinned.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.22em] font-semibold text-gold">
                      <Pin className="h-3.5 w-3.5" /> Pinned
                    </div>
                    <div className="space-y-4">
                      {pinned.map((a) => <AnnouncementCard key={a.id} a={a} featured />)}
                    </div>
                  </div>
                )}
                {rest.length > 0 && (
                  <div>
                    {pinned.length > 0 && (
                      <div className="text-xs uppercase tracking-[0.22em] font-semibold text-muted-foreground mb-4">
                        All announcements
                      </div>
                    )}
                    <div className="space-y-4">
                      {rest.map((a) => <AnnouncementCard key={a.id} a={a} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function AnnouncementCard({ a, featured }: { a: any; featured?: boolean }) {
  return (
    <Link
      href={`/news/${a.slug}`}
      className={`block rounded-2xl border border-forest/15 bg-card p-6 lg:p-8 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all ${
        featured ? "bg-gradient-to-br from-gold/10 to-card" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-forest/10 text-forest ring-1 ring-forest/30">
          {a.category}
        </span>
        {a.publishedAt && (
          <span className="text-xs text-muted-foreground">
            {new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        )}
      </div>
      <h2 className={`font-display ${featured ? "text-2xl lg:text-3xl" : "text-xl"} font-bold text-forest leading-tight`}>
        {a.title}
      </h2>
      <p className="mt-3 text-foreground/75 leading-relaxed">{a.excerpt}</p>
      <div className="mt-4 text-sm text-forest font-semibold inline-flex items-center gap-1">
        Read more <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
