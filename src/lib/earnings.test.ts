import { describe, expect, it } from "vitest";

import {
  bestShift,
  estimatedSetAside,
  filterByRange,
  monthlySeries,
  shiftTotals,
  sortByDateDesc,
  summarize,
  tipMix,
  weekdaySeries,
  weeklySeries,
} from "@/lib/earnings";
import type { Shift } from "@/types";

function makeShift(overrides: Partial<Shift> & Pick<Shift, "id" | "date">): Shift {
  return {
    workplaceId: "wp-1",
    hoursWorked: 5,
    cashTips: 40,
    cardTips: 60,
    hourlyWage: 10,
    createdAt: `${overrides.date}T23:00:00.000Z`,
    ...overrides,
  };
}

describe("shiftTotals", () => {
  it("adds tips to base pay and derives the effective hourly rate", () => {
    const totals = shiftTotals(
      makeShift({ id: "a", date: "2026-03-10", hoursWorked: 5, hourlyWage: 10 }),
    );

    expect(totals.tips).toBe(100);
    expect(totals.basePay).toBe(50);
    expect(totals.totalEarnings).toBe(150);
    expect(totals.effectiveHourlyRate).toBe(30);
  });

  it("returns a zero hourly rate when no hours are recorded", () => {
    const totals = shiftTotals(makeShift({ id: "a", date: "2026-03-10", hoursWorked: 0 }));

    expect(totals.basePay).toBe(0);
    expect(totals.effectiveHourlyRate).toBe(0);
  });
});

describe("summarize", () => {
  it("aggregates totals and averages across shifts", () => {
    const summary = summarize([
      makeShift({ id: "a", date: "2026-03-10", hoursWorked: 5 }),
      makeShift({
        id: "b",
        date: "2026-03-11",
        hoursWorked: 5,
        cashTips: 20,
        cardTips: 30,
      }),
    ]);

    expect(summary.shiftCount).toBe(2);
    expect(summary.hoursWorked).toBe(10);
    expect(summary.tips).toBe(150);
    expect(summary.basePay).toBe(100);
    expect(summary.totalEarnings).toBe(250);
    expect(summary.averagePerHour).toBe(25);
    expect(summary.averagePerShift).toBe(125);
  });

  it("returns zeroed values for an empty list", () => {
    expect(summarize([]).averagePerShift).toBe(0);
  });
});

describe("filterByRange", () => {
  const shifts = [
    makeShift({ id: "a", date: "2026-03-01" }),
    makeShift({ id: "b", date: "2026-03-15" }),
    makeShift({ id: "c", date: "2026-04-02" }),
  ];

  it("includes both boundary dates", () => {
    const result = filterByRange(shifts, { start: "2026-03-01", end: "2026-03-15" });
    expect(result.map((shift) => shift.id)).toEqual(["a", "b"]);
  });

  it("returns nothing for a range with no shifts", () => {
    expect(filterByRange(shifts, { start: "2026-05-01", end: "2026-05-31" })).toEqual([]);
  });
});

describe("sortByDateDesc", () => {
  it("orders newest first and breaks ties on creation time", () => {
    const sorted = sortByDateDesc([
      makeShift({ id: "older", date: "2026-03-01" }),
      makeShift({
        id: "same-day-late",
        date: "2026-03-10",
        createdAt: "2026-03-10T23:00:00.000Z",
      }),
      makeShift({
        id: "same-day-early",
        date: "2026-03-10",
        createdAt: "2026-03-10T08:00:00.000Z",
      }),
    ]);

    expect(sorted.map((shift) => shift.id)).toEqual([
      "same-day-late",
      "same-day-early",
      "older",
    ]);
  });
});

describe("series builders", () => {
  const shifts = [
    makeShift({ id: "a", date: "2026-03-02" }),
    makeShift({ id: "b", date: "2026-03-03" }),
    makeShift({ id: "c", date: "2026-02-10" }),
  ];

  it("keeps empty months in the monthly series", () => {
    const series = monthlySeries(shifts, 3, "2026-03-20");

    expect(series.map((point) => point.key)).toEqual(["2026-01", "2026-02", "2026-03"]);
    expect(series[0].totalEarnings).toBe(0);
    expect(series[2].shiftCount).toBe(2);
  });

  it("buckets weeks starting on Monday", () => {
    const series = weeklySeries(shifts, 2, "2026-03-08");

    expect(series[1].key).toBe("2026-03-02");
    expect(series[1].shiftCount).toBe(2);
  });

  it("averages weekday earnings per shift", () => {
    const series = weekdaySeries(shifts);
    const monday = series.find((point) => point.label === "Mon");

    expect(monday?.shiftCount).toBe(1);
    expect(monday?.totalEarnings).toBe(150);
  });
});

describe("tipMix", () => {
  it("splits cash and card tips into shares", () => {
    const mix = tipMix([makeShift({ id: "a", date: "2026-03-10" })]);

    expect(mix.cash).toBe(40);
    expect(mix.card).toBe(60);
    expect(mix.cashShare).toBe(40);
    expect(mix.cardShare).toBe(60);
  });

  it("avoids dividing by zero when there are no tips", () => {
    const mix = tipMix([
      makeShift({ id: "a", date: "2026-03-10", cashTips: 0, cardTips: 0 }),
    ]);

    expect(mix.cashShare).toBe(0);
  });
});

describe("bestShift", () => {
  it("picks the highest-earning shift", () => {
    const best = bestShift([
      makeShift({ id: "a", date: "2026-03-10" }),
      makeShift({ id: "b", date: "2026-03-11", cardTips: 400 }),
    ]);

    expect(best?.id).toBe("b");
  });

  it("returns null without shifts", () => {
    expect(bestShift([])).toBeNull();
  });
});

describe("estimatedSetAside", () => {
  it("applies a flat percentage to reported income", () => {
    expect(estimatedSetAside(12000, 22)).toBe(2640);
  });
});
