"use client";

import { Check, LogOut, Plus, Receipt, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { AmountInput, Field, Select, TextInput } from "@/components/ui/field";
import { LoadingScreen } from "@/components/ui/skeleton";
import { useTiply } from "@/hooks/use-tiply";
import { formatCurrency } from "@/lib/format";
import { parseNumericInput } from "@/lib/utils";
import type {
  CurrencyCode,
  UserProfile,
  Workplace,
  WorkplaceDraft,
} from "@/types";

const CURRENCIES: { value: CurrencyCode; label: string }[] = [
  { value: "USD", label: "USD — US dollar" },
  { value: "CAD", label: "CAD — Canadian dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British pound" },
  { value: "AUD", label: "AUD — Australian dollar" },
];

export function ProfileView() {
  const router = useRouter();
  const {
    isLoading,
    profile,
    workplaces,
    addWorkplace,
    updateProfile,
    signOut,
  } = useTiply();

  if (isLoading) return <LoadingScreen label="Loading your profile" />;

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Settings"
        description="Account details, workplaces, and the defaults used when logging a shift."
      />

      <SettingsForm
        key={profile.id}
        profile={profile}
        workplaces={workplaces}
        onSave={updateProfile}
      />

      <WorkplacesCard
        workplaces={workplaces}
        currency={profile.currency}
        onAdd={addWorkplace}
      />

      <Link
        href="/tax-summary"
        className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-5 shadow-card transition hover:border-brand/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Receipt aria-hidden className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-ink">
          Tax &amp; income summary
        </span>
      </Link>

      <Button variant="danger" className="w-full" onClick={handleSignOut}>
        <LogOut aria-hidden className="h-4 w-4" />
        Log out
      </Button>

      <p className="text-center text-xs text-subtle">
        Logging out clears the demo data stored in this browser.
      </p>
    </div>
  );
}

function WorkplacesCard({
  workplaces,
  currency,
  onAdd,
}: {
  workplaces: Workplace[];
  currency: CurrencyCode;
  onAdd: (draft: WorkplaceDraft) => Promise<Workplace>;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    defaultHourlyWage: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    const role = form.role.trim();
    const defaultHourlyWage = parseNumericInput(form.defaultHourlyWage);

    if (!name || !role) {
      setError("Enter both a workplace name and your role.");
      return;
    }
    if (defaultHourlyWage < 0) {
      setError("Hourly wage can't be negative.");
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      const created = await onAdd({ name, role, defaultHourlyWage });
      setSavedName(created.name);
      setForm({ name: "", role: "", defaultHourlyWage: "" });
      setIsAdding(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Workplaces"
        description="Jobs you can pick from when logging a shift."
        action={
          <Button
            size="sm"
            variant={isAdding ? "ghost" : "secondary"}
            onClick={() => {
              setIsAdding((current) => !current);
              setError(null);
              setSavedName(null);
            }}
          >
            {isAdding ? (
              <X aria-hidden className="h-4 w-4" />
            ) : (
              <Plus aria-hidden className="h-4 w-4" />
            )}
            {isAdding ? "Cancel" : "Add workplace"}
          </Button>
        }
      />

      {isAdding ? (
        <form
          onSubmit={handleSubmit}
          className="mb-5 space-y-4 rounded-2xl border border-line bg-canvas p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Workplace name" htmlFor="new-workplace-name">
              <TextInput
                id="new-workplace-name"
                value={form.name}
                autoFocus
                placeholder="e.g. The Blue Room"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Your role" htmlFor="new-workplace-role">
              <TextInput
                id="new-workplace-role"
                value={form.role}
                placeholder="e.g. Bartender"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
              />
            </Field>
          </div>
          <Field
            label="Default hourly wage"
            htmlFor="new-workplace-wage"
            hint="Tiply will prefill this wage when you log a shift here."
          >
            <AmountInput
              id="new-workplace-wage"
              value={form.defaultHourlyWage}
              prefix="$"
              suffix="/hr"
              placeholder="0"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  defaultHourlyWage: event.target.value,
                }))
              }
            />
          </Field>
          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={isSaving}>
            <Plus aria-hidden className="h-4 w-4" />
            {isSaving ? "Adding…" : "Add workplace"}
          </Button>
        </form>
      ) : null}

      {savedName ? (
        <p
          role="status"
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-brand-dark"
        >
          <Check aria-hidden className="h-4 w-4" />
          {savedName} was added.
        </p>
      ) : null}

      <ul className="divide-y divide-line">
        {workplaces.map((workplace) => (
          <li
            key={workplace.id}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-ink">{workplace.name}</p>
              <p className="text-xs text-muted">{workplace.role}</p>
            </div>
            <p className="tabular text-sm text-muted">
              {formatCurrency(workplace.defaultHourlyWage, currency)}/hr
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SettingsForm({
  profile,
  workplaces,
  onSave,
}: {
  profile: UserProfile;
  workplaces: Workplace[];
  onSave: (patch: Partial<UserProfile>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    fullName: profile.fullName,
    email: profile.email,
    primaryWorkplaceId: profile.primaryWorkplaceId,
    defaultHourlyWage: String(profile.defaultHourlyWage),
    currency: profile.currency,
    taxSetAsidePercent: String(profile.taxSetAsidePercent),
  });
  const [isSaved, setIsSaved] = useState(false);

  function update(patch: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...patch }));
    setIsSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      primaryWorkplaceId: form.primaryWorkplaceId,
      defaultHourlyWage: parseNumericInput(form.defaultHourlyWage),
      currency: form.currency,
      taxSetAsidePercent: parseNumericInput(form.taxSetAsidePercent),
    });
    setIsSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader title="Account" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="profile-name">
            <TextInput
              id="profile-name"
              value={form.fullName}
              autoComplete="name"
              onChange={(event) => update({ fullName: event.target.value })}
            />
          </Field>
          <Field label="Email" htmlFor="profile-email">
            <TextInput
              id="profile-email"
              type="email"
              value={form.email}
              autoComplete="email"
              onChange={(event) => update({ email: event.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Work defaults"
          description="Prefilled for you every time you add a shift."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary workplace" htmlFor="profile-workplace">
            <Select
              id="profile-workplace"
              value={form.primaryWorkplaceId}
              onChange={(event) =>
                update({ primaryWorkplaceId: event.target.value })
              }
            >
              {workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id}>
                  {workplace.name} — {workplace.role}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Default hourly wage" htmlFor="profile-wage">
            <AmountInput
              id="profile-wage"
              prefix="$"
              suffix="/hr"
              value={form.defaultHourlyWage}
              onChange={(event) =>
                update({ defaultHourlyWage: event.target.value })
              }
            />
          </Field>
          <Field label="Preferred currency" htmlFor="profile-currency">
            <Select
              id="profile-currency"
              value={form.currency}
              onChange={(event) =>
                update({ currency: event.target.value as CurrencyCode })
              }
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Tax set-aside rate"
            htmlFor="profile-tax"
            hint="Used for the estimate on the tax summary page."
          >
            <AmountInput
              id="profile-tax"
              suffix="%"
              value={form.taxSetAsidePercent}
              onChange={(event) =>
                update({ taxSetAsidePercent: event.target.value })
              }
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit">Save changes</Button>
        {isSaved ? (
          <p
            role="status"
            className="flex items-center gap-1.5 text-sm font-medium text-brand-dark"
          >
            <Check aria-hidden className="h-4 w-4" />
            Saved
          </p>
        ) : null}
      </div>
    </form>
  );
}
