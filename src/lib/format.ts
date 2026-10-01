import type { CurrencyCode } from "@/types";

/**
 * Locale is pinned so server-rendered and client-rendered money strings match.
 */
const LOCALE = "en-US";

export function formatCurrency(
  value: number,
  currency: CurrencyCode = "USD",
  options: { maximumFractionDigits?: number } = {},
): string {
  const maximumFractionDigits = options.maximumFractionDigits ?? 2;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    minimumFractionDigits: maximumFractionDigits === 0 ? 0 : 2,
    maximumFractionDigits,
  }).format(value);
}

/** Compact form used in dense spots such as chart axes. */
export function formatCurrencyCompact(
  value: number,
  currency: CurrencyCode = "USD",
): string {
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return formatCurrency(value, currency, { maximumFractionDigits: 0 });
}

export function formatHours(hours: number): string {
  const rounded = Math.round(hours * 100) / 100;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2)}h`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
