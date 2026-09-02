import type { Metadata, Viewport } from "next";
import "../globals.css";

/**
 * The admin dashboard's own root layout — deliberately separate from the
 * marketing site's (app/(marketing)/layout.tsx). It shares no chrome with
 * the public site: no SiteHeader, SiteFooter, or FloatingContactButtons.
 * Next.js's "multiple root layouts" pattern (route groups, no shared
 * app/layout.tsx above either tree) is what makes that possible — see
 * node_modules/next/dist/docs/.../file-conventions/route-groups.md.
 */
export const metadata: Metadata = {
  title: { template: "%s | CMS Admin", default: "CMS Admin" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="min-h-full bg-[#f7f4f2] font-sans text-[#3a2420]">{children}</body>
    </html>
  );
}
