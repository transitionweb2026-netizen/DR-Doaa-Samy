import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { toggleSectionEnabled, togglePagePublished } from "@/app/admin/actions/fields";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function AdminPageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  if (!page) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("id, key, name, is_enabled, sort_order")
    .eq("page_id", page.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#ab8f83]">{page.route}</p>
          <h1 className="font-serif text-2xl font-medium text-[#3a2420]">{page.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/pages/${slug}/seo`}
            className="flex items-center gap-1.5 rounded-lg border border-[#ddd0ca] px-3 py-2 text-sm text-[#6b4139] transition-colors hover:border-[#d88880] hover:text-[#c9685e]"
          >
            <Search size={14} /> SEO
          </Link>
          <label className="flex items-center gap-2.5 text-sm text-[#6b4139]">
            Published
            <ToggleSwitch
              initialChecked={page.is_published}
              onToggle={togglePagePublished.bind(null, page.id)}
              label="Page published"
            />
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e7ddd8] bg-white">
        {(sections ?? []).map((section, i) => (
          <div
            key={section.id}
            className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-[#efe7e3]" : ""}`}
          >
            <Link
              href={`/admin/pages/${slug}/${section.key}`}
              className="flex flex-1 items-center justify-between gap-3 pr-4"
            >
              <div>
                <p className="text-sm font-medium text-[#3a2420]">{section.name}</p>
                <p className="mt-0.5 text-xs text-[#ab8f83]">{section.key}</p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-[#ab8f83]" />
            </Link>
            <ToggleSwitch
              initialChecked={section.is_enabled}
              onToggle={toggleSectionEnabled.bind(null, section.id)}
              label={`${section.name} enabled`}
            />
          </div>
        ))}
        {!sections || sections.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-[#ab8f83]">
            No sections yet for this page — run the seed script to create them.
          </p>
        ) : null}
      </div>
    </div>
  );
}
