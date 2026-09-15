"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { GripVertical, Link2, Plus, Settings, Trash2, X } from "lucide-react";
import type { CollectionSchema } from "@/lib/admin/collectionSchemas";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { VideoUrlField } from "@/components/admin/VideoUrlField";
import { createClient } from "@/lib/supabase/client";
import {
  createCollectionRow,
  updateCollectionRow,
  deleteCollectionRow,
  reorderCollectionRows,
  placeItemInSection,
  removeItemFromSection,
  reorderPlacements,
  createAndPlaceRow,
} from "@/app/admin/actions/collections";

export type CollectionRow = {
  id: string;
  placementId?: string; // present only in placements mode
  enabled: boolean;
  data: Record<string, unknown>; // all EN + ar_ columns, verbatim from the DB row
};

type PlacementsContext = { pageId: string; sectionId: string };

export function CollectionEditor({
  schema,
  initialRows,
  placements,
  parent,
}: {
  schema: CollectionSchema;
  initialRows: CollectionRow[];
  /** Present only when schema.usesPlacements — enables reorder-within-section + "add existing". */
  placements?: PlacementsContext;
  /** Present only for flat, parent-scoped collections (treatments under a category, legal blocks under a page). */
  parent?: { column: string; value: string };
}) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<CollectionRow | "new" | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditing("new");
  }

  function handleSaved(row: CollectionRow, isNew: boolean) {
    setRows((prev) => (isNew ? [...prev, row] : prev.map((r) => (r.id === row.id ? row : r))));
    setEditing(null);
  }

  function handleDelete(row: CollectionRow) {
    const confirmMsg = placements
      ? "Remove this item from this section? (It stays available to place elsewhere.)"
      : `Delete this ${schema.displayName.toLowerCase()} permanently?`;
    if (!window.confirm(confirmMsg)) return;

    startTransition(async () => {
      const result =
        placements && row.placementId
          ? await removeItemFromSection(row.placementId)
          : await deleteCollectionRow(schema.table, row.id);
      if (result.ok) setRows((prev) => prev.filter((r) => r.id !== row.id));
    });
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...rows];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    startTransition(async () => {
      if (placements) {
        await reorderPlacements(next.map((r) => r.placementId!));
      } else {
        await reorderCollectionRows(schema.table, next.map((r) => r.id));
      }
    });
  }

  async function addExisting(rowId: string) {
    if (!placements) return;
    const result = await placeItemInSection({
      pageId: placements.pageId,
      sectionId: placements.sectionId,
      itemType: schema.itemType,
      itemId: rowId,
      sortOrder: rows.length,
    });
    if (result.ok) {
      const supabase = createClient();
      const { data } = await supabase.from(schema.table).select("*").eq("id", rowId).maybeSingle();
      if (data) {
        setRows((prev) => [...prev, { id: rowId, enabled: Boolean(data[schema.enabledColumn]), data }]);
      }
    }
    setPickerOpen(false);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-[#e7ddd8] bg-white">
        {rows.map((row, i) => (
          <div key={row.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-[#efe7e3]" : ""}`}>
            <div className="flex shrink-0 flex-col text-[#c9b6ad]">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="disabled:opacity-30"
                aria-label="Move up"
              >
                <GripVertical size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setEditing(row)}
              className="min-w-0 flex-1 truncate text-left text-sm text-[#3a2420] hover:text-[#c9685e]"
            >
              {String(row.data[schema.titleColumn] ?? "Untitled")}
              {!row.enabled ? <span className="ml-2 text-xs text-[#ab8f83]">(disabled)</span> : null}
            </button>
            {schema.manageHrefBase ? (
              <Link
                href={`${schema.manageHrefBase}/${row.id}`}
                className="flex shrink-0 items-center gap-1 text-xs text-[#8a675e] hover:text-[#c9685e]"
              >
                <Settings size={13} /> {schema.manageLabel ?? "Manage"}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => handleDelete(row)}
              disabled={isPending}
              aria-label="Remove"
              className="shrink-0 text-[#ab8f83] transition-colors hover:text-[#a3403c]"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-[#ab8f83]">No {schema.displayName.toLowerCase()}s yet.</p>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-1.5 rounded-lg border border-[#ddd0ca] px-3 py-2 text-sm text-[#6b4139] transition-colors hover:border-[#d88880] hover:text-[#c9685e]"
        >
          <Plus size={14} /> Add new {schema.displayName.toLowerCase()}
        </button>
        {placements ? (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#ddd0ca] px-3 py-2 text-sm text-[#6b4139] transition-colors hover:border-[#d88880] hover:text-[#c9685e]"
          >
            <Link2 size={14} /> Reuse existing {schema.displayName.toLowerCase()}
          </button>
        ) : null}
      </div>

      {editing ? (
        <RowFormDrawer
          schema={schema}
          row={editing === "new" ? null : editing}
          placements={placements}
          parent={parent}
          sortOrder={rows.length}
          onClose={() => setEditing(null)}
          onSaved={(row) => handleSaved(row, editing === "new")}
        />
      ) : null}

      {pickerOpen && placements ? (
        <ExistingItemPicker
          schema={schema}
          excludeIds={rows.map((r) => r.id)}
          onPick={addExisting}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add/edit form drawer — every schema's columns rendered generically, with
// an EN/AR tab switch for translatable columns.
// ---------------------------------------------------------------------------

function RowFormDrawer({
  schema,
  row,
  placements,
  parent,
  sortOrder,
  onClose,
  onSaved,
}: {
  schema: CollectionSchema;
  row: CollectionRow | null;
  placements?: PlacementsContext;
  parent?: { column: string; value: string };
  sortOrder: number;
  onClose: () => void;
  onSaved: (row: CollectionRow) => void;
}) {
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [values, setValues] = useState<Record<string, unknown>>(row?.data ?? {});
  const [enabled, setEnabled] = useState(row?.enabled ?? true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const data: Record<string, unknown> = { ...values, [schema.enabledColumn]: enabled };
      if (parent) data[parent.column] = parent.value;

      if (row) {
        const result = await updateCollectionRow(schema.table, row.id, data);
        if (!result.ok) return setError(result.error);
        onSaved({ id: row.id, placementId: row.placementId, enabled, data });
      } else if (placements) {
        const result = await createAndPlaceRow({
          table: schema.table,
          itemType: schema.itemType,
          pageId: placements.pageId,
          sectionId: placements.sectionId,
          sortOrder,
          data,
        });
        if (!result.ok) return setError(result.error);
        onSaved({ id: result.id, placementId: undefined, enabled, data });
      } else {
        data.sort_order = sortOrder;
        const result = await createCollectionRow(schema.table, data);
        if (!result.ok) return setError(result.error);
        onSaved({ id: result.id, enabled, data });
      }
    });
  }

  const hasTranslatable = schema.columns.some((c) => c.translatable);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#3a2420]">
            {row ? `Edit ${schema.displayName.toLowerCase()}` : `New ${schema.displayName.toLowerCase()}`}
          </p>
          <button onClick={onClose} aria-label="Close" className="text-[#ab8f83] hover:text-[#3a2420]">
            <X size={18} />
          </button>
        </div>

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

        {schema.columns.map((col) => {
          if (col.translatable && locale === "ar") {
            return (
              <ColumnField
                key={col.key}
                column={{ ...col, label: col.label }}
                value={values[`ar_${col.key}`]}
                onChange={(v) => setField(`ar_${col.key}`, v)}
                dir="rtl"
              />
            );
          }
          if (col.translatable && locale === "en") {
            return (
              <ColumnField
                key={col.key}
                column={col}
                value={values[col.key]}
                onChange={(v) => setField(col.key, v)}
              />
            );
          }
          if (!col.translatable && locale === "en") {
            return (
              <ColumnField key={col.key} column={col} value={values[col.key]} onChange={(v) => setField(col.key, v)} />
            );
          }
          return null;
        })}

        <label className="mb-5 flex items-center gap-2.5 text-sm text-[#6b4139]">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4" />
          {schema.enabledColumn === "is_published" ? "Published" : "Enabled (visible on the site)"}
        </label>

        {error ? <p className="mb-3 text-xs text-[#a3403c]">{error}</p> : null}

        <button
          onClick={save}
          disabled={isPending}
          className="rounded-lg bg-[#d88880] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c9685e] disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function ColumnField({
  column,
  value,
  onChange,
  dir,
}: {
  column: { key: string; label: string; type: string; options?: { value: string; label: string }[]; helpText?: string };
  value: unknown;
  onChange: (v: unknown) => void;
  dir?: "rtl";
}) {
  const base =
    "w-full rounded-lg border border-[#ddd0ca] bg-[#fbfaf9] px-3 py-2 text-sm text-[#3a2420] outline-none transition-colors focus:border-[#d88880] focus:ring-2 focus:ring-[#d88880]/20";

  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-medium text-[#3a2420]">{column.label}</span>

      {column.type === "text" || column.type === "url" ? (
        <input
          dir={dir}
          type={column.type === "url" ? "url" : "text"}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : null}

      {column.type === "date" ? (
        <input
          type="date"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : null}

      {column.type === "textarea" || column.type === "richtext" ? (
        <textarea
          dir={dir}
          rows={column.type === "richtext" ? 6 : 3}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : null}

      {column.type === "number" ? (
        <input
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className={base}
        />
      ) : null}

      {column.type === "boolean" ? (
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      ) : null}

      {column.type === "select" ? (
        <select
          value={typeof value === "string" || typeof value === "number" ? String(value) : ""}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        >
          {(column.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : null}

      {column.type === "image" ? (
        <MediaPicker
          value={typeof value === "string" ? value : null}
          onChange={onChange}
          label=""
        />
      ) : null}

      {column.type === "video" ? <VideoUrlField value={value} onChange={onChange} dir={dir} /> : null}

      {column.type === "list" ? (
        <ListField dir={dir} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
      ) : null}

      {column.helpText ? <span className="mt-1 block text-xs text-[#ab8f83]">{column.helpText}</span> : null}
    </label>
  );
}

function ListField({ value, onChange, dir }: { value: string[]; onChange: (v: string[]) => void; dir?: "rtl" }) {
  function update(i: number, text: string) {
    const next = [...value];
    next[i] = text;
    onChange(next);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, ""]);
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
      <button type="button" onClick={add} className="text-xs font-medium text-[#c9685e]">
        + Add item
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "Reuse existing" picker — lets a placements-mode section pull in a row
// that already exists elsewhere (e.g. the same Case used on Home and About).
// ---------------------------------------------------------------------------

function ExistingItemPicker({
  schema,
  excludeIds,
  onPick,
  onClose,
}: {
  schema: CollectionSchema;
  excludeIds: string[];
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<{ id: string; label: string }[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from(schema.table)
      .select(`id, ${schema.titleColumn}`)
      .then(({ data }) => {
        if (cancelled) return;
        const rows = (data as Record<string, unknown>[] | null) ?? [];
        setItems(
          rows
            .filter((r) => !excludeIds.includes(r.id as string))
            .map((r) => ({ id: r.id as string, label: String(r[schema.titleColumn] ?? "Untitled") })),
        );
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema.table, schema.titleColumn]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[70vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#3a2420]">Reuse an existing {schema.displayName.toLowerCase()}</p>
          <button onClick={onClose} aria-label="Close" className="text-[#ab8f83] hover:text-[#3a2420]">
            <X size={16} />
          </button>
        </div>
        {items === null ? <p className="text-sm text-[#ab8f83]">Loading…</p> : null}
        {items?.length === 0 ? <p className="text-sm text-[#ab8f83]">Nothing else to reuse.</p> : null}
        <div className="space-y-1">
          {items?.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item.id)}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#3a2420] hover:bg-[#f2e8e3]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
