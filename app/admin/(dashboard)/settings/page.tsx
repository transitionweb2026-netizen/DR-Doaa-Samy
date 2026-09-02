import { createClient } from "@/lib/supabase/server";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { CollectionEditor, type CollectionRow } from "@/components/admin/CollectionEditor";
import { NAV_ITEMS_SCHEMA, SOCIAL_LINKS_SCHEMA } from "@/lib/admin/collectionSchemas";
import type { SiteSettingsInput } from "@/app/admin/actions/siteSettings";

export const metadata = { title: "Site Settings" };

function toRows(data: Record<string, unknown>[] | null, enabledColumn: string): CollectionRow[] {
  return (data ?? []).map((row) => ({ id: row.id as string, enabled: Boolean(row[enabledColumn]), data: row }));
}

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: headerNav }, { data: footerNav }, { data: social }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", true).maybeSingle(),
    supabase.from("nav_items").select("*").eq("location", "header").order("sort_order", { ascending: true }),
    supabase.from("nav_items").select("*").eq("location", "footer").order("sort_order", { ascending: true }),
    supabase.from("social_links").select("*").order("sort_order", { ascending: true }),
  ]);

  const initial: SiteSettingsInput = {
    siteName: settings?.site_name ?? "Dr. Doaa Samy",
    arSiteName: settings?.ar_site_name ?? "",
    roleTitle: settings?.role_title ?? "Dermatologist",
    arRoleTitle: settings?.ar_role_title ?? "",
    tagline: settings?.tagline ?? "",
    arTagline: settings?.ar_tagline ?? "",
    phoneDisplay: settings?.phone_display ?? "",
    phoneHref: settings?.phone_href ?? "",
    whatsappNumber: settings?.whatsapp_number ?? "",
    email: settings?.email ?? "",
    address: settings?.address ?? "",
    arAddress: settings?.ar_address ?? "",
    footerBlurb: settings?.footer_blurb ?? "",
    arFooterBlurb: settings?.ar_footer_blurb ?? "",
    copyrightText: settings?.copyright_text ?? "",
    arCopyrightText: settings?.ar_copyright_text ?? "",
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-[#3a2420]">Site Settings</h1>
      <p className="mt-1 text-sm text-[#6b4139]">Brand name, contact details, navigation, and social links — used site-wide.</p>

      <div className="mt-6">
        <SiteSettingsForm initial={initial} />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-[#ab8f83]">Header navigation</h2>
      <CollectionEditor schema={NAV_ITEMS_SCHEMA} initialRows={toRows(headerNav, "is_enabled")} parent={{ column: "location", value: "header" }} />

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-[#ab8f83]">Footer navigation</h2>
      <CollectionEditor schema={NAV_ITEMS_SCHEMA} initialRows={toRows(footerNav, "is_enabled")} parent={{ column: "location", value: "footer" }} />

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-[#ab8f83]">Social links</h2>
      <CollectionEditor schema={SOCIAL_LINKS_SCHEMA} initialRows={toRows(social, "is_enabled")} />
    </div>
  );
}
