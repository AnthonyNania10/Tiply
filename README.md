# Tiply

**Know what you make.** Tiply is a mobile-first income and tip tracker for
tipped workers — servers, bartenders, casino employees, valets, and anyone else
whose paycheck is only part of the story.

This repository is an **MVP skeleton**: the full frontend, navigation, and
component library use browser storage so the product can be put in front of
real tipped workers before any backend exists. New users start with no shifts
or earnings and build their own history.

---

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Development server (Turbopack) on port 3000   |
| `npm run build`     | Production build                              |
| `npm start`         | Serve the production build                    |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript) |
| `npm run typecheck` | `tsc --noEmit`                                |
| `npm test`          | Vitest unit tests for the calculation layer   |

No environment variables, database, or account are required. There is no login
step: the landing page CTAs drop you straight into the demo app.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Recharts · Lucide icons · Vitest.

---

## Routes

| Route           | Page                | Notes                                                        |
| --------------- | ------------------- | ------------------------------------------------------------ |
| `/`             | Landing             | Marketing page, no app chrome                                 |
| `/dashboard`    | Dashboard           | Monthly totals, earnings chart, recent shifts                 |
| `/shifts`       | Shift history       | Week / month / custom date-range filters                      |
| `/shifts/new`   | Add shift           | The fast logging flow                                         |
| `/analytics`    | Analytics           | Income over time, best days, cash vs. card                    |
| `/tax-summary`  | Tax & income        | Reported income plus a simple set-aside estimate              |
| `/profile`      | Profile & settings  | Account, work defaults, currency, logout                      |

Everything except `/` lives in the `(app)` route group, which wraps pages in the
app shell: a five-item bottom navigation on mobile (Home, History, a raised
center **Add Shift** button, Analytics, Profile) that becomes a left sidebar at
the `lg` breakpoint. The tax summary is reachable from the dashboard and profile
rather than taking a sixth slot in the primary navigation.

---

## Folder structure

```
src/
├── app/
│   ├── layout.tsx                  Root layout: fonts, metadata, viewport
│   ├── globals.css                 Tailwind v4 theme tokens and utilities
│   ├── page.tsx                    Landing page
│   └── (app)/
│       ├── layout.tsx              TiplyProvider + AppShell
│       ├── dashboard/              page.tsx + dashboard-view.tsx
│       ├── shifts/                 page.tsx + history-view.tsx
│       │   └── new/page.tsx        Add Shift
│       ├── analytics/              page.tsx + analytics-view.tsx
│       ├── tax-summary/            page.tsx + tax-view.tsx
│       └── profile/                page.tsx + profile-view.tsx
│
├── components/
│   ├── add-shift-form.tsx          The fast shift-entry form
│   ├── app-shell.tsx               Sidebar + top bar + bottom nav frame
│   ├── bottom-navigation.tsx       Mobile tab bar
│   ├── desktop-sidebar.tsx         Desktop navigation
│   ├── earnings-chart.tsx          Area/bar chart with a screen-reader table
│   ├── shift-card.tsx              One logged shift
│   ├── stat-card.tsx               One headline metric
│   ├── logo.tsx, page-header.tsx
│   ├── charts/tip-mix-chart.tsx    Cash vs. card donut
│   └── ui/                         Button, Card, Field inputs, Segmented
│                                   control, EmptyState, Skeleton
│
├── data/
│   ├── mock-data.ts                Starter workplaces and profile defaults
│   ├── local-store.ts              Demo persistence (localStorage)
│   ├── shift-repository.ts         ShiftRepository interface + local impl
│   └── profile-repository.ts       ProfileRepository interface + local impl
│
├── hooks/use-tiply.ts              Typed access to the app store
├── providers/tiply-provider.tsx    Loads repositories, holds client state
│
├── lib/
│   ├── earnings.ts                 All money math and aggregation (pure)
│   ├── date.ts                     Local-safe `YYYY-MM-DD` helpers
│   ├── format.ts                   Currency/hours formatting
│   ├── nav.ts                      Navigation config
│   └── utils.ts                    `cn`, numeric parsing, rounding
│
└── types/                          Shift, Workplace, UserProfile, summaries
```

Each page file is a thin Server Component that exports `metadata` and renders a
colocated `*-view.tsx` Client Component. That split keeps per-page metadata
while letting the views use client state for filters and forms.

---

## The Add Shift flow

Logging a shift is the one thing the app has to be great at, so the form is
tuned for a tired worker standing outside at 1am:

- **Date and workplace are prefilled** — today, plus the primary workplace from
  the profile. Today / Yesterday / Another day chips cover every real case, and
  the date picker only appears when it is actually needed.
- **Hours have one-tap chips** (4h–8h) alongside a free-text field.
- **Cash and card tips sit side by side**, with `inputMode="decimal"` so phones
  open the number keypad, and large touch targets.
- **Base wage and notes are collapsed** below the save button — they are
  prefilled from the workplace and rarely need changing.
- **Totals update live** in a block directly above Save, so total earnings,
  tips, base pay, and the effective hourly rate stay on screen while typing.
- **Saving keeps you in place**: a floating confirmation appears (no layout
  shift) and the form resets, so logging a second job's shift is immediate.

Everything from the date chips through the Save button fits on one phone screen.
The typical path is: open → tap an hours chip → type cash → type card → Save.

---

## Mock vs. backend-ready

### Currently mocked

| Area                   | How it behaves today                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| **Authentication**     | None. The landing page CTAs link straight to `/dashboard`; "Log out" clears the browser's demo data. |
| **Shift history**      | Starts empty. Only shifts entered by the user appear in the app.                                    |
| **Saved shifts**       | Stored in `localStorage` under `tiply.demo.v1`.                                                     |
| **Profile settings**   | Saved to the same `localStorage` record.                                                              |
| **Workplaces**         | Includes starter workplaces; users can add more from Profile and they persist in `localStorage`.    |
| **Tax estimate**       | A flat percentage of reported income. No brackets, withholding, or filing status — and labeled as an estimate, not advice. |

### Ready for a real backend

The UI never touches storage directly. It goes through two interfaces:

```ts
// src/data/shift-repository.ts
export interface ShiftRepository {
  listWorkplaces(): Promise<Workplace[]>;
  createWorkplace(draft: WorkplaceDraft): Promise<Workplace>;
  listShifts(): Promise<Shift[]>;
  createShift(draft: ShiftDraft): Promise<Shift>;
  deleteShift(id: string): Promise<void>;
}

// src/data/profile-repository.ts
export interface ProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(patch: Partial<UserProfile>): Promise<UserProfile>;
  signOut(): Promise<void>;
}
```

Both are already async. Moving to Supabase plus PostgreSQL means:

1. Write `SupabaseShiftRepository` and `SupabaseProfileRepository` implementing
   the interfaces above.
2. Change the two export lines (`export const shiftRepository = ...`) to point
   at them.
3. Wrap the `(app)` route group in an auth check and replace the demo profile
   with the authenticated user.

No component, hook, page, or calculation changes are required, because:

- **Domain types** in `src/types/` are storage-agnostic and map cleanly to
  `workplaces`, `shifts`, and `profiles` tables (a `Shift` row is literally the
  model, with `workplaceId` as a foreign key and `date` as a `date` column).
- **All money math lives in `src/lib/earnings.ts`** as pure functions, so the
  same calculations can run in a route handler, an edge function, or a SQL view
  later.
- **`src/providers/tiply-provider.tsx`** is the single place that calls the
  repositories; swapping it for React Query or server-side fetching is a local
  change.

### Deliberately out of scope

Bank integrations, payroll/POS integrations, payment processing, tip-pool
splitting, multi-user accounts, and real tax filing. This is a skeleton for
validating the idea with real tipped workers.

---

## Tests

`npm test` covers the parts where a bug would quietly produce wrong money:

- `src/data/local-store.test.ts` — empty first run, persisted shifts, and
  persisted custom workplaces.
- `src/lib/earnings.test.ts` — shift totals, effective hourly rate, period
  summaries, range filtering, sorting, and the weekly/monthly/weekday series.
- `src/lib/date.test.ts` — local-time `YYYY-MM-DD` parsing (the native parser
  treats those strings as UTC and shifts dates), Monday-based weeks, month ends
  including leap years, and inclusive range boundaries.
