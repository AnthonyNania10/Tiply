import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  href = "/dashboard",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
        className,
      )}
    >
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white"
      >
        T
      </span>
      <span className="text-lg font-semibold tracking-tight text-ink">Tiply</span>
    </Link>
  );
}
