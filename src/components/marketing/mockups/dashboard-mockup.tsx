import { Banknote, Clock, TrendingUp, Wallet } from "lucide-react";

import {
  MockBarChart,
  MockSplitBar,
} from "@/components/marketing/mockups/mock-charts";
import { MockFrame } from "@/components/marketing/mockups/mock-frame";
import {
  SAMPLE_METRICS,
  sampleWorkplaceName,
} from "@/data/landing-sample";
import { formatShiftDate } from "@/lib/date";
import { shiftTotals } from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";
import { cn } from "@/lib/utils";

const { month, weeklySeries, tipMix, recentShifts } = SAMPLE_METRICS;

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  caption,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.6875rem] font-medium text-muted">{label}</p>
        <Icon className="h-3.5 w-3.5 shrink-0 text-subtle" />
      </div>
      <p className="tabular mt-1.5 text-xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-0.5 text-[0.6875rem] text-subtle">{caption}</p>
    </Panel>
  );
}

/** The hero visual: a full Tiply dashboard rendered from the sample history. */
export function DashboardMockup({ className }: { className?: string }) {
  return (
    <MockFrame label="Tiply — Dashboard" className={className}>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-brand-soft p-4 sm:col-span-2 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-brand-dark">
              Total earnings this month
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[0.625rem] font-semibold text-brand-dark">
              <TrendingUp className="h-3 w-3" />
              September
            </span>
          </div>
          <p className="tabular mt-2 text-4xl leading-none font-semibold tracking-tight text-ink sm:text-5xl">
            {formatCurrency(month.totalEarnings)}
          </p>
          <p className="tabular mt-2 text-xs text-brand-dark/80">
            {month.shiftCount} shifts · {formatHours(month.hoursWorked)} worked ·{" "}
            {formatCurrency(month.tips, "USD", { maximumFractionDigits: 0 })} in
            tips
          </p>
        </div>

        <div className="grid gap-3 sm:grid-rows-2">
          <MiniStat
            icon={Clock}
            label="Average per hour"
            value={formatCurrency(month.averagePerHour)}
            caption="Tips plus base wage"
          />
          <MiniStat
            icon={Wallet}
            label="Average per shift"
            value={formatCurrency(month.averagePerShift)}
            caption="Across this month"
          />
        </div>

        <Panel className="sm:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-ink">Weekly income</p>
            <p className="text-[0.625rem] text-subtle">Last 6 weeks</p>
          </div>
          <MockBarChart data={weeklySeries} className="mt-3" />
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-ink">Cash vs. card tips</p>
            <Banknote className="h-3.5 w-3.5 shrink-0 text-subtle" />
          </div>
          <p className="tabular mt-1.5 text-lg font-semibold text-ink">
            {formatCurrency(tipMix.cash + tipMix.card, "USD", {
              maximumFractionDigits: 0,
            })}
          </p>
          <div className="mt-3">
            <MockSplitBar
              cash={tipMix.cash}
              card={tipMix.card}
              cashShare={tipMix.cashShare}
              cardShare={tipMix.cardShare}
            />
          </div>
        </Panel>

        <Panel className="sm:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-ink">Recent shifts</p>
            <p className="text-[0.625rem] text-subtle">
              {recentShifts.length} most recent
            </p>
          </div>
          <ul className="mt-2 divide-y divide-line">
            {recentShifts.map((shift) => {
              const totals = shiftTotals(shift);
              return (
                <li
                  key={shift.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-ink">
                      {formatShiftDate(shift.date)}
                    </p>
                    <p className="truncate text-[0.6875rem] text-subtle">
                      {sampleWorkplaceName(shift.workplaceId)} ·{" "}
                      {formatHours(shift.hoursWorked)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                    <span className="tabular hidden text-[0.6875rem] text-muted sm:inline">
                      {formatCurrency(shift.cashTips, "USD", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      cash ·{" "}
                      {formatCurrency(shift.cardTips, "USD", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      card
                    </span>
                    <span className="text-right">
                      <span className="tabular block text-sm font-semibold text-ink">
                        {formatCurrency(totals.totalEarnings)}
                      </span>
                      <span className="tabular block text-[0.625rem] text-subtle">
                        {formatCurrency(totals.effectiveHourlyRate)}/hr
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </MockFrame>
  );
}
