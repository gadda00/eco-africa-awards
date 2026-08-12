import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export const metadata: Metadata = {
  metadataBase: new URL("https://ecoafricaawards.com"),
  title: {
    default: "Eco Africa Awards — Celebrating Climate Leadership Across Africa",
    template: "%s · Eco Africa Awards",
  },
  description:
    "The Eco Africa Awards honour the visionaries, innovators, and communities driving Africa's climate future. Nominate a leader, register for the ceremony, and celebrate continental climate excellence.",
  keywords: [
    "Eco Africa Awards",
    "Africa Climate Leadership Awards",
    "ACLA",
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
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Eco Africa Awards — Celebrating Climate Leadership Across Africa",
    description:
      "Honouring the visionaries, innovators, and communities driving Africa's climate future. Nominate a leader, register for the ceremony, and celebrate continental climate excellence.",
    url: "https://ecoafricaawards.com",
    siteName: "Eco Africa Awards",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eco Africa Awards",
    description:
      "Honouring the visionaries, innovators, and communities driving Africa's climate future.",
  },
  alternates: {
    canonical: "https://ecoafricaawards.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}
