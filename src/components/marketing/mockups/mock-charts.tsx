import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EarningsPoint } from "@/types";

/**
 * Lightweight chart primitives for the marketing mockups.
 *
 * The app's Recharts components are reused further down the page where their
 * tooltips add something. Up here they would be the wrong tool: Recharts
 * measures its container before drawing, so a hero chart would render as blank
 * space until hydration. These are plain elements driven by the same
 * `EarningsPoint` contract, so the data shape never diverges.
 */

export function MockBarChart({
  data,
  className,
  highlightLast = true,
}: {
  data: readonly EarningsPoint[];
  className?: string;
  highlightLast?: boolean;
}) {
  const max = Math.max(...data.map((point) => point.totalEarnings), 1);

  return (
    <div className={cn("flex items-end gap-1.5 sm:gap-2", className)}>
      {data.map((point, index) => {
        const isLast = index === data.length - 1;
        return (
          <div
            key={point.key}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex h-20 w-full items-end sm:h-24">
              <div
                className={cn(
                  "animate-grow-bar w-full rounded-t-md",
                  highlightLast && isLast ? "bg-brand" : "bg-brand/25",
                )}
                style={{
                  height: `${Math.max((point.totalEarnings / max) * 100, 4)}%`,
                  animationDelay: `${index * 70}ms`,
                }}
              />
            </div>
            <span className="w-full truncate text-center text-[0.5rem] text-subtle sm:text-[0.625rem]">
              {point.label.split(" – ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Cash-versus-card split as a single segmented track plus a legend. */
export function MockSplitBar({
  cash,
  card,
  cashShare,
  cardShare,
}: {
  cash: number;
  card: number;
  cashShare: number;
  cardShare: number;
}) {
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-line">
        <div
          className="animate-grow-track bg-cash"
          style={{ width: `${cashShare}%` }}
        />
        <div
          className="animate-grow-track bg-card"
          style={{ width: `${cardShare}%`, animationDelay: "120ms" }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-2 w-2 shrink-0 rounded-full bg-cash" />
          Cash
          <span className="tabular font-semibold text-ink">
            {formatCurrency(cash, "USD", { maximumFractionDigits: 0 })}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-muted">
          <span className="h-2 w-2 shrink-0 rounded-full bg-card" />
          Card
          <span className="tabular font-semibold text-ink">
            {formatCurrency(card, "USD", { maximumFractionDigits: 0 })}
          </span>
        </span>
      </div>
    </div>
  );
}

/** Horizontal ranked bars, used for average earnings by weekday. */
export function MockRankedBars({
  data,
  className,
}: {
  data: readonly EarningsPoint[];
  className?: string;
}) {
  const max = Math.max(...data.map((point) => point.totalEarnings), 1);

  return (
    <ul className={cn("space-y-2", className)}>
      {data.map((point, index) => {
        const isBest = point.totalEarnings === max;
        return (
          <li key={point.key} className="flex items-center gap-3">
            <span className="w-8 shrink-0 text-xs font-medium text-subtle">
              {point.label}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
              <span
                className={cn(
                  "animate-grow-track block h-full rounded-full",
                  isBest ? "bg-brand" : "bg-brand/30",
                )}
                style={{
                  width: `${(point.totalEarnings / max) * 100}%`,
                  animationDelay: `${index * 60}ms`,
                }}
              />
            </span>
            <span className="tabular w-14 shrink-0 text-right text-xs font-semibold text-ink">
              {formatCurrency(point.totalEarnings, "USD", {
                maximumFractionDigits: 0,
              })}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
