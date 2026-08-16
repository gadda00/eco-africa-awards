import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHero } from "@/components/home/home-hero";
import { HomeStats } from "@/components/home/home-stats";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeTimeline } from "@/components/home/home-timeline";
import { HomeNominate } from "@/components/home/home-nominate";
import { HomeWinners } from "@/components/home/home-winners";
import { HomeCeremony } from "@/components/home/home-ceremony";
import { HomeCTA } from "@/components/home/home-cta";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1">
        <HomeHero />
        <HomeStats />
        <HomeCategories />
        <HomeTimeline />
        <HomeNominate />
        <HomeWinners />
        <HomeCeremony />
        <HomeCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
