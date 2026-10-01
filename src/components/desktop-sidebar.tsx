"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { isActivePath, NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-surface lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col">
      <div className="px-6 py-7">
        <Logo />
      </div>

      <nav aria-label="Primary" className="flex-1 px-3">
        <ul className="space-y-1">
          {[...NAV_ITEMS, ...SECONDARY_NAV_ITEMS].map((item) => {
            const isActive = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    isActive
                      ? "bg-brand-soft text-brand-dark"
                      : "text-muted hover:bg-canvas hover:text-ink",
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

      <p className="px-6 py-6 text-xs text-subtle">
        Demo mode — data is stored in this browser.
      </p>
    </aside>
  );
}
