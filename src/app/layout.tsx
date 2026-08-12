import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const SITE_URL = "https://ecoawardsafrica.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Africa Climate Leadership Awards — Celebrating Climate Leadership Across Africa",
    template: "%s · Africa Climate Leadership Awards",
  },
  description:
    "The Africa Climate Leadership Awards honour the visionaries, innovators, and communities driving Africa's climate future. Nominate a leader, register for the ceremony, and celebrate continental climate excellence.",
  keywords: [
    "Africa Climate Leadership Awards",
    "ACLA Awards",
    "climate awards Africa",
    "climate leadership",
    "climate innovation Africa",
    "sustainability awards",
    "African climate leaders",
    "climate action awards",
  ],
  authors: [{ name: "Africa Climate Leadership Academy" }],
  creator: "Africa Climate Leadership Academy (ACLA)",
  publisher: "ACLA",
  applicationName: "Africa Climate Leadership Awards",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Africa Climate Leadership Awards — Celebrating Climate Leadership Across Africa",
    description:
      "Honouring the visionaries, innovators, and communities driving Africa's climate future. Nominate a leader, register for the ceremony, and celebrate continental climate excellence.",
    url: SITE_URL,
    siteName: "Africa Climate Leadership Awards",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Climate Leadership Awards",
    description:
      "Honouring the visionaries, innovators, and communities driving Africa's climate future.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "climate",
};

// JSON-LD structured data for the awards organization
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Africa Climate Leadership Awards",
  alternateName: "ACLA Awards",
  url: SITE_URL,
  description:
    "The continental celebration of African climate leadership — an initiative of the Africa Climate Leadership Academy.",
  parentOrganization: {
    "@type": "Organization",
    name: "Africa Climate Leadership Academy",
    url: "https://acla.io",
  },
  email: "awards@acla.io",
  telephone: "+254711672118",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  sameAs: [
    "https://twitter.com/aclaio",
    "https://linkedin.com/company/aclaio",
    "https://instagram.com/aclaio",
    "https://youtube.com/@aclaio",
  ],
};

// JSON-LD for the ceremony event
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Africa Climate Leadership Awards Ceremony 2026",
  description:
    "The continental celebration of African climate leadership. Kigali Convention Centre, September 14–17, 2026.",
  startDate: "2026-09-14",
  endDate: "2026-09-17",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Kigali Convention Centre",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Africa Climate Leadership Academy",
    url: "https://acla.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {/* Skip link for keyboard / screen-reader users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-forest focus:text-cream focus:shadow-warm-lg"
        >
          Skip to main content
        </a>
        {children}
        <SonnerToaster position="top-right" richColors />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
      </body>
    </html>
  );
}
