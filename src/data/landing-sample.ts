/**
 * Sample data for the marketing mockups only.
 *
 * The app itself starts empty on purpose, so the landing page needs its own
 * illustrative history. Two rules keep these visuals honest:
 *
 * 1. Every figure shown in a mockup is derived by the same pure functions the
 *    real app uses (`src/lib/earnings.ts`), so the monthly total, weekly chart,
 *    hourly average, and tip split can never contradict each other.
 * 2. `REFERENCE_DATE` is pinned rather than read from the clock. A marketing
 *    page rendered at build time and hydrated in an unknown timezone would
 *    otherwise risk mismatched markup and charts that empty out at month
 *    boundaries.
 */

import { thisMonthRange, thisWeekRange, weekdayName } from "@/lib/date";
import {
  bestShift,
  filterByRange,
  shiftTotals,
  sortByDateDesc,
  summarize,
  tipMix,
  weekdaySeries,
  weeklySeries,
} from "@/lib/earnings";
import { MOCK_WORKPLACES } from "@/data/mock-data";
import type { Shift } from "@/types";

/** A Saturday, so "this week" and "this month" both read as partially complete. */
export const REFERENCE_DATE = "2026-09-26";

export const SAMPLE_WORKPLACES = MOCK_WORKPLACES;

type SampleRow = [
  date: string,
  workplaceId: string,
  hoursWorked: number,
  cashTips: number,
  cardTips: number,
  hourlyWage: number,
  notes?: string,
];

/**
 * Six weeks of part-time hospitality work. Weekends run hot and Mondays run
 * cold on purpose: that spread is the problem the product exists to explain.
 */
const SAMPLE_ROWS: SampleRow[] = [
  ["2026-08-18", "wp-harbor", 5.5, 34, 61, 9],
  ["2026-08-21", "wp-harbor", 7.5, 88, 147, 9],
  ["2026-08-22", "wp-lantern", 8, 102, 171, 11.5],
  ["2026-08-26", "wp-harbor", 6, 41, 78, 9],
  ["2026-08-28", "wp-lantern", 8, 96, 168, 11.5],
  ["2026-08-29", "wp-harbor", 7.5, 84, 162, 9],
  ["2026-08-30", "wp-crestline", 6, 30, 95, 18, "Wedding reception"],
  ["2026-08-31", "wp-harbor", 5, 26, 49, 9],
  ["2026-09-03", "wp-harbor", 6.5, 52, 94, 9],
  ["2026-09-04", "wp-lantern", 8, 104, 176, 11.5],
  ["2026-09-05", "wp-lantern", 8.5, 112, 189, 11.5],
  ["2026-09-08", "wp-harbor", 5.5, 31, 58, 9],
  ["2026-09-11", "wp-harbor", 7.5, 92, 151, 9],
  ["2026-09-12", "wp-crestline", 7, 45, 120, 18, "Corporate banquet"],
  ["2026-09-14", "wp-harbor", 5, 24, 47, 9, "Slow lunch shift"],
  ["2026-09-17", "wp-lantern", 6.5, 58, 103, 11.5],
  ["2026-09-18", "wp-lantern", 8, 108, 182, 11.5],
  ["2026-09-19", "wp-harbor", 8, 97, 168, 9],
  ["2026-09-21", "wp-harbor", 5, 28, 52, 9, "Monday open"],
  ["2026-09-24", "wp-harbor", 6.5, 55, 98, 9],
  ["2026-09-25", "wp-lantern", 7.5, 95, 155, 11.5, "Patio was packed"],
  ["2026-09-26", "wp-lantern", 8, 115, 193, 11.5],
];

export const SAMPLE_SHIFTS: Shift[] = SAMPLE_ROWS.map(
  ([date, workplaceId, hoursWorked, cashTips, cardTips, hourlyWage, notes]) => ({
    id: `sample-${date}-${workplaceId}`,
    date,
    workplaceId,
    hoursWorked,
    cashTips,
    cardTips,
    hourlyWage,
    notes,
    createdAt: `${date}T23:30:00.000Z`,
  }),
);

export function sampleWorkplaceName(workplaceId: string): string {
  return (
    SAMPLE_WORKPLACES.find((workplace) => workplace.id === workplaceId)?.name ??
    "Workplace"
  );
}

const monthShifts = filterByRange(SAMPLE_SHIFTS, thisMonthRange(REFERENCE_DATE));
const weekShifts = filterByRange(SAMPLE_SHIFTS, thisWeekRange(REFERENCE_DATE));

/** Everything the mockups render, computed once from the sample history. */
export const SAMPLE_METRICS = {
  month: summarize(monthShifts),
  week: summarize(weekShifts),
  allTime: summarize(SAMPLE_SHIFTS),
  /** Six Monday-based weeks ending in the reference week. */
  weeklySeries: weeklySeries(SAMPLE_SHIFTS, 6, REFERENCE_DATE),
  /** Average earnings per shift by weekday, Monday first. */
  weekdaySeries: weekdaySeries(SAMPLE_SHIFTS),
  tipMix: tipMix(monthShifts),
  recentShifts: sortByDateDesc(SAMPLE_SHIFTS).slice(0, 4),
  bestShift: bestShift(SAMPLE_SHIFTS),
} as const;

/** The strongest weekday by average earnings per shift. */
export const SAMPLE_BEST_WEEKDAY = SAMPLE_METRICS.weekdaySeries.reduce(
  (best, point) => (point.totalEarnings > best.totalEarnings ? point : best),
);

/**
 * The same day spelled out. `EarningsPoint.label` is abbreviated for chart
 * axes, which reads too terse in a headline figure or a sentence.
 */
export const SAMPLE_BEST_WEEKDAY_NAME = weekdayName(
  Number(SAMPLE_BEST_WEEKDAY.key),
);

export const SAMPLE_BEST_SHIFT_TOTALS = SAMPLE_METRICS.bestShift
  ? shiftTotals(SAMPLE_METRICS.bestShift)
  : null;

/**
 * The two shifts the problem section contrasts. Pulled from the same history
 * rather than hardcoded, so the narrative always matches the charts.
 */
export const SAMPLE_SWING = {
  high: SAMPLE_SHIFTS.find((shift) => shift.date === "2026-09-25")!,
  low: SAMPLE_SHIFTS.find((shift) => shift.date === "2026-09-21")!,
} as const;
