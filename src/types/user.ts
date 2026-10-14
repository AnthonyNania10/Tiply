export type CurrencyCode = "USD" | "CAD" | "EUR" | "GBP" | "AUD";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  /** Workplace used as the default selection in the Add Shift form. */
  primaryWorkplaceId: string;
  defaultHourlyWage: number;
  currency: CurrencyCode;
  /** Percentage of reported income the worker wants to set aside for taxes. */
  taxSetAsidePercent: number;
}
