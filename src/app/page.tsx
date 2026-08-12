import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { CategoriesSection } from "@/components/sections/categories";
import { NominateSection } from "@/components/sections/nominate";
import { SelectionSection } from "@/components/sections/selection";
import { TimelineSection } from "@/components/sections/timeline";
import { WinnersSection } from "@/components/sections/winners";
import { AiFeaturesSection } from "@/components/sections/ai-features";
import { CeremonySection } from "@/components/sections/ceremony";
import { SponsorsSection } from "@/components/sections/sponsors";
import { FaqSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <CategoriesSection />
        <NominateSection />
        <SelectionSection />
        <TimelineSection />
        <WinnersSection />
        <AiFeaturesSection />
        <CeremonySection />
        <SponsorsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
