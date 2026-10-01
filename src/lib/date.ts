import type { DateRange } from "@/types";

const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats a `Date` as a local `YYYY-MM-DD` string. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parses `YYYY-MM-DD` into a local-midnight `Date`. The native parser would
 * treat the same string as UTC, which shifts shifts into the wrong day.
 */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function addMonths(iso: string, months: number): string {
  const date = parseISODate(iso);
  date.setMonth(date.getMonth() + months);
  return toISODate(date);
}

/** Start of the week, Monday-based. */
export function startOfWeek(iso: string): string {
  const date = parseISODate(iso);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return toISODate(date);
}

export function startOfMonth(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

export function endOfMonth(iso: string): string {
  const date = parseISODate(iso);
  return toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function startOfYear(iso: string): string {
  return `${iso.slice(0, 4)}-01-01`;
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function weekdayIndex(iso: string): number {
  return parseISODate(iso).getDay();
}

export function weekdayName(index: number): string {
  return WEEKDAY_LABELS[index];
}

export function formatMonthKey(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return `${MONTH_LABELS[month - 1]} ${year}`;
}

export function formatMonthShort(key: string): string {
  const month = Number(key.slice(5, 7));
  return MONTH_LABELS[month - 1];
}

/** e.g. `Sat, Sep 14`. */
export function formatShiftDate(iso: string): string {
  const date = parseISODate(iso);
  return `${WEEKDAY_LABELS[date.getDay()].slice(0, 3)}, ${
    MONTH_LABELS[date.getMonth()]
  } ${date.getDate()}`;
}

/** e.g. `September 14, 2026`. */
export function formatLongDate(iso: string): string {
  const date = parseISODate(iso);
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** e.g. `Sep 8 – Sep 14`. */
export function formatRangeLabel(range: DateRange): string {
  const start = parseISODate(range.start);
  const end = parseISODate(range.end);
  const startLabel = `${MONTH_LABELS[start.getMonth()]} ${start.getDate()}`;
  const endLabel = `${MONTH_LABELS[end.getMonth()]} ${end.getDate()}`;
  return start.getFullYear() === end.getFullYear()
    ? `${startLabel} – ${endLabel}`
    : `${startLabel}, ${start.getFullYear()} – ${endLabel}, ${end.getFullYear()}`;
}

export function relativeDayLabel(iso: string, reference = todayISO()): string {
  if (iso === reference) return "Today";
  if (iso === addDays(reference, -1)) return "Yesterday";
  return formatShiftDate(iso);
}

export function isWithinRange(iso: string, range: DateRange): boolean {
  return iso >= range.start && iso <= range.end;
}

export function thisMonthRange(reference = todayISO()): DateRange {
  return { start: startOfMonth(reference), end: endOfMonth(reference) };
}

export function thisWeekRange(reference = todayISO()): DateRange {
  const start = startOfWeek(reference);
  return { start, end: addDays(start, 6) };
}

export function lastNDaysRange(days: number, reference = todayISO()): DateRange {
  return { start: addDays(reference, -(days - 1)), end: reference };
}

export function thisYearRange(reference = todayISO()): DateRange {
  return { start: startOfYear(reference), end: `${reference.slice(0, 4)}-12-31` };
}
