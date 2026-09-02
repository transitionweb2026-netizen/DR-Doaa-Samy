"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ImageIcon, FileText, Settings } from "lucide-react";

export type AdminNavPage = { slug: string; name: string };

function NavRow({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
        active ? "bg-[#d88880]/15 font-medium text-[#c9685e]" : "text-[#6b4139] hover:bg-[#efe7e3]"
      }`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AdminNav({ pages }: { pages: AdminNavPage[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      <NavRow href="/admin" label="Dashboard" icon={LayoutDashboard} active={pathname === "/admin"} />
      <NavRow href="/admin/media" label="Media Library" icon={ImageIcon} active={pathname.startsWith("/admin/media")} />
      <NavRow href="/admin/settings" label="Site Settings" icon={Settings} active={pathname.startsWith("/admin/settings")} />

      <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-wide text-[#ab8f83]">Pages</p>
      {pages.map((page) => (
        <NavRow
          key={page.slug}
          href={`/admin/pages/${page.slug}`}
          label={page.name}
          icon={FileText}
          active={pathname.startsWith(`/admin/pages/${page.slug}`)}
        />
      ))}
    </nav>
  );
}
