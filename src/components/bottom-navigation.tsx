"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath, NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pt-1 backdrop-blur-sm lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl items-end justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className="mx-auto -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-raised transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Icon aria-hidden className="h-7 w-7" strokeWidth={2.5} />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  isActive ? "text-brand-dark" : "text-subtle hover:text-ink",
                )}
              >
                <Icon aria-hidden className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
