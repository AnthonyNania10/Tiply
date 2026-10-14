import { Calendar, CalendarRange, Clock, CreditCard, Sun } from "lucide-react";

import { MockRankedBars } from "@/components/marketing/mockups/mock-charts";
import { MockFrame } from "@/components/marketing/mockups/mock-frame";
import {
  SAMPLE_BEST_SHIFT_TOTALS,
  SAMPLE_BEST_WEEKDAY,
  SAMPLE_METRICS,
  SAMPLE_SWING,
  sampleWorkplaceName,
} from "@/data/landing-sample";
import { formatShiftDate } from "@/lib/date";
import { shiftTotals } from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";

const { month, week, allTime, weekdaySeries, bestShift, recentShifts } =
  SAMPLE_METRICS;

/** Step 1 — the four fields a shift actually needs, with totals computed live. */
export function LogShiftMockup() {
  const shift = SAMPLE_SWING.high;
  const totals = shiftTotals(shift);

  const fields = [
    { icon: Calendar, label: "Date", value: formatShiftDate(shift.date) },
    { icon: Clock, label: "Hours worked", value: formatHours(shift.hoursWorked) },
    {
      icon: CreditCard,
      label: "Cash tips",
      value: formatCurrency(shift.cashTips),
    },
    {
      icon: CreditCard,
      label: "Card tips",
      value: formatCurrency(shift.cardTips),
    },
  ];

  return (
    <MockFrame label="Tiply — Add shift">
      <div className="space-y-2.5">
        {fields.map((field) => (
          <div
            key={field.label}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas/60 px-3.5 py-2.5"
          >
            <span className="flex items-center gap-2 text-xs text-muted">
              <field.icon className="h-3.5 w-3.5 shrink-0 text-subtle" />
              {field.label}
            </span>
            <span className="tabular text-sm font-semibold text-ink">
              {field.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-brand-soft p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-medium text-brand-dark">Total earnings</p>
          <p className="tabular text-2xl font-semibold tracking-tight text-ink">
            {formatCurrency(totals.totalEarnings)}
          </p>
        </div>
        <dl className="mt-2.5 grid grid-cols-3 gap-2 border-t border-brand/15 pt-2.5 text-center">
          {[
            { label: "Tips", value: formatCurrency(totals.tips) },
            { label: "Base pay", value: formatCurrency(totals.basePay) },
            {
              label: "Per hour",
              value: formatCurrency(totals.effectiveHourlyRate),
            },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-[0.625rem] text-brand-dark/70">
                {item.label}
              </dt>
              <dd className="tabular text-xs font-semibold text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-3 rounded-full bg-brand py-2.5 text-center text-sm font-medium text-white shadow-raised">
        Save shift
      </div>
    </MockFrame>
  );
}

/** Step 2 — the same history rolled up into the periods people actually ask about. */
export function TrackIncomeMockup() {
  const today = recentShifts[0];
  const todayTotals = shiftTotals(today);

  const periods = [
    {
      icon: Sun,
      label: "Today",
      value: formatCurrency(todayTotals.totalEarnings),
      caption: `1 shift · ${formatHours(today.hoursWorked)}`,
    },
    {
      icon: CalendarRange,
      label: "This week",
      value: formatCurrency(week.totalEarnings),
      caption: `${week.shiftCount} shifts · ${formatHours(week.hoursWorked)}`,
    },
    {
      icon: Calendar,
      label: "This month",
      value: formatCurrency(month.totalEarnings),
      caption: `${month.shiftCount} shifts · ${formatHours(month.hoursWorked)}`,
      emphasis: true,
    },
    {
      icon: Clock,
      label: "Over time",
      value: formatCurrency(allTime.totalEarnings),
      caption: `${allTime.shiftCount} shifts logged`,
    },
  ];

  return (
    <MockFrame label="Tiply — Income summary">
      <div className="grid grid-cols-2 gap-3">
        {periods.map((period) => (
          <div
            key={period.label}
            className={
              period.emphasis
                ? "rounded-2xl bg-brand-soft p-3.5"
                : "rounded-2xl border border-line bg-surface p-3.5"
            }
          >
            <div className="flex items-center justify-between gap-2">
              <p
                className={
                  period.emphasis
                    ? "text-[0.6875rem] font-medium text-brand-dark"
                    : "text-[0.6875rem] font-medium text-muted"
                }
              >
                {period.label}
              </p>
              <period.icon
                className={
                  period.emphasis
                    ? "h-3.5 w-3.5 shrink-0 text-brand"
                    : "h-3.5 w-3.5 shrink-0 text-subtle"
                }
              />
            </div>
            <p className="tabular mt-1.5 text-lg font-semibold tracking-tight text-ink sm:text-xl">
              {period.value}
            </p>
            <p className="mt-0.5 text-[0.625rem] text-subtle">
              {period.caption}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-2xl border border-line bg-canvas/60 px-3.5 py-2.5 text-center text-[0.6875rem] text-muted">
        No spreadsheets, calculators, or accounting software.
      </p>
    </MockFrame>
  );
}

/** Step 3 — the insights the raw history makes possible. */
export function InsightsMockup() {
  return (
    <MockFrame label="Tiply — Insights">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-brand-soft p-3.5">
          <p className="text-[0.6875rem] font-medium text-brand-dark">
            Average hourly
          </p>
          <p className="tabular mt-1.5 text-xl font-semibold tracking-tight text-ink">
            {formatCurrency(month.averagePerHour)}
          </p>
          <p className="mt-0.5 text-[0.625rem] text-brand-dark/70">
            Across {formatHours(month.hoursWorked)}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-3.5">
          <p className="text-[0.6875rem] font-medium text-muted">
            Average per shift
          </p>
          <p className="tabular mt-1.5 text-xl font-semibold tracking-tight text-ink">
            {formatCurrency(month.averagePerShift)}
          </p>
          <p className="mt-0.5 text-[0.625rem] text-subtle">
            {month.shiftCount} shifts this month
          </p>
        </div>
      </div>

      {bestShift && SAMPLE_BEST_SHIFT_TOTALS ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-3.5">
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-medium text-muted">
              Highest-earning shift
            </p>
            <p className="truncate text-xs font-semibold text-ink">
              {formatShiftDate(bestShift.date)} ·{" "}
              {sampleWorkplaceName(bestShift.workplaceId)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular text-sm font-semibold text-ink">
              {formatCurrency(SAMPLE_BEST_SHIFT_TOTALS.totalEarnings)}
            </p>
            <p className="tabular text-[0.625rem] text-subtle">
              {formatCurrency(SAMPLE_BEST_SHIFT_TOTALS.effectiveHourlyRate)}/hr
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-3 rounded-2xl border border-line bg-surface p-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.6875rem] font-medium text-muted">
            Average per shift by day
          </p>
          <p className="text-[0.625rem] font-semibold text-brand-dark">
            {SAMPLE_BEST_WEEKDAY.label} is your best day
          </p>
        </div>
        <MockRankedBars data={weekdaySeries} className="mt-3" />
      </div>
    </MockFrame>
  );
}
