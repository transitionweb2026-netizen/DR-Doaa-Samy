import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionFieldEditor, type EditableField } from "@/components/admin/SectionFieldEditor";
import { CollectionEditor, type CollectionRow } from "@/components/admin/CollectionEditor";
import { COLLECTION_SCHEMAS, SECTION_COLLECTIONS } from "@/lib/admin/collectionSchemas";

export async function generateMetadata({ params }: { params: Promise<{ sectionKey: string }> }) {
  const { sectionKey } = await params;
  return { title: sectionKey.replace(/_/g, " ") };
}

export default async function AdminSectionEditor({
  params,
}: {
  params: Promise<{ slug: string; sectionKey: string }>;
}) {
  const { slug, sectionKey } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase.from("pages").select("id, name").eq("slug", slug).maybeSingle();
  if (!page) notFound();

  const { data: section } = await supabase
    .from("sections")
    .select("id, name")
    .eq("page_id", page.id)
    .eq("key", sectionKey)
    .maybeSingle();
  if (!section) notFound();

  const { data: fieldRows } = await supabase
    .from("fields")
    .select("id, key, label, field_type, is_translatable, sort_order, field_values(locale, value)")
    .eq("section_id", section.id)
    .order("sort_order", { ascending: true });

  const fields: EditableField[] = (fieldRows ?? []).map((f) => {
    const en = f.field_values?.find((v) => v.locale === "en");
    const ar = f.field_values?.find((v) => v.locale === "ar");
    return {
      id: f.id,
      key: f.key,
      label: f.label,
      fieldType: f.field_type as EditableField["fieldType"],
      isTranslatable: f.is_translatable,
      valueEn: en?.value ?? null,
      valueAr: ar?.value ?? null,
    };
  });

  const collectionKey = SECTION_COLLECTIONS[`${slug}:${sectionKey}`];
  const schema = collectionKey ? COLLECTION_SCHEMAS[collectionKey] : null;

  let collectionRows: CollectionRow[] = [];
  let placementsCtx: { pageId: string; sectionId: string } | undefined;
  let parentCtx: { column: string; value: string } | undefined;

  if (schema) {
    if (schema.usesPlacements) {
      placementsCtx = { pageId: page.id, sectionId: section.id };
      const { data: placements } = await supabase
        .from("content_placements")
        .select("id, item_id, sort_order")
        .eq("section_id", section.id)
        .eq("item_type", schema.itemType)
        .order("sort_order", { ascending: true });

      if (placements && placements.length > 0) {
        const { data: itemRows } = await supabase
          .from(schema.table)
          .select("*")
          .in("id", placements.map((p) => p.item_id));
        const byId = new Map((itemRows ?? []).map((r) => [r.id, r]));
        const mapped: (CollectionRow | null)[] = placements.map((p) => {
          const data = byId.get(p.item_id);
          if (!data) return null;
          return {
            id: p.item_id as string,
            placementId: p.id as string,
            enabled: Boolean(data[schema.enabledColumn]),
            data,
          };
        });
        collectionRows = mapped.filter((r): r is CollectionRow => r !== null);
      }
    } else {
      if (schema.table === "legal_page_blocks") {
        parentCtx = { column: "page_id", value: page.id };
      }
      let query = supabase.from(schema.table).select("*").order("sort_order", { ascending: true });
      if (parentCtx) query = query.eq(parentCtx.column, parentCtx.value);
      const { data: itemRows } = await query;
      collectionRows = (itemRows ?? []).map((data) => ({
        id: data.id,
        enabled: Boolean(data[schema.enabledColumn]),
        data,
      }));
    }
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#ab8f83]">{page.name}</p>
      <h1 className="mb-6 font-serif text-2xl font-medium text-[#3a2420]">{section.name}</h1>

      <SectionFieldEditor fields={fields} />

      {schema ? (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#ab8f83]">
            {schema.displayName}s
          </h2>
          <CollectionEditor schema={schema} initialRows={collectionRows} placements={placementsCtx} parent={parentCtx} />
        </div>
      ) : null}
    </div>
  );
}
