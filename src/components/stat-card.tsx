import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  emphasis = false,
  className,
}: {
  label: string;
  value: ReactNode;
  caption?: ReactNode;
  icon?: LucideIcon;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-4 shadow-card sm:p-5",
        emphasis
          ? "border-brand/20 bg-brand-soft"
          : "border-line bg-surface",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "text-xs font-medium",
            emphasis ? "text-brand-dark" : "text-muted",
          )}
        >
          {label}
        </p>
        {Icon ? (
          <Icon
            aria-hidden
            className={cn(
              "h-4 w-4 shrink-0",
              emphasis ? "text-brand" : "text-subtle",
            )}
          />
        ) : null}
      </div>
      <p
        className={cn(
          "tabular mt-2 font-semibold tracking-tight",
          emphasis ? "text-3xl text-brand-dark" : "text-2xl text-ink",
        )}
      >
        {value}
      </p>
      {caption ? (
        <p className="mt-1 text-xs text-subtle">{caption}</p>
      ) : null}
    </div>
  );
}
