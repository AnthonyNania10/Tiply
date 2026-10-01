"use client";

import { Check, ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { AmountInput, Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { addDays, formatShiftDate, todayISO } from "@/lib/date";
import { shiftTotals } from "@/lib/earnings";
import { formatCurrency, formatHours } from "@/lib/format";
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
      await addShift({
        ...draft,
        hoursWorked: roundTo(draft.hoursWorked, 2),
      });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {savedTotal !== null ? (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-brand/20 bg-brand-soft px-4 py-3"
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

      <div className="space-y-4 rounded-3xl border border-line bg-surface p-5 shadow-card">
        <Field label="Date" htmlFor="shift-date">
          <div className="space-y-2">
            <div className="flex gap-2">
              {[
                { value: todayISO(), label: "Today" },
                { value: addDays(todayISO(), -1), label: "Yesterday" },
              ].map((option) => (
                <Chip
                  key={option.value}
                  isActive={form.date === option.value}
                  onClick={() => update({ date: option.value })}
                >
                  {option.label}
                </Chip>
              ))}
              <span className="self-center text-xs text-subtle">
                {formatShiftDate(form.date)}
              </span>
            </div>
            <TextInput
              id="shift-date"
              type="date"
              value={form.date}
              max={todayISO()}
              onChange={(event) => update({ date: event.target.value })}
            />
          </div>
        </Field>

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

        <button
          type="button"
          onClick={() => setShowDetails((open) => !open)}
          aria-expanded={showDetails}
          className="text-sm font-medium text-brand-dark underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {showDetails ? "Hide" : "Edit"} base wage &amp; notes
        </button>

        {showDetails ? (
          <div className="space-y-4 border-t border-line pt-4">
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

      <div className="rounded-3xl border border-line bg-surface p-5 shadow-card">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-muted">Total shift earnings</p>
          <p className="tabular text-2xl font-semibold text-ink">
            {formatCurrency(totals.totalEarnings, profile.currency)}
          </p>
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
          <div>
            <dt>Tips</dt>
            <dd className="tabular font-medium text-ink">
              {formatCurrency(totals.tips, profile.currency)}
            </dd>
          </div>
          <div>
            <dt>Base pay</dt>
            <dd className="tabular font-medium text-ink">
              {formatCurrency(totals.basePay, profile.currency)}
            </dd>
          </div>
          <div>
            <dt>Effective rate</dt>
            <dd className="tabular font-medium text-ink">
              {formatCurrency(totals.effectiveHourlyRate, profile.currency)}/hr
            </dd>
          </div>
        </dl>
        {draft.hoursWorked > 0 ? (
          <p className="mt-3 text-xs text-subtle">
            {formatHours(draft.hoursWorked)} at{" "}
            {formatCurrency(draft.hourlyWage, profile.currency)}/hr base
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="pb-safe sticky bottom-16 z-20 lg:static lg:pb-0">
        <Button
          type="submit"
          size="lg"
          disabled={isSaving}
          className="w-full shadow-raised"
        >
          <Plus aria-hidden className="h-5 w-5" />
          {isSaving ? "Saving…" : "Save shift"}
        </Button>
      </div>
    </form>
  );
}

function Chip({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
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
