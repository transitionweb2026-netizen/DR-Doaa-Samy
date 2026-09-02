"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SiteSettingsInput = {
  siteName: string;
  arSiteName: string;
  roleTitle: string;
  arRoleTitle: string;
  tagline: string;
  arTagline: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  email: string;
  address: string;
  arAddress: string;
  footerBlurb: string;
  arFooterBlurb: string;
  copyrightText: string;
  arCopyrightText: string;
};

export async function saveSiteSettings(input: SiteSettingsInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      id: true,
      site_name: input.siteName,
      ar_site_name: input.arSiteName,
      role_title: input.roleTitle,
      ar_role_title: input.arRoleTitle,
      tagline: input.tagline,
      ar_tagline: input.arTagline,
      phone_display: input.phoneDisplay,
      phone_href: input.phoneHref,
      whatsapp_number: input.whatsappNumber,
      email: input.email,
      address: input.address,
      ar_address: input.arAddress,
      footer_blurb: input.footerBlurb,
      ar_footer_blurb: input.arFooterBlurb,
      copyright_text: input.copyrightText,
      ar_copyright_text: input.arCopyrightText,
    },
    { onConflict: "id" },
  );
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true as const };
}
