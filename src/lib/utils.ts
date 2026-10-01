type ClassValue = string | number | false | null | undefined;

/** Minimal class-name joiner; keeps components readable without a dependency. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
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
