import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { awardCategories } from "@/lib/data";
import { CategoriesGridClient } from "@/components/sections/categories-grid-client";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Award Categories",
  description:
    "Explore all 12 award categories of the Africa Climate Leadership Awards — from Climate Leader of the Year to Lifetime Achievement.",
  alternates: { canonical: "https://ecoawardsafrica.com/categories" },
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-sunrise-gradient">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] font-bold border border-forest/30 bg-white/60 backdrop-blur-md text-forest">
              12 Award Categories
            </div>
            <h1 className="mt-5 font-display text-5xl lg:text-7xl font-bold text-forest leading-[0.95]">
              Twelve stages.{" "}
              <span className="text-gradient-sunset italic">One continent rising.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-3xl">
              From grassroots resilience to continental policy, from youth mobilisation to lifetime achievement —
              explore the twelve categories that together recognise the full spectrum of African climate leadership.
            </p>
          </div>
        </section>

        {/* Grid */}
        <CategoriesGridClient categories={awardCategories} />
      </main>
      <SiteFooter />
    </div>
  );
}
