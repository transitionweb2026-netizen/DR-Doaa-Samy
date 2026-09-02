import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "@/app/admin/actions";

export const metadata = { title: { template: "%s | CMS Admin", default: "CMS Admin" }, robots: { index: false, follow: false } };

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("slug, name")
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-[#f7f4f2]">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[#e7ddd8] bg-white px-4 py-6">
          <Link href="/admin" className="mb-6 block px-1">
            <p className="font-serif text-lg font-medium text-[#3a2420]">Dr. Doaa Samy</p>
            <p className="text-xs text-[#ab8f83]">Content admin</p>
          </Link>

          <div className="flex-1 overflow-y-auto">
            <AdminNav pages={pages ?? []} />
          </div>

          <div className="mt-4 border-t border-[#e7ddd8] pt-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#6b4139] transition-colors hover:bg-[#efe7e3]"
            >
              <ExternalLink size={16} />
              View site
            </a>
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="truncate text-xs text-[#ab8f83]" title={admin.email}>
                {admin.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="text-[#ab8f83] transition-colors hover:text-[#a3403c]"
                >
                  <LogOut size={15} />
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
