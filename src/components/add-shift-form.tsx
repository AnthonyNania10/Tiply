"use client";

import { Check, ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { AmountInput, Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { addDays, formatShiftDate, todayISO } from "@/lib/date";
import { shiftTotals } from "@/lib/earnings";
import { formatCurrency } from "@/lib/format";
import { cn, parseNumericInput, roundTo } from "@/lib/utils";
import { useTiply } from "@/hooks/use-tiply";
import type { ShiftDraft } from "@/types";

const QUICK_HOURS = [4, 5, 6, 7, 8];

interface FormState {
  date: string;
  workplaceId: string;
  hours: string;
  cashTips: string;
  cardTips: string;
  hourlyWage: string;
  notes: string;
}

function initialState(workplaceId: string, hourlyWage: number): FormState {
  return {
    date: todayISO(),
    workplaceId,
    hours: "",
    cashTips: "",
    cardTips: "",
    hourlyWage: String(hourlyWage),
    notes: "",
  };
}

export function AddShiftForm() {
  const router = useRouter();
  const { workplaces, profile, addShift } = useTiply();

  const defaultWorkplace =
    workplaces.find((wp) => wp.id === profile.primaryWorkplaceId) ?? workplaces[0];

  const [form, setForm] = useState<FormState>(() =>
    initialState(
      defaultWorkplace?.id ?? "",
      defaultWorkplace?.defaultHourlyWage ?? profile.defaultHourlyWage,
    ),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedTotal, setSavedTotal] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const draft = useMemo<ShiftDraft>(
    () => ({
      date: form.date,
      workplaceId: form.workplaceId,
      hoursWorked: parseNumericInput(form.hours),
      cashTips: parseNumericInput(form.cashTips),
      cardTips: parseNumericInput(form.cardTips),
      hourlyWage: parseNumericInput(form.hourlyWage),
      notes: form.notes.trim() || undefined,
    }),
    [form],
  );

  const totals = shiftTotals(draft);
  const today = todayISO();
  const yesterday = addDays(today, -1);

  function update(patch: Partial<FormState>) {
    setForm((current) => ({ ...current, ...patch }));
    setSavedTotal(null);
  }

  function selectWorkplace(id: string) {
    const workplace = workplaces.find((wp) => wp.id === id);
    update({
      workplaceId: id,
      // Keep the wage in sync with the venue unless the worker overrode it.
      hourlyWage: workplace ? String(workplace.defaultHourlyWage) : form.hourlyWage,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.hoursWorked <= 0 || draft.hoursWorked > 24) {
      setError("Enter the hours you worked (between 0 and 24).");
      return;
    }
    if (draft.cashTips < 0 || draft.cardTips < 0 || draft.hourlyWage < 0) {
      setError("Amounts can't be negative.");
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      await addShift({ ...draft, hoursWorked: roundTo(draft.hoursWorked, 2) });
      setSavedTotal(totals.totalEarnings);
      setForm((current) => ({
        ...initialState(current.workplaceId, parseNumericInput(current.hourlyWage)),
        date: current.date,
      }));
      setShowDetails(false);
    } finally {
      setIsSaving(false);
    }
  }

  if (workplaces.length === 0) return null;

  const isCustomDate = form.date !== today && form.date !== yesterday;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Fixed so confirming a save never reflows the form underneath it. */}
      {savedTotal !== null ? (
        <div
          role="status"
          className="fixed top-18 left-1/2 z-50 flex w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 flex-wrap items-center justify-between gap-3 rounded-3xl border border-brand/20 bg-brand-soft px-4 py-3 shadow-card lg:top-6"
        >
          <p className="flex items-center gap-2 text-sm font-medium text-brand-dark">
            <Check aria-hidden className="h-4 w-4" />
            Shift saved · {formatCurrency(savedTotal, profile.currency)}
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push("/dashboard")}
          >
            Go to dashboard
            <ChevronRight aria-hidden className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className="space-y-3.5 rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-5">
        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-muted">
            Date
          </legend>
          <div className="flex flex-wrap gap-2">
            <Chip
              isActive={form.date === today}
              onClick={() => {
                setShowDatePicker(false);
                update({ date: today });
              }}
            >
              Today
            </Chip>
            <Chip
              isActive={form.date === yesterday}
              onClick={() => {
                setShowDatePicker(false);
                update({ date: yesterday });
              }}
            >
              Yesterday
            </Chip>
            <Chip
              isActive={isCustomDate || showDatePicker}
              onClick={() => setShowDatePicker((open) => !open)}
            >
              {isCustomDate ? formatShiftDate(form.date) : "Another day"}
            </Chip>
          </div>
          {showDatePicker || isCustomDate ? (
            <div className="mt-2">
              <label htmlFor="shift-date" className="sr-only">
                Shift date
              </label>
              <TextInput
                id="shift-date"
                type="date"
                value={form.date}
                max={today}
                onChange={(event) => update({ date: event.target.value })}
              />
            </div>
          ) : null}
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-muted">
            Workplace
          </legend>
          <div className="flex flex-wrap gap-2">
            {workplaces.map((workplace) => (
              <Chip
                key={workplace.id}
                isActive={form.workplaceId === workplace.id}
                onClick={() => selectWorkplace(workplace.id)}
              >
                {workplace.name}
              </Chip>
            ))}
          </div>
        </fieldset>

        <Field label="Hours worked" htmlFor="shift-hours">
          <div className="space-y-2">
            <AmountInput
              id="shift-hours"
              value={form.hours}
              placeholder="0"
              suffix="hours"
              aria-invalid={Boolean(error) && draft.hoursWorked <= 0}
              onChange={(event) => update({ hours: event.target.value })}
            />
            <div className="flex flex-wrap gap-2">
              {QUICK_HOURS.map((hours) => (
                <Chip
                  key={hours}
                  isActive={form.hours === String(hours)}
                  onClick={() => update({ hours: String(hours) })}
                >
                  {hours}h
                </Chip>
              ))}
            </div>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cash tips" htmlFor="shift-cash">
            <AmountInput
              id="shift-cash"
              value={form.cashTips}
              placeholder="0"
              prefix="$"
              onChange={(event) => update({ cashTips: event.target.value })}
            />
          </Field>
          <Field label="Card tips" htmlFor="shift-card">
            <AmountInput
              id="shift-card"
              value={form.cardTips}
              placeholder="0"
              prefix="$"
              onChange={(event) => update({ cardTips: event.target.value })}
            />
          </Field>
        </div>
      </div>

      {/* Live totals sit with the Save button so they stay on screen while typing. */}
      <div className="rounded-3xl border border-brand/20 bg-brand-soft p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-brand-dark">
            Total shift earnings
          </p>
          <p className="tabular text-2xl font-semibold text-brand-dark">
            {formatCurrency(totals.totalEarnings, profile.currency)}
          </p>
        </div>
        <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-dark/75">
          <Figure label="Tips" value={formatCurrency(totals.tips, profile.currency)} />
          <Figure
            label="Base pay"
            value={formatCurrency(totals.basePay, profile.currency)}
          />
          <Figure
            label="Effective"
            value={`${formatCurrency(totals.effectiveHourlyRate, profile.currency)}/hr`}
          />
        </dl>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={isSaving}
          className="mt-3 w-full"
        >
          <Plus aria-hidden className="h-5 w-5" />
          {isSaving ? "Saving…" : "Save shift"}
        </Button>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-4 shadow-card sm:p-5">
        <button
          type="button"
          onClick={() => setShowDetails((open) => !open)}
          aria-expanded={showDetails}
          className="text-sm font-medium text-brand-dark underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {showDetails ? "Hide" : "Edit"} base wage &amp; notes
        </button>

        {showDetails ? (
          <div className="mt-4 space-y-4 border-t border-line pt-4">
            <Field
              label="Base hourly wage"
              htmlFor="shift-wage"
              hint="Prefilled from this workplace. Change it for one-off rates."
            >
              <AmountInput
                id="shift-wage"
                value={form.hourlyWage}
                prefix="$"
                suffix="/hr"
                onChange={(event) => update({ hourlyWage: event.target.value })}
              />
            </Field>
            <Field label="Notes (optional)" htmlFor="shift-notes">
              <TextArea
                id="shift-notes"
                rows={3}
                value={form.notes}
                placeholder="Slow patio night, tipped out the bar…"
                onChange={(event) => update({ notes: event.target.value })}
              />
            </Field>
            <Field label="Workplace (full list)" htmlFor="shift-workplace-select">
              <Select
                id="shift-workplace-select"
                value={form.workplaceId}
                onChange={(event) => selectWorkplace(event.target.value)}
              >
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.name} — {workplace.role}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        ) : null}
      </div>
    </form>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <dt>{label}</dt>
      <dd className="tabular font-semibold">{value}</dd>
    </div>
  );
}

function Chip({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "min-h-10 rounded-full border px-4 text-sm font-medium transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        isActive
          ? "border-brand bg-brand-soft text-brand-dark"
          : "border-line bg-surface text-muted hover:border-ink/20 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
