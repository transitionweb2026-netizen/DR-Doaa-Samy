import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CollectionEditor, type CollectionRow } from "@/components/admin/CollectionEditor";
import { TREATMENTS_SCHEMA } from "@/lib/admin/collectionSchemas";

export async function generateMetadata({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase.from("treatment_categories").select("title").eq("id", categoryId).maybeSingle();
  return { title: category ? `${category.title} treatments` : "Treatments" };
}

export default async function AdminTreatmentsPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("treatment_categories")
    .select("id, title")
    .eq("id", categoryId)
    .maybeSingle();
  if (!category) notFound();

  const { data: rows } = await supabase
    .from("treatments")
    .select("*")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  const collectionRows: CollectionRow[] = (rows ?? []).map((data) => ({
    id: data.id,
    enabled: Boolean(data.is_enabled),
    data,
  }));

  return (
    <div>
      <Link href="/admin/pages/services/categories" className="mb-3 flex items-center gap-1.5 text-sm text-[#8a675e] hover:text-[#c9685e]">
        <ArrowLeft size={14} /> Back to treatment categories
      </Link>
      <p className="text-xs font-medium uppercase tracking-wide text-[#ab8f83]">Treatment category</p>
      <h1 className="mb-6 font-serif text-2xl font-medium text-[#3a2420]">{category.title}</h1>

      <CollectionEditor
        schema={TREATMENTS_SCHEMA}
        initialRows={collectionRows}
        parent={{ column: "category_id", value: category.id }}
      />
    </div>
  );
}
