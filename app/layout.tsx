import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SITE } from "@/lib/constants/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingContactButtons } from "@/components/layout/FloatingContactButtons";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Dr. Doaa Samy is a dermatologist offering personalized skin and aesthetic medicine — from diagnosis to advanced, natural-looking treatment plans.",
  applicationName: SITE.name,
  keywords: [
    "Dr. Doaa Samy",
    "dermatologist",
    "aesthetic medicine",
    "skin care clinic",
    "dermatology",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description:
      "Personalized dermatology and aesthetic medicine, built around your skin and your goals.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description:
      "Personalized dermatology and aesthetic medicine, built around your skin and your goals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b100e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-canvas font-body text-text-secondary">
        <div className="grain-overlay" aria-hidden="true" />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-peach-500 px-5 py-2.5 font-body text-sm font-semibold text-text-inverse transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="relative z-10 flex-1">
          {children}
        </main>
        <SiteFooter />
        <FloatingContactButtons />
      </body>
    </html>
  );
}
