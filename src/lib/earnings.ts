import {
  addDays,
  formatMonthKey,
  formatRangeLabel,
  isWithinRange,
  monthKey,
  startOfWeek,
  weekdayIndex,
  weekdayName,
} from "@/lib/date";
import { roundTo } from "@/lib/utils";
import type {
  DateRange,
  EarningsPoint,
  EarningsSummary,
  Shift,
  ShiftDraft,
  ShiftTotals,
} from "@/types";

export const EMPTY_SUMMARY: EarningsSummary = {
  shiftCount: 0,
  hoursWorked: 0,
  cashTips: 0,
  cardTips: 0,
  tips: 0,
  basePay: 0,
  totalEarnings: 0,
  averagePerHour: 0,
  averagePerShift: 0,
};

/** Totals for a single shift, usable on an unsaved draft. */
export function shiftTotals(shift: Shift | ShiftDraft): ShiftTotals {
  const tips = shift.cashTips + shift.cardTips;
  const basePay = shift.hoursWorked * shift.hourlyWage;
  const totalEarnings = tips + basePay;
  return {
    tips: roundTo(tips),
    basePay: roundTo(basePay),
    totalEarnings: roundTo(totalEarnings),
    effectiveHourlyRate:
      shift.hoursWorked > 0 ? roundTo(totalEarnings / shift.hoursWorked) : 0,
  };
}

export function summarize(shifts: readonly (Shift | ShiftDraft)[]): EarningsSummary {
  if (shifts.length === 0) return EMPTY_SUMMARY;

  const totals = shifts.reduce(
    (acc, shift) => {
      const { tips, basePay, totalEarnings } = shiftTotals(shift);
      acc.hoursWorked += shift.hoursWorked;
      acc.cashTips += shift.cashTips;
      acc.cardTips += shift.cardTips;
      acc.tips += tips;
      acc.basePay += basePay;
      acc.totalEarnings += totalEarnings;
      return acc;
    },
    { ...EMPTY_SUMMARY, shiftCount: shifts.length },
  );

  return {
    shiftCount: totals.shiftCount,
    hoursWorked: roundTo(totals.hoursWorked),
    cashTips: roundTo(totals.cashTips),
    cardTips: roundTo(totals.cardTips),
    tips: roundTo(totals.tips),
    basePay: roundTo(totals.basePay),
    totalEarnings: roundTo(totals.totalEarnings),
    averagePerHour:
      totals.hoursWorked > 0
        ? roundTo(totals.totalEarnings / totals.hoursWorked)
        : 0,
    averagePerShift: roundTo(totals.totalEarnings / totals.shiftCount),
  };
}

export function filterByRange(shifts: readonly Shift[], range: DateRange): Shift[] {
  return shifts.filter((shift) => isWithinRange(shift.date, range));
}

/** Newest first, with a stable tiebreak so re-renders keep the same order. */
export function sortByDateDesc(shifts: readonly Shift[]): Shift[] {
  return [...shifts].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.createdAt < b.createdAt ? 1 : -1;
  });
}

function toPoint(key: string, label: string, shifts: readonly Shift[]): EarningsPoint {
  const summary = summarize(shifts);
  return {
    key,
    label,
    tips: summary.tips,
    basePay: summary.basePay,
    totalEarnings: summary.totalEarnings,
    hoursWorked: summary.hoursWorked,
    shiftCount: summary.shiftCount,
  };
}

/** One point per month, oldest first, including months without shifts. */
export function monthlySeries(
  shifts: readonly Shift[],
  months: number,
  reference: string,
): EarningsPoint[] {
  const buckets = new Map<string, Shift[]>();
  const [year, month] = reference.split("-").map(Number);

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(year, month - 1 - offset, 1);
    const key = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;
    buckets.set(key, []);
  }

  for (const shift of shifts) {
    const bucket = buckets.get(monthKey(shift.date));
    if (bucket) bucket.push(shift);
  }

  return [...buckets.entries()].map(([key, bucket]) =>
    toPoint(key, formatMonthKey(key).split(" ")[0], bucket),
  );
}

/** One point per Monday-based week, oldest first, including empty weeks. */
export function weeklySeries(
  shifts: readonly Shift[],
  weeks: number,
  reference: string,
): EarningsPoint[] {
  const buckets = new Map<string, Shift[]>();
  const currentWeekStart = startOfWeek(reference);

  for (let offset = weeks - 1; offset >= 0; offset -= 1) {
    buckets.set(addDays(currentWeekStart, -7 * offset), []);
  }

  for (const shift of shifts) {
    const bucket = buckets.get(startOfWeek(shift.date));
    if (bucket) bucket.push(shift);
  }

  return [...buckets.entries()].map(([key, bucket]) =>
    toPoint(key, formatRangeLabel({ start: key, end: addDays(key, 6) }), bucket),
  );
}

/** Average earnings per shift grouped by day of week, Monday first. */
export function weekdaySeries(shifts: readonly Shift[]): EarningsPoint[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const buckets = new Map<number, Shift[]>(order.map((day) => [day, []]));

  for (const shift of shifts) {
    buckets.get(weekdayIndex(shift.date))?.push(shift);
  }

  return order.map((day) => {
    const bucket = buckets.get(day) ?? [];
    const summary = summarize(bucket);
    const divisor = Math.max(bucket.length, 1);
    return {
      key: String(day),
      label: weekdayName(day).slice(0, 3),
      tips: roundTo(summary.tips / divisor),
      basePay: roundTo(summary.basePay / divisor),
      totalEarnings: summary.averagePerShift,
      hoursWorked: roundTo(summary.hoursWorked / divisor),
      shiftCount: bucket.length,
    };
  });
}

export interface TipMix {
  cash: number;
  card: number;
  cashShare: number;
  cardShare: number;
}

export function tipMix(shifts: readonly Shift[]): TipMix {
  const { cashTips, cardTips } = summarize(shifts);
  const total = cashTips + cardTips;
  return {
    cash: cashTips,
    card: cardTips,
    cashShare: total > 0 ? roundTo((cashTips / total) * 100, 1) : 0,
    cardShare: total > 0 ? roundTo((cardTips / total) * 100, 1) : 0,
  };
}

export function bestShift(shifts: readonly Shift[]): Shift | null {
  if (shifts.length === 0) return null;
  return shifts.reduce((best, shift) =>
    shiftTotals(shift).totalEarnings > shiftTotals(best).totalEarnings ? shift : best,
  );
}

/**
 * Placeholder tax math for the summary page. Deliberately simple: a flat
 * set-aside percentage of reported income, never presented as tax advice.
 */
export function estimatedSetAside(
  reportedIncome: number,
  percent: number,
): number {
  return roundTo((reportedIncome * percent) / 100);
}
