"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { ShiftCard } from "@/components/shift-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, TextInput } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { LoadingScreen } from "@/components/ui/skeleton";
import { useTiply } from "@/hooks/use-tiply";
import {
  addDays,
  formatMonthKey,
  formatRangeLabel,
  monthKey,
  thisMonthRange,
  thisWeekRange,
  todayISO,
} from "@/lib/date";
import { filterByRange, summarize } from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";
import type { DateRange, Shift } from "@/types";

const FILTERS = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

function groupByMonth(shifts: readonly Shift[]): [string, Shift[]][] {
  const groups = new Map<string, Shift[]>();
  for (const shift of shifts) {
    const key = monthKey(shift.date);
    groups.set(key, [...(groups.get(key) ?? []), shift]);
  }
  return [...groups.entries()];
}

export function HistoryView() {
  const { isLoading, shifts, profile, workplaceName } = useTiply();
  const today = todayISO();

  const [filter, setFilter] = useState<Filter>("month");
  const [customRange, setCustomRange] = useState<DateRange>(() => ({
    start: addDays(today, -29),
    end: today,
  }));

  const range = useMemo<DateRange>(() => {
    if (filter === "week") return thisWeekRange(today);
    if (filter === "month") return thisMonthRange(today);
    return customRange;
  }, [customRange, filter, today]);

  const visibleShifts = useMemo(
    () => filterByRange(shifts, range),
    [range, shifts],
  );
  const summary = useMemo(() => summarize(visibleShifts), [visibleShifts]);
  const groups = useMemo(() => groupByMonth(visibleShifts), [visibleShifts]);

  if (isLoading) return <LoadingScreen label="Loading your shift history" />;

  const isInvalidRange = range.start > range.end;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="History"
        title="Your shifts"
        description="Every shift you've logged, newest first."
        action={
          <ButtonLink href="/shifts/new" className="hidden lg:inline-flex">
            <Plus aria-hidden className="h-5 w-5" />
            Add Shift
          </ButtonLink>
        }
      />

      <div className="space-y-3">
        <SegmentedControl
          label="Date filter"
          options={FILTERS}
          value={filter}
          onChange={setFilter}
        />

        {filter === "custom" ? (
          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-surface p-4 shadow-card">
            <Field label="From" htmlFor="range-start">
              <TextInput
                id="range-start"
                type="date"
                className="px-3"
                value={customRange.start}
                max={customRange.end}
                onChange={(event) =>
                  setCustomRange((current) => ({
                    ...current,
                    start: event.target.value,
                  }))
                }
              />
            </Field>
            <Field
              label="To"
              htmlFor="range-end"
              error={isInvalidRange ? "End date is before the start date." : undefined}
            >
              <TextInput
                id="range-end"
                type="date"
                className="px-3"
                value={customRange.end}
                onChange={(event) =>
                  setCustomRange((current) => ({
                    ...current,
                    end: event.target.value,
                  }))
                }
              />
            </Field>
          </div>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-3 rounded-3xl border border-line bg-surface p-5 shadow-card sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted">{formatRangeLabel(range)}</dt>
          <dd className="tabular mt-1 text-xl font-semibold text-ink">
            {formatCurrency(summary.totalEarnings, profile.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Tips</dt>
          <dd className="tabular mt-1 text-xl font-semibold text-ink">
            {formatCurrency(summary.tips, profile.currency)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Hours</dt>
          <dd className="tabular mt-1 text-xl font-semibold text-ink">
            {formatHours(summary.hoursWorked)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Effective rate</dt>
          <dd className="tabular mt-1 text-xl font-semibold text-ink">
            {formatCurrency(summary.averagePerHour, profile.currency)}/hr
          </dd>
        </div>
      </dl>

      {visibleShifts.length === 0 ? (
        <EmptyState
          title="No shifts in this range"
          description="Try a different date range, or log the shift you just finished."
          action={<ButtonLink href="/shifts/new">Add a shift</ButtonLink>}
        />
      ) : (
        <div className="space-y-6">
          {groups.map(([key, monthShifts]) => (
            <section key={key} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-muted">
                  {formatMonthKey(key)}
                </h2>
                <p className="tabular text-sm text-subtle">
                  {formatCurrency(
                    summarize(monthShifts).totalEarnings,
                    profile.currency,
                  )}
                </p>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {monthShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    workplaceName={workplaceName(shift.workplaceId)}
                    currency={profile.currency}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
