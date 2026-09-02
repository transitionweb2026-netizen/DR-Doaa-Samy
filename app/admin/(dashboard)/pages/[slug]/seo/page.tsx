import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SeoEditor } from "@/components/admin/SeoEditor";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `SEO — ${slug.replace(/-/g, " ")}` };
}

export default async function AdminSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase.from("pages").select("id, name, route").eq("slug", slug).maybeSingle();
  if (!page) notFound();

  const { data: seoRows } = await supabase.from("seo_meta").select("*").eq("page_id", page.id);
  const en = seoRows?.find((r) => r.locale === "en") ?? null;
  const ar = seoRows?.find((r) => r.locale === "ar") ?? null;

  return (
    <div>
      <Link href={`/admin/pages/${slug}`} className="mb-3 flex items-center gap-1.5 text-sm text-[#8a675e] hover:text-[#c9685e]">
        <ArrowLeft size={14} /> Back to {page.name}
      </Link>
      <p className="text-xs font-medium uppercase tracking-wide text-[#ab8f83]">{page.route}</p>
      <h1 className="mb-6 font-serif text-2xl font-medium text-[#3a2420]">SEO — {page.name}</h1>

      <SeoEditor pageId={page.id} initial={{ en, ar }} />
    </div>
  );
}
