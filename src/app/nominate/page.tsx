import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NominateSection } from "@/components/sections/nominate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Nomination",
  description:
    "Nominate a climate leader for the Africa Climate Leadership Awards. Free, confidential, open to anyone. Use our AI assistant to strengthen your case.",
  alternates: { canonical: "https://ecoawardsafrica.com/nominate" },
};

export default function NominatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1 pt-20">
        <NominateSection />
      </main>
      <SiteFooter />
    </div>
  );
}
