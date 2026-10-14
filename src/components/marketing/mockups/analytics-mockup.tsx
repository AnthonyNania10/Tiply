import { CalendarCheck, Clock, TrendingUp, Wallet } from "lucide-react";

import { TipMixChart } from "@/components/charts/tip-mix-chart";
import { EarningsChart } from "@/components/earnings-chart";
import { MockFrame } from "@/components/marketing/mockups/mock-frame";
import { StatCard } from "@/components/stat-card";
import {
  SAMPLE_BEST_WEEKDAY,
  SAMPLE_BEST_WEEKDAY_NAME,
  SAMPLE_METRICS,
} from "@/data/landing-sample";
import { formatCurrency, formatHours } from "@/lib/format";

const { month, weeklySeries, tipMix } = SAMPLE_METRICS;

/**
 * The analytics visual for the financial-clarity section.
 *
 * Unlike the hero, this one renders the app's actual `EarningsChart` and
 * `TipMixChart`. It sits below the fold, so Recharts measuring its container
 * before drawing costs nothing, and the interactive tooltips show what the real
 * product feels like rather than an imitation of it.
 */
export function AnalyticsMockup({ className }: { className?: string }) {
  return (
    <MockFrame
      label="Tiply — Analytics"
      decorative={false}
      className={className}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Earnings this month"
          value={formatCurrency(month.totalEarnings)}
          caption={`${month.shiftCount} shifts · ${formatHours(month.hoursWorked)}`}
          icon={TrendingUp}
          emphasis
          className="rounded-2xl shadow-none"
        />
        <StatCard
          label="Average per shift"
          value={formatCurrency(month.averagePerShift)}
          caption="This month"
          icon={Wallet}
          className="rounded-2xl shadow-none"
        />
        <StatCard
          label="Average per hour"
          value={formatCurrency(month.averagePerHour)}
          caption="Tips plus base wage"
          icon={Clock}
          className="rounded-2xl shadow-none"
        />
        <StatCard
          label="Highest-earning day"
          value={SAMPLE_BEST_WEEKDAY_NAME}
          caption={`${formatCurrency(SAMPLE_BEST_WEEKDAY.totalEarnings)} average per shift`}
          icon={CalendarCheck}
          className="rounded-2xl shadow-none"
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-line bg-surface p-4 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ink">
              Weekly income trend
            </h3>
            <p className="text-xs text-subtle">Last 6 weeks</p>
          </div>
          <div className="mt-2">
            <EarningsChart
              data={weeklySeries}
              variant="area"
              height={200}
              label="Sample weekly earnings over the last six weeks"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-ink">Cash vs. card tips</h3>
          <p className="mt-0.5 text-xs text-subtle">
            {formatCurrency(tipMix.cash + tipMix.card)} in tips this month
          </p>
          <div className="mt-4">
            <TipMixChart mix={tipMix} />
          </div>
        </div>
      </div>
    </MockFrame>
  );
}
