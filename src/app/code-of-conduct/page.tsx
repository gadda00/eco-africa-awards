import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct",
  description:
    "The code of conduct for the Africa Climate Leadership Awards — for nominees, judges, partners, and attendees.",
  alternates: { canonical: "https://ecoawardsafrica.com/code-of-conduct" },
  robots: { index: false, follow: true },
};

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest mb-6">Code of Conduct</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: August 2026</p>

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest prose-a:text-forest">
            <h2>1. Purpose</h2>
            <p>
              The Africa Climate Leadership Awards exist to honour and elevate African climate leadership.
              This Code of Conduct applies to all participants — nominees, nominators, judges, partners,
              volunteers, attendees, and staff — and exists to ensure the Awards remain a rigorous, equitable,
              and dignified celebration of the continent&apos;s climate leaders.
            </p>

            <h2>2. Core principles</h2>
            <ul>
              <li><strong>Integrity.</strong> Nomination cases must be truthful, evidence-based, and submitted with the nominee&apos;s consent.</li>
              <li><strong>Equity.</strong> The Awards centre women, youth, indigenous knowledge, and frontline communities. Discrimination on any basis is not tolerated.</li>
              <li><strong>Rigour.</strong> Judges score independently, on evidence, with declared conflicts of interest.</li>
              <li><strong>Confidentiality.</strong> Nomination materials, scores, and panel deliberations are confidential.</li>
              <li><strong>Respect.</strong> All participants treat each other with dignity — in person, in writing, and online.</li>
            </ul>

            <h2>3. For nominators</h2>
            <ul>
              <li>Submit only nominations you believe to be truthful and verifiable.</li>
              <li>Obtain the nominee&apos;s consent before submitting.</li>
              <li>Avoid submitting the same nominee in more than two categories.</li>
              <li>Do not attempt to influence judges or the secretariat.</li>
            </ul>

            <h2>4. For judges</h2>
            <ul>
              <li>Declare any conflict of interest with a nominee or organisation.</li>
              <li>Score independently, on the evidence in the nomination case.</li>
              <li>Do not contact nominees or nominators outside of official channels.</li>
              <li>Maintain strict confidentiality of all nomination materials and panel discussions.</li>
              <li>Recuse yourself from any nomination where you have a personal, financial, or institutional interest.</li>
            </ul>

            <h2>5. For ceremony attendees</h2>
            <ul>
              <li>Treat all attendees, staff, and venue workers with respect.</li>
              <li>Do not engage in harassment of any kind — verbal, physical, or sexual.</li>
              <li>Respect confidentiality of off-the-record conversations.</li>
              <li>Photography and social media are encouraged during public sessions; respect requests not to be photographed.</li>
            </ul>

            <h2>6. Unacceptable behaviour</h2>
            <p>The following will not be tolerated:</p>
            <ul>
              <li>Discrimination, harassment, or intimidation on any basis.</li>
              <li>Fabricated, plagiarised, or misleading nomination materials.</li>
              <li>Attempts to influence judges or the secretariat through gifts, favours, or pressure.</li>
              <li>Disclosure of confidential nomination materials or panel deliberations.</li>
              <li>Any conduct that brings the Awards or ACLA into disrepute.</li>
            </ul>

            <h2>7. Reporting</h2>
            <p>
              To report a violation, contact the secretariat at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. All reports are treated
              confidentially and investigated promptly.
            </p>

            <h2>8. Consequences</h2>
            <p>
              Violations may result in: disqualification of nominations, removal from the judging panel,
              cancellation of ceremony registration, and (in serious cases) permanent exclusion from
              future editions of the Awards.
            </p>

            <h2>9. Acknowledgement</h2>
            <p>
              By submitting a nomination, registering for the ceremony, accepting a judging role, or
              attending the ceremony, participants acknowledge that they have read and agree to abide
              by this Code of Conduct.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
