import { describe, expect, it } from "vitest";

import {
  REFERENCE_DATE,
  SAMPLE_BEST_SHIFT_TOTALS,
  SAMPLE_BEST_WEEKDAY,
  SAMPLE_BEST_WEEKDAY_NAME,
  SAMPLE_METRICS,
  SAMPLE_SHIFTS,
  SAMPLE_SWING,
  sampleWorkplaceName,
} from "@/data/landing-sample";
import { shiftTotals } from "@/lib/earnings";

/**
 * The landing page presents these numbers as a product demo, so the risk worth
 * testing is incoherence: a headline figure that contradicts the chart beside
 * it, or a narrative claim the underlying shifts do not support.
 */
describe("landing sample data", () => {
  it("keeps every sample shift on or before the pinned reference date", () => {
    for (const shift of SAMPLE_SHIFTS) {
      expect(shift.date <= REFERENCE_DATE).toBe(true);
    }
  });

  it("references only workplaces that exist", () => {
    for (const shift of SAMPLE_SHIFTS) {
      expect(sampleWorkplaceName(shift.workplaceId)).not.toBe("Workplace");
    }
  });

  it("derives the monthly headline from the monthly shifts", () => {
    const { month } = SAMPLE_METRICS;
    expect(month.shiftCount).toBeGreaterThan(0);
    expect(month.totalEarnings).toBeCloseTo(month.tips + month.basePay, 2);
    expect(month.tips).toBeCloseTo(month.cashTips + month.cardTips, 2);
    expect(month.averagePerHour).toBeCloseTo(
      month.totalEarnings / month.hoursWorked,
      1,
    );
    expect(month.averagePerShift).toBeCloseTo(
      month.totalEarnings / month.shiftCount,
      1,
    );
  });

  it("splits the tip mix into shares that add up", () => {
    const { tipMix, month } = SAMPLE_METRICS;
    expect(tipMix.cash).toBe(month.cashTips);
    expect(tipMix.card).toBe(month.cardTips);
    expect(tipMix.cashShare + tipMix.cardShare).toBeCloseTo(100, 1);
  });

  it("builds a six-week series that is never entirely empty", () => {
    expect(SAMPLE_METRICS.weeklySeries).toHaveLength(6);
    for (const point of SAMPLE_METRICS.weeklySeries) {
      expect(point.totalEarnings).toBeGreaterThan(0);
    }
  });

  it("covers all seven weekdays so the best-day claim is meaningful", () => {
    expect(SAMPLE_METRICS.weekdaySeries).toHaveLength(7);
    for (const point of SAMPLE_METRICS.weekdaySeries) {
      expect(point.shiftCount).toBeGreaterThan(0);
    }
    for (const point of SAMPLE_METRICS.weekdaySeries) {
      expect(SAMPLE_BEST_WEEKDAY.totalEarnings).toBeGreaterThanOrEqual(
        point.totalEarnings,
      );
    }
    expect(SAMPLE_BEST_WEEKDAY_NAME).toBe("Saturday");
    expect(SAMPLE_BEST_WEEKDAY_NAME.startsWith(SAMPLE_BEST_WEEKDAY.label)).toBe(
      true,
    );
  });

  it("makes the best shift the highest-earning one in the history", () => {
    expect(SAMPLE_BEST_SHIFT_TOTALS).not.toBeNull();
    for (const shift of SAMPLE_SHIFTS) {
      expect(SAMPLE_BEST_SHIFT_TOTALS!.totalEarnings).toBeGreaterThanOrEqual(
        shiftTotals(shift).totalEarnings,
      );
    }
  });

  it("supports the problem section's good-night-versus-bad-night contrast", () => {
    const high = shiftTotals(SAMPLE_SWING.high).tips;
    const low = shiftTotals(SAMPLE_SWING.low).tips;
    expect(high).toBeGreaterThan(low * 2);
  });

  it("lists recent shifts newest first", () => {
    const dates = SAMPLE_METRICS.recentShifts.map((shift) => shift.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
});
