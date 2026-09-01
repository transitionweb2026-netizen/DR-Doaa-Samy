"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { isRouteBuilt, type NavItem } from "@/lib/constants/site";

export function NavLink({
  item,
  className,
  onClick,
}: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      // Prefetching an unbuilt route just 404s in the background.
      prefetch={isRouteBuilt(item.href) ? undefined : false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative font-body text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-text-primary",
        isActive && "text-text-primary",
        className,
      )}
    >
      {item.label}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-peach-400 transition-transform duration-300",
          isActive && "scale-x-100",
        )}
      />
    </Link>
  );
}
