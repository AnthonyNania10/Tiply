import { MOCK_PROFILE, MOCK_WORKPLACES } from "@/data/mock-data";
import type { Shift, UserProfile, Workplace } from "@/types";

/**
 * Demo persistence layer.
 *
 * User-entered shifts, workplaces, and profile settings live in
 * `localStorage`. Replacing this file with Supabase queries is the only change
 * needed to move the app onto a real database.
 */

const STORAGE_KEY = "tiply.demo.v1";

interface StoredState {
  addedShifts: Shift[];
  removedShiftIds: string[];
  addedWorkplaces: Workplace[];
  profile: UserProfile | null;
}

const EMPTY_STATE: StoredState = {
  addedShifts: [],
  removedShiftIds: [],
  addedWorkplaces: [],
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
      addedWorkplaces: parsed.addedWorkplaces ?? [],
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
  return addedShifts.filter((shift) => !removed.has(shift.id));
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

export function loadWorkplaces(): Workplace[] {
  const { addedWorkplaces } = readState();
  return [...MOCK_WORKPLACES, ...addedWorkplaces];
}

export function persistAddedWorkplace(workplace: Workplace): void {
  const state = readState();
  writeState({
    ...state,
    addedWorkplaces: [...state.addedWorkplaces, workplace],
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
