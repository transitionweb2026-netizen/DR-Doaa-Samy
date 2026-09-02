"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveSectionFields, type FieldValueInput } from "@/app/admin/actions/fields";

export type EditableField = {
  id: string;
  key: string;
  label: string;
  fieldType: "text" | "textarea" | "richtext" | "image" | "url" | "number" | "boolean" | "list";
  isTranslatable: boolean;
  valueEn: unknown;
  valueAr: unknown;
};

export function SectionFieldEditor({ fields }: { fields: EditableField[] }) {
  const hasTranslatable = fields.some((f) => f.isTranslatable);
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [valuesEn, setValuesEn] = useState<Record<string, unknown>>(
    Object.fromEntries(fields.map((f) => [f.key, f.valueEn])),
  );
  const [valuesAr, setValuesAr] = useState<Record<string, unknown>>(
    Object.fromEntries(fields.map((f) => [f.key, f.valueAr])),
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function save() {
    setError(null);
    setSaved(false);
    const payload: FieldValueInput[] = [];
    for (const field of fields) {
      payload.push({ fieldId: field.id, locale: "en", value: valuesEn[field.key] ?? null });
      if (field.isTranslatable) {
        payload.push({ fieldId: field.id, locale: "ar", value: valuesAr[field.key] || null });
      }
    }
    startTransition(async () => {
      const result = await saveSectionFields(payload);
      if (!result.ok) setError(result.error ?? "Something went wrong.");
      else setSaved(true);
    });
  }

  if (fields.length === 0) {
    return <p className="text-sm text-[#ab8f83]">No fields configured for this section yet.</p>;
  }

  return (
    <div className="rounded-xl border border-[#e7ddd8] bg-white p-6">
      {hasTranslatable ? (
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
      ) : null}

      {fields.map((field) => {
        const showAr = field.isTranslatable && locale === "ar";
        if (field.isTranslatable && locale === "ar") {
          return (
            <FieldInput
              key={field.id}
              field={field}
              value={valuesAr[field.key]}
              dir="rtl"
              onChange={(v) => setValuesAr((prev) => ({ ...prev, [field.key]: v }))}
            />
          );
        }
        if (!showAr) {
          return (
            <FieldInput
              key={field.id}
              field={field}
              value={valuesEn[field.key]}
              onChange={(v) => setValuesEn((prev) => ({ ...prev, [field.key]: v }))}
            />
          );
        }
        return null;
      })}

      {error ? <p className="mb-3 text-xs text-[#a3403c]">{error}</p> : null}
      {saved ? <p className="mb-3 text-xs text-[#3a7a4f]">Saved — live on the site now.</p> : null}

      <button
        onClick={save}
        disabled={isPending}
        className="rounded-lg bg-[#d88880] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9685e] disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  dir,
}: {
  field: EditableField;
  value: unknown;
  onChange: (v: unknown) => void;
  dir?: "rtl";
}) {
  const base =
    "w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20";

  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-[#3a2420]">{field.label}</span>

      {field.fieldType === "text" || field.fieldType === "url" ? (
        <input
          dir={dir}
          type={field.fieldType === "url" ? "url" : "text"}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : null}

      {field.fieldType === "textarea" || field.fieldType === "richtext" ? (
        <textarea
          dir={dir}
          rows={field.fieldType === "richtext" ? 6 : 3}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : null}

      {field.fieldType === "number" ? (
        <input
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className={base}
        />
      ) : null}

      {field.fieldType === "boolean" ? (
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      ) : null}

      {field.fieldType === "image" ? (
        <MediaPicker value={typeof value === "string" ? value : null} onChange={onChange} label="" />
      ) : null}

      {field.fieldType === "list" ? (
        <ListInput dir={dir} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
      ) : null}
    </label>
  );
}

function ListInput({ value, onChange, dir }: { value: string[]; onChange: (v: string[]) => void; dir?: "rtl" }) {
  function update(i: number, text: string) {
    const next = [...value];
    next[i] = text;
    onChange(next);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            dir={dir}
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20"
          />
          <button type="button" onClick={() => remove(i)} aria-label="Remove item" className="shrink-0 text-[#ab8f83] hover:text-[#a3403c]">
            <X size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ""])} className="text-xs font-medium text-[#c9685e]">
        + Add item
      </button>
    </div>
  );
}
