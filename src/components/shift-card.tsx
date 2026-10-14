import { Banknote, Clock, CreditCard } from "lucide-react";

import { relativeDayLabel } from "@/lib/date";
import { shiftTotals } from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CurrencyCode, Shift } from "@/types";

export function ShiftCard({
  shift,
  workplaceName,
  currency = "USD",
  className,
}: {
  shift: Shift;
  workplaceName: string;
  currency?: CurrencyCode;
  className?: string;
}) {
  const totals = shiftTotals(shift);

  return (
    <article
      className={cn(
        "rounded-3xl border border-line bg-surface p-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">
            {relativeDayLabel(shift.date)}
          </p>
          <p className="truncate text-xs text-muted">{workplaceName}</p>
        </div>
        <div className="text-right">
          <p className="tabular text-lg font-semibold text-ink">
            {formatCurrency(totals.totalEarnings, currency)}
          </p>
          <p className="tabular text-xs text-subtle">
            {formatCurrency(totals.effectiveHourlyRate, currency)}/hr
          </p>
        </div>
      </div>

      <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <Clock aria-hidden className="h-3.5 w-3.5 text-subtle" />
          <dt className="sr-only">Hours worked</dt>
          <dd className="tabular">{formatHours(shift.hoursWorked)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Banknote aria-hidden className="h-3.5 w-3.5 text-cash" />
          <dt className="sr-only">Cash tips</dt>
          <dd className="tabular">{formatCurrency(shift.cashTips, currency)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard aria-hidden className="h-3.5 w-3.5 text-card" />
          <dt className="sr-only">Card tips</dt>
          <dd className="tabular">{formatCurrency(shift.cardTips, currency)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="text-subtle">Tips</dt>
          <dd className="tabular font-medium text-ink">
            {formatCurrency(totals.tips, currency)}
          </dd>
        </div>
      </dl>

      {shift.notes ? (
        <p className="mt-3 border-t border-line pt-3 text-xs text-muted italic">
          {shift.notes}
        </p>
      ) : null}
    </article>
  );
}
