import Link from "next/link";
import { ArrowRight, FileText, ImageIcon, LayoutGrid } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ data: pages }, { count: mediaCount }, { count: sectionsCount }] = await Promise.all([
    supabase.from("pages").select("slug, name, route, is_published, sort_order").order("sort_order", { ascending: true }),
    supabase.from("media").select("id", { count: "exact", head: true }),
    supabase.from("sections").select("id", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-[#3a2420]">Dashboard</h1>
      <p className="mt-1 text-sm text-[#6b4139]">Manage every page, section, and piece of media on the site.</p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard icon={FileText} label="Pages" value={pages?.length ?? 0} />
        <StatCard icon={LayoutGrid} label="Sections" value={sectionsCount ?? 0} />
        <StatCard icon={ImageIcon} label="Media items" value={mediaCount ?? 0} />
      </div>

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wide text-[#ab8f83]">Pages</h2>
      <div className="overflow-hidden rounded-xl border border-[#e7ddd8] bg-white">
        {(pages ?? []).map((page, i) => (
          <Link
            key={page.slug}
            href={`/admin/pages/${page.slug}`}
            className={`flex items-center justify-between px-5 py-4 transition-colors hover:bg-[#faf7f5] ${
              i > 0 ? "border-t border-[#efe7e3]" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium text-[#3a2420]">{page.name}</p>
              <p className="mt-0.5 text-xs text-[#ab8f83]">{page.route}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  page.is_published ? "bg-[#e4f2e8] text-[#3a7a4f]" : "bg-[#f2e8e3] text-[#ab8f83]"
                }`}
              >
                {page.is_published ? "Published" : "Draft"}
              </span>
              <ArrowRight size={16} className="text-[#ab8f83]" />
            </div>
          </Link>
        ))}
        {!pages || pages.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-[#ab8f83]">
            No pages yet — run the seed script (npm run cms:seed) to populate the CMS from the site&rsquo;s existing
            content.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#e7ddd8] bg-white p-5">
      <div className="flex items-center gap-2 text-[#ab8f83]">
        <Icon size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-serif text-2xl font-medium text-[#3a2420]">{value}</p>
    </div>
  );
}
