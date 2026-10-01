import { describe, expect, it } from "vitest";

import {
  addDays,
  endOfMonth,
  formatRangeLabel,
  formatShiftDate,
  isWithinRange,
  lastNDaysRange,
  parseISODate,
  startOfWeek,
  thisMonthRange,
  thisWeekRange,
  toISODate,
} from "@/lib/date";

describe("ISO date handling", () => {
  it("parses dates in local time rather than UTC", () => {
    const date = parseISODate("2026-03-10");

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(10);
  });

  it("round-trips through formatting", () => {
    expect(toISODate(parseISODate("2026-12-31"))).toBe("2026-12-31");
  });

  it("crosses month and year boundaries when adding days", () => {
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });
});

describe("range helpers", () => {
  it("starts weeks on Monday", () => {
    expect(startOfWeek("2026-03-08")).toBe("2026-03-02");
    expect(startOfWeek("2026-03-09")).toBe("2026-03-09");
  });

  it("builds an inclusive seven-day week", () => {
    expect(thisWeekRange("2026-03-11")).toEqual({
      start: "2026-03-09",
      end: "2026-03-15",
    });
  });

  it("handles leap-year month ends", () => {
    expect(endOfMonth("2024-02-05")).toBe("2024-02-29");
    expect(thisMonthRange("2026-03-11")).toEqual({
      start: "2026-03-01",
      end: "2026-03-31",
    });
  });

  it("counts the reference day inside the last N days", () => {
    expect(lastNDaysRange(7, "2026-03-11")).toEqual({
      start: "2026-03-05",
      end: "2026-03-11",
    });
  });

  it("treats range bounds as inclusive", () => {
    const range = { start: "2026-03-01", end: "2026-03-31" };

    expect(isWithinRange("2026-03-01", range)).toBe(true);
    expect(isWithinRange("2026-03-31", range)).toBe(true);
    expect(isWithinRange("2026-04-01", range)).toBe(false);
  });
});

describe("labels", () => {
  it("formats a shift date with its weekday", () => {
    expect(formatShiftDate("2026-03-14")).toBe("Sat, Mar 14");
  });

  it("includes both years when a range spans a new year", () => {
    expect(formatRangeLabel({ start: "2025-12-29", end: "2026-01-04" })).toBe(
      "Dec 29, 2025 – Jan 4, 2026",
    );
  });
});
