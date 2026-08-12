import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://ecoawardsafrica.com"),
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
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Africa Climate Leadership Awards — Celebrating Climate Leadership Across Africa",
    description:
      "Honouring the visionaries, innovators, and communities driving Africa's climate future. Nominate a leader, register for the ceremony, and celebrate continental climate excellence.",
    url: "https://ecoawardsafrica.com",
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
    canonical: "https://ecoawardsafrica.com",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}
