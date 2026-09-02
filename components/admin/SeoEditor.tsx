"use client";

import { useState, useTransition } from "react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveSeoMeta, type SeoMetaInput } from "@/app/admin/actions/seo";
import type { Locale } from "@/lib/cms/types";

export type SeoRow = {
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string | null;
  og_description: string | null;
  og_image_id: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image_id: string | null;
  keywords: string[];
  json_ld: unknown;
} | null;

const EMPTY: SeoMetaInput = {
  seoTitle: null,
  metaDescription: null,
  canonicalUrl: null,
  robotsIndex: true,
  robotsFollow: true,
  ogTitle: null,
  ogDescription: null,
  ogImageId: null,
  twitterTitle: null,
  twitterDescription: null,
  twitterImageId: null,
  keywords: [],
  jsonLd: null,
};

function toInput(row: SeoRow): SeoMetaInput {
  if (!row) return EMPTY;
  return {
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    canonicalUrl: row.canonical_url,
    robotsIndex: row.robots_index,
    robotsFollow: row.robots_follow,
    ogTitle: row.og_title,
    ogDescription: row.og_description,
    ogImageId: row.og_image_id,
    twitterTitle: row.twitter_title,
    twitterDescription: row.twitter_description,
    twitterImageId: row.twitter_image_id,
    keywords: row.keywords ?? [],
    jsonLd: row.json_ld ? JSON.stringify(row.json_ld, null, 2) : null,
  };
}

export function SeoEditor({ pageId, initial }: { pageId: string; initial: { en: SeoRow; ar: SeoRow } }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [en, setEn] = useState<SeoMetaInput>(toInput(initial.en));
  const [ar, setAr] = useState<SeoMetaInput>(toInput(initial.ar));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const values = locale === "en" ? en : ar;
  const setValues = locale === "en" ? setEn : setAr;

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveSeoMeta(pageId, locale, values);
      if (!result.ok) setError(result.error);
      else setSaved(true);
    });
  }

  const inputClass =
    "w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20";

  return (
    <div className="rounded-xl border border-[#e7ddd8] bg-white p-6">
      <div className="mb-5 flex gap-1 rounded-lg bg-[#f2e8e3] p-1">
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

      <Field label="SEO title" helpText="Shown in the browser tab and search results — falls back to the page's default if empty.">
        <input
          dir={locale === "ar" ? "rtl" : undefined}
          value={values.seoTitle ?? ""}
          onChange={(e) => setValues({ ...values, seoTitle: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Meta description">
        <textarea
          dir={locale === "ar" ? "rtl" : undefined}
          rows={3}
          value={values.metaDescription ?? ""}
          onChange={(e) => setValues({ ...values, metaDescription: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Canonical URL">
        <input value={values.canonicalUrl ?? ""} onChange={(e) => setValues({ ...values, canonicalUrl: e.target.value })} className={inputClass} />
      </Field>

      <div className="mb-4 flex gap-6">
        <label className="flex items-center gap-2 text-sm text-[#6b4139]">
          <input type="checkbox" checked={values.robotsIndex} onChange={(e) => setValues({ ...values, robotsIndex: e.target.checked })} className="h-4 w-4" />
          Allow indexing
        </label>
        <label className="flex items-center gap-2 text-sm text-[#6b4139]">
          <input type="checkbox" checked={values.robotsFollow} onChange={(e) => setValues({ ...values, robotsFollow: e.target.checked })} className="h-4 w-4" />
          Allow following links
        </label>
      </div>

      <Field label="Keywords">
        <KeywordsInput
          value={values.keywords}
          onChange={(keywords) => setValues({ ...values, keywords })}
          dir={locale === "ar" ? "rtl" : undefined}
        />
      </Field>

      <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-[#ab8f83]">Open Graph (social sharing)</p>
      <Field label="OG title">
        <input dir={locale === "ar" ? "rtl" : undefined} value={values.ogTitle ?? ""} onChange={(e) => setValues({ ...values, ogTitle: e.target.value })} className={inputClass} />
      </Field>
      <Field label="OG description">
        <textarea dir={locale === "ar" ? "rtl" : undefined} rows={2} value={values.ogDescription ?? ""} onChange={(e) => setValues({ ...values, ogDescription: e.target.value })} className={inputClass} />
      </Field>
      <MediaPicker value={values.ogImageId} onChange={(id) => setValues({ ...values, ogImageId: id })} label="OG image" />

      <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-[#ab8f83]">Twitter / X card</p>
      <Field label="Twitter title">
        <input dir={locale === "ar" ? "rtl" : undefined} value={values.twitterTitle ?? ""} onChange={(e) => setValues({ ...values, twitterTitle: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Twitter description">
        <textarea dir={locale === "ar" ? "rtl" : undefined} rows={2} value={values.twitterDescription ?? ""} onChange={(e) => setValues({ ...values, twitterDescription: e.target.value })} className={inputClass} />
      </Field>
      <MediaPicker value={values.twitterImageId} onChange={(id) => setValues({ ...values, twitterImageId: id })} label="Twitter image" />

      <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-[#ab8f83]">Structured data</p>
      <Field label="JSON-LD" helpText="Advanced — raw JSON-LD schema markup. Leave empty unless you know what this is.">
        <textarea
          rows={6}
          value={values.jsonLd ?? ""}
          onChange={(e) => setValues({ ...values, jsonLd: e.target.value })}
          className={`${inputClass} font-mono text-xs`}
        />
      </Field>

      {error ? <p className="mb-3 text-xs text-[#a3403c]">{error}</p> : null}
      {saved ? <p className="mb-3 text-xs text-[#3a7a4f]">Saved.</p> : null}

      <button
        onClick={save}
        disabled={isPending}
        className="rounded-lg bg-[#d88880] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9685e] disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save SEO settings"}
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

function KeywordsInput({ value, onChange, dir }: { value: string[]; onChange: (v: string[]) => void; dir?: "rtl" }) {
  const [draft, setDraft] = useState("");
  function add() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setDraft("");
  }
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {value.map((kw) => (
          <span key={kw} className="flex items-center gap-1 rounded-full bg-[#f2e8e3] px-2.5 py-1 text-xs text-[#6b4139]">
            {kw}
            <button type="button" onClick={() => onChange(value.filter((k) => k !== kw))} className="text-[#ab8f83] hover:text-[#a3403c]">
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        dir={dir}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder="Type a keyword and press Enter"
        className="w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20"
      />
    </div>
  );
}
