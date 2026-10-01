import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-2xl border border-line bg-surface px-4 text-ink placeholder:text-subtle " +
  "transition focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand/30 " +
  "aria-[invalid=true]:border-red-400";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-muted"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(CONTROL, "h-12", className)} {...props} />;
}

/** Numeric input tuned for one-handed entry: decimal keypad, no spinners. */
export function AmountInput({
  prefix,
  suffix,
  className,
  ...props
}: ComponentProps<"input"> & { prefix?: string; suffix?: string }) {
  return (
    <div className="relative">
      {prefix ? (
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg text-subtle">
          {prefix}
        </span>
      ) : null}
      <input
        inputMode="decimal"
        autoComplete="off"
        className={cn(
          CONTROL,
          "tabular h-14 text-lg font-semibold",
          prefix && "pl-9",
          suffix && "pr-12",
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-subtle">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(CONTROL, "h-12 appearance-none bg-no-repeat pr-10", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236f6a64' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 1rem center",
      }}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(CONTROL, "py-3", className)} {...props} />;
}
