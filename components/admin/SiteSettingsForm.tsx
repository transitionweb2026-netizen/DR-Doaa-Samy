"use client";

import { useState, useTransition } from "react";
import { saveSiteSettings, type SiteSettingsInput } from "@/app/admin/actions/siteSettings";

export function SiteSettingsForm({ initial }: { initial: SiteSettingsInput }) {
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [values, setValues] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteSettingsInput>(key: K, v: SiteSettingsInput[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveSiteSettings(values);
      if (!result.ok) setError(result.error);
      else setSaved(true);
    });
  }

  const inputClass =
    "w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20";

  return (
    <div className="rounded-xl border border-[#e7ddd8] bg-white p-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#ab8f83]">Contact details</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone (displayed)">
          <input value={values.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Phone (tel: link)" helpText="e.g. tel:+201000000000">
          <input value={values.phoneHref} onChange={(e) => set("phoneHref", e.target.value)} className={inputClass} />
        </Field>
        <Field label="WhatsApp number" helpText="Digits only, no +, e.g. 201000000000">
          <input value={values.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Email">
          <input value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="mb-5 mt-6 flex gap-1 rounded-lg bg-[#f2e8e3] p-1">
        {(["en", "ar"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
              locale === l ? "bg-white text-[#3a2420] shadow-sm" : "text-[#8a675e]"
            }`}
          >
            {l === "en" ? "English" : "العربية"}
          </button>
        ))}
      </div>

      {locale === "en" ? (
        <>
          <Field label="Site name">
            <input value={values.siteName} onChange={(e) => set("siteName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Role title">
            <input value={values.roleTitle} onChange={(e) => set("roleTitle", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Tagline">
            <input value={values.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Address">
            <input value={values.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Footer blurb">
            <textarea rows={3} value={values.footerBlurb} onChange={(e) => set("footerBlurb", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Copyright text" helpText="Leave empty to auto-generate from the site name and current year.">
            <input value={values.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} className={inputClass} />
          </Field>
        </>
      ) : (
        <>
          <Field label="Site name">
            <input dir="rtl" value={values.arSiteName} onChange={(e) => set("arSiteName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Role title">
            <input dir="rtl" value={values.arRoleTitle} onChange={(e) => set("arRoleTitle", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Tagline">
            <input dir="rtl" value={values.arTagline} onChange={(e) => set("arTagline", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Address">
            <input dir="rtl" value={values.arAddress} onChange={(e) => set("arAddress", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Footer blurb">
            <textarea dir="rtl" rows={3} value={values.arFooterBlurb} onChange={(e) => set("arFooterBlurb", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Copyright text">
            <input dir="rtl" value={values.arCopyrightText} onChange={(e) => set("arCopyrightText", e.target.value)} className={inputClass} />
          </Field>
        </>
      )}

      {error ? <p className="mb-3 text-xs text-[#a3403c]">{error}</p> : null}
      {saved ? <p className="mb-3 text-xs text-[#3a7a4f]">Saved.</p> : null}

      <button
        onClick={save}
        disabled={isPending}
        className="rounded-lg bg-[#d88880] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9685e] disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}

function Field({ label, helpText, children }: { label: string; helpText?: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-[#3a2420]">{label}</span>
      {children}
      {helpText ? <span className="mt-1 block text-xs text-[#ab8f83]">{helpText}</span> : null}
    </label>
  );
}
