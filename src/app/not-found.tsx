import Link from "next/link";
import { Leaf, ArrowLeft, Compass } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 grid place-items-center px-4 py-20">
        <div className="text-center max-w-lg">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-gold to-terracotta shadow-gold mb-6">
            <Compass className="h-8 w-8 text-cream" />
          </div>
          <div className="font-display text-8xl font-bold text-gradient-sunset mb-2">404</div>
          <h1 className="font-display text-3xl font-bold text-forest mb-3">
            Page not found
          </h1>
          <p className="text-foreground/70 mb-8">
            The page you&apos;re looking for may have moved, been removed, or never existed.
            Try one of these instead:
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-cream font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-forest/30 text-forest font-semibold hover:bg-white/60"
            >
              <Leaf className="h-4 w-4" />
              Explore categories
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
