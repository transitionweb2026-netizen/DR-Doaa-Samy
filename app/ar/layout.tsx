import type { Metadata, Viewport } from "next";
import { Markazi_Text, Cairo } from "next/font/google";
import { SITE_AR } from "@/lib/constants/site.ar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingContactButtons } from "@/components/layout/FloatingContactButtons";
import { getNavItems, getSiteSettings, getSocialLinks } from "@/lib/cms/siteSettings";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { getUiStrings } from "@/lib/i18n/ui";
import { SiteContactProvider } from "@/lib/i18n/SiteContactContext";
import "../globals.css";

// Same CSS variable NAMES as the English tree's Fraunces/Manrope
// (globals.css's `--font-display`/`--font-body` read `--font-fraunces`/
// `--font-manrope` by name, not by font) — assigning Arabic-capable fonts
// to those same variables here means the whole shared component library
// renders in proper Arabic type with zero changes to globals.css or any
// component. Markazi Text is a display serif in the same editorial spirit
// as Fraunces; Cairo is a clean geometric sans in the same spirit as
// Manrope, and one of the most widely used Arabic UI typefaces.
const fraunces = Markazi_Text({
  variable: "--font-fraunces",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const manrope = Cairo({
  variable: "--font-manrope",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const locale = "ar" as const;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.drdoaasamy.com"),
  title: {
    default: `${SITE_AR.name} — ${SITE_AR.role} | ${SITE_AR.tagline}`,
    template: `%s | ${SITE_AR.name}`,
  },
  description: "د. دعاء سامي، استشارية الأمراض الجلدية، تقدم رعاية جلدية وتجميلية شخصية — من التشخيص إلى خطط علاجية متقدمة وطبيعية المظهر.",
  applicationName: SITE_AR.name,
  keywords: ["د. دعاء سامي", "طبيب جلدية", "طب تجميل", "عيادة جلدية", "أمراض جلدية"],
  alternates: {
    canonical: "/ar",
    languages: { en: "/", ar: "/ar" },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE_AR.url,
    siteName: SITE_AR.name,
    title: `${SITE_AR.name} — ${SITE_AR.role}`,
    description: "رعاية جلدية وتجميلية شخصية، مبنية حول بشرتك وأهدافك.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_AR.name} — ${SITE_AR.role}`,
    description: "رعاية جلدية وتجميلية شخصية، مبنية حول بشرتك وأهدافك.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1b100e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function ArabicRootLayout({ children }: { children: React.ReactNode }) {
  const [headerNav, footerNav, socialLinks, settings] = await Promise.all([
    getNavItems("header", locale),
    getNavItems("footer", locale),
    getSocialLinks(),
    getSiteSettings(locale),
  ]);
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "مرحباً، أود الاستفسار عن حجز استشارة مع الدكتورة دعاء سامي.",
  )}`;
  const t = getUiStrings(locale);

  return (
    <html lang="ar" dir="rtl" className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-canvas font-body text-text-secondary">
        <LocaleProvider locale={locale}>
        <SiteContactProvider
          value={{
            phoneDisplay: settings.phoneDisplay,
            phoneHref: settings.phoneHref,
            whatsappHref,
            socialLinks,
          }}
        >
          <div className="grain-overlay" aria-hidden="true" />
          <a
            href="#main-content"
            className="fixed right-4 top-4 z-[100] -translate-y-24 rounded-full bg-peach-500 px-5 py-2.5 font-body text-sm font-semibold text-text-inverse transition-transform focus-visible:translate-y-0"
          >
            {t.skipToContent}
          </a>
          <SiteHeader
            navItems={headerNav}
            siteName={settings.siteName}
            roleTitle={settings.roleTitle}
            phoneDisplay={settings.phoneDisplay}
            phoneHref={settings.phoneHref}
            whatsappHref={whatsappHref}
          />
          <main id="main-content" className="relative z-10 flex-1">
            {children}
          </main>
          <SiteFooter
            navItems={footerNav}
            socialLinks={socialLinks}
            siteName={settings.siteName}
            roleTitle={settings.roleTitle}
            tagline={settings.tagline}
            footerBlurb={settings.footerBlurb}
            phones={settings.phones}
            email={settings.email}
            addressLine={settings.addressLine}
            copyrightText={settings.copyrightText}
            locale={locale}
          />
          <FloatingContactButtons
            phoneDisplay={settings.phoneDisplay}
            phoneHref={settings.phoneHref}
            whatsappHref={whatsappHref}
          />
        </SiteContactProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
