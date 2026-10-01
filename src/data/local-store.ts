import { generateSeedShifts, MOCK_PROFILE } from "@/data/mock-data";
import type { Shift, UserProfile } from "@/types";

/**
 * Demo persistence layer.
 *
 * Seed shifts are regenerated relative to today on every read so the demo is
 * never stale, while anything the user adds or deletes lives in
 * `localStorage`. Replacing this file with Supabase queries is the only change
 * needed to move the app onto a real database.
 */

const STORAGE_KEY = "tiply.demo.v1";

interface StoredState {
  addedShifts: Shift[];
  removedShiftIds: string[];
  profile: UserProfile | null;
}

const EMPTY_STATE: StoredState = {
  addedShifts: [],
  removedShiftIds: [],
  profile: null,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readState(): StoredState {
  if (!isBrowser()) return EMPTY_STATE;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      addedShifts: parsed.addedShifts ?? [],
      removedShiftIds: parsed.removedShiftIds ?? [],
      profile: parsed.profile ?? null,
    };
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(state: StoredState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing or a full quota: the session still works in memory.
  }
}

export function loadShifts(): Shift[] {
  const { addedShifts, removedShiftIds } = readState();
  const removed = new Set(removedShiftIds);
  const seeded = generateSeedShifts().filter((shift) => !removed.has(shift.id));
  return [...seeded, ...addedShifts];
}

export function persistAddedShift(shift: Shift): void {
  const state = readState();
  writeState({ ...state, addedShifts: [...state.addedShifts, shift] });
}

export function persistRemovedShift(id: string): void {
  const state = readState();
  writeState({
    ...state,
    addedShifts: state.addedShifts.filter((shift) => shift.id !== id),
    removedShiftIds: state.removedShiftIds.includes(id)
      ? state.removedShiftIds
      : [...state.removedShiftIds, id],
  });
}

export function loadProfile(): UserProfile {
  return readState().profile ?? MOCK_PROFILE;
}

export function persistProfile(profile: UserProfile): void {
  writeState({ ...readState(), profile });
}

export function resetDemoData(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
