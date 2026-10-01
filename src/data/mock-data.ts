import { addDays, toISODate, todayISO, weekdayIndex } from "@/lib/date";
import { roundTo } from "@/lib/utils";
import type { Shift, UserProfile, Workplace } from "@/types";

export const MOCK_WORKPLACES: Workplace[] = [
  { id: "wp-harbor", name: "Harbor & Vine", role: "Server", defaultHourlyWage: 9 },
  {
    id: "wp-lantern",
    name: "The Lantern Room",
    role: "Bartender",
    defaultHourlyWage: 11.5,
  },
  {
    id: "wp-crestline",
    name: "Crestline Events",
    role: "Banquet server",
    defaultHourlyWage: 18,
  },
];

export const MOCK_PROFILE: UserProfile = {
  id: "user-demo",
  fullName: "Jordan Ellis",
  email: "jordan.ellis@example.com",
  primaryWorkplaceId: "wp-harbor",
  defaultHourlyWage: 9,
  currency: "USD",
  taxSetAsidePercent: 22,
};

/** Deterministic PRNG so the demo data is identical on every render. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

interface DayPlan {
  workplaceId: string;
  hoursRange: [number, number];
  tipsPerHour: number;
  probability: number;
}

/** A believable weekly rotation for a full-time server who also bartends. */
const WEEKLY_PATTERN: Record<number, DayPlan | undefined> = {
  0: {
    workplaceId: "wp-crestline",
    hoursRange: [5, 8],
    tipsPerHour: 21,
    probability: 0.4,
  },
  1: undefined,
  2: { workplaceId: "wp-harbor", hoursRange: [4.5, 6.5], tipsPerHour: 18, probability: 0.9 },
  3: { workplaceId: "wp-harbor", hoursRange: [5, 7], tipsPerHour: 20, probability: 0.9 },
  4: { workplaceId: "wp-harbor", hoursRange: [5, 7.5], tipsPerHour: 25, probability: 0.85 },
  5: { workplaceId: "wp-harbor", hoursRange: [6, 8.5], tipsPerHour: 34, probability: 0.95 },
  6: { workplaceId: "wp-lantern", hoursRange: [6, 9], tipsPerHour: 38, probability: 0.95 },
};

const NOTES = [
  "Patio section, slow start then packed.",
  "Covered a double — tipped out the bar.",
  "Private party of 40, auto-grat included.",
  "Two walkouts, still a decent night.",
  "New menu launch, lots of upsells.",
  "Rainy night, light traffic.",
];

const SHIFT_HISTORY_DAYS = 118;

/**
 * Builds a realistic shift history ending today so the demo always has data
 * for the current week, month, and year.
 */
export function generateSeedShifts(reference: string = todayISO()): Shift[] {
  const workplaceById = new Map(MOCK_WORKPLACES.map((wp) => [wp.id, wp]));
  const shifts: Shift[] = [];

  for (let offset = SHIFT_HISTORY_DAYS; offset >= 0; offset -= 1) {
    const date = addDays(reference, -offset);
    const plan = WEEKLY_PATTERN[weekdayIndex(date)];
    if (!plan) continue;

    const random = mulberry32(hashString(`${date}:${plan.workplaceId}`));
    if (random() > plan.probability) continue;

    const workplace = workplaceById.get(plan.workplaceId);
    if (!workplace) continue;

    const [minHours, maxHours] = plan.hoursRange;
    const hoursWorked = roundTo(
      minHours + random() * (maxHours - minHours),
      1,
    );

    // Nightly variance: most shifts land near the average, some are outliers.
    const swing = 0.65 + random() * 0.8;
    const tips = roundTo(hoursWorked * plan.tipsPerHour * swing);
    const cashShare = 0.2 + random() * 0.25;
    const cashTips = roundTo(tips * cashShare);

    shifts.push({
      id: `seed-${date}-${plan.workplaceId}`,
      date,
      workplaceId: workplace.id,
      hoursWorked,
      cashTips,
      cardTips: roundTo(tips - cashTips),
      hourlyWage: workplace.defaultHourlyWage,
      notes: random() > 0.82 ? NOTES[Math.floor(random() * NOTES.length)] : undefined,
      createdAt: toISODate(new Date()) === date
        ? new Date().toISOString()
        : `${date}T23:30:00.000Z`,
    });
  }

  return shifts;
}
