/**
 * Domain models are intentionally independent of any storage layer so the
 * mock repository can later be swapped for Supabase/PostgreSQL without
 * touching components. Money is stored as a plain number of currency units.
 */

export interface Workplace {
  id: string;
  name: string;
  role: string;
  defaultHourlyWage: number;
}

export type WorkplaceDraft = Omit<Workplace, "id">;

export interface Shift {
  id: string;
  /** Local calendar date as `YYYY-MM-DD`. */
  date: string;
  workplaceId: string;
  hoursWorked: number;
  cashTips: number;
  cardTips: number;
  hourlyWage: number;
  notes?: string;
  /** ISO timestamp of when the shift was logged. */
  createdAt: string;
}

export type ShiftDraft = Omit<Shift, "id" | "createdAt">;

export interface ShiftTotals {
  tips: number;
  basePay: number;
  totalEarnings: number;
  effectiveHourlyRate: number;
}

export interface EarningsSummary {
  shiftCount: number;
  hoursWorked: number;
  cashTips: number;
  cardTips: number;
  tips: number;
  basePay: number;
  totalEarnings: number;
  averagePerHour: number;
  averagePerShift: number;
}

export interface EarningsPoint {
  /** Machine-sortable bucket key, e.g. `2026-09` or `2026-09-14`. */
  key: string;
  label: string;
  tips: number;
  basePay: number;
  totalEarnings: number;
  hoursWorked: number;
  shiftCount: number;
}

export interface DateRange {
  /** Inclusive `YYYY-MM-DD`. */
  start: string;
  /** Inclusive `YYYY-MM-DD`. */
  end: string;
}
