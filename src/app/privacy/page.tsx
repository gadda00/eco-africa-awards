import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How the Africa Climate Leadership Awards collects, uses, and protects your personal data.",
  alternates: { canonical: "https://ecoawardsafrica.com/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main" className="flex-1 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest mb-6">Privacy Notice</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: August 2026</p>

          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-forest prose-a:text-forest">
            <h2>1. Who we are</h2>
            <p>
              The Africa Climate Leadership Awards (the &ldquo;Awards&rdquo;) are an initiative of the Africa
              Climate Leadership Academy (ACLA), with offices in Nairobi, Kenya. We can be contacted at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or by phone at {siteConfig.phone}.
            </p>

            <h2>2. What we collect</h2>
            <p>We collect the following personal data when you interact with our platform:</p>
            <ul>
              <li><strong>Nominations:</strong> nominee name, country, contact details, nominator name and email, and the nomination case materials you submit.</li>
              <li><strong>Registrations:</strong> name, email, phone, country, organisation, ticket type, dietary and accessibility needs.</li>
              <li><strong>Contact messages:</strong> name, email, organisation, and message content.</li>
              <li><strong>Newsletter subscriptions:</strong> email address (and optionally your name).</li>
              <li><strong>Account data (judges/admins):</strong> email, hashed password, role, assigned categories, expertise, and audit log entries.</li>
              <li><strong>Technical data:</strong> IP address (for rate limiting and abuse prevention), browser type, and basic analytics.</li>
            </ul>

            <h2>3. How we use your data</h2>
            <ul>
              <li>To process nominations, registrations, and contact messages.</li>
              <li>To administer the judging process and communicate with judges.</li>
              <li>To send ceremony-related communications to registered attendees.</li>
              <li>To send our newsletter (only to subscribers who opted in; unsubscribe at any time).</li>
              <li>To detect and prevent abuse, fraud, and rate-limit violations.</li>
              <li>To compile anonymised aggregate statistics (e.g., total nominations by country).</li>
            </ul>

            <h2>4. Legal basis</h2>
            <p>
              We process personal data on the basis of your consent (nominations, registrations, newsletter),
              our legitimate interests in operating the Awards (judging, communications, security),
              and contractual necessity (ceremony attendance).
            </p>

            <h2>5. Sharing your data</h2>
            <p>
              We do not sell personal data. Nominations are visible only to the nominee (with their consent),
              the nominator, assigned judges, and a small secretariat. Public winner profiles are only published
              with explicit admin approval. We may share data with our cloud hosting provider (Netlify),
              email provider, and AI service (Z.ai) strictly for the purpose of operating the platform.
            </p>

            <h2>6. International transfers</h2>
            <p>
              As a pan-African programme, your data may be processed outside your country of residence.
              We ensure appropriate safeguards are in place, including standard contractual clauses with
              our service providers.
            </p>

            <h2>7. Retention</h2>
            <ul>
              <li>Nominations: retained for the duration of the awards cycle plus 7 years for historical reference.</li>
              <li>Registrations: retained for the ceremony year plus 2 years.</li>
              <li>Contact messages: retained for 2 years.</li>
              <li>Newsletter subscriptions: until you unsubscribe.</li>
              <li>Judge/admin accounts: deactivated when no longer required; reviews retained.</li>
            </ul>

            <h2>8. Your rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data (subject to legal retention requirements).</li>
              <li>Object to processing and withdraw consent at any time.</li>
              <li>Receive a copy of your data in a portable format.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>

            <h2>9. Security</h2>
            <p>
              We use industry-standard security measures including HTTPS, hashed passwords (bcrypt),
              rate limiting on all public endpoints, server-side input validation, role-based access control,
              and audit logging on all admin actions. AI usage is logged without storing personally
              identifiable information.
            </p>

            <h2>10. Cookies</h2>
            <p>
              We use only essential cookies: a session token (for logged-in users), a CSRF token,
              and a callback URL — all first-party, all required for the platform to function. We do not
              use third-party tracking or advertising cookies.
            </p>

            <h2>11. Changes to this notice</h2>
            <p>
              We may update this notice from time to time. Material changes will be communicated via
              the email address you provided. Continued use of the platform after a change constitutes
              acceptance of the updated notice.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
