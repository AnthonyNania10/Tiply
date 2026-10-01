import { twMerge } from "tailwind-merge";

type ClassValue = string | number | false | null | undefined;

/**
 * Joins class names and resolves Tailwind conflicts, so a caller passing
 * `hidden` can override a component's built-in `inline-flex`.
 */
export function cn(...values: ClassValue[]): string {
  return twMerge(values.filter(Boolean).join(" "));
}

/** Parses user-entered money/number input, tolerating blanks and `$`. */
export function parseNumericInput(value: string): number {
  const cleaned = value.replace(/[^0-9.\-]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
