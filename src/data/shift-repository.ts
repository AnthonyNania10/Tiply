import {
  loadShifts,
  loadWorkplaces,
  persistAddedShift,
  persistAddedWorkplace,
  persistRemovedShift,
} from "@/data/local-store";
import type {
  Shift,
  ShiftDraft,
  Workplace,
  WorkplaceDraft,
} from "@/types";

/**
 * The contract every storage backend must satisfy. Swapping the mock for
 * Supabase means writing a `SupabaseShiftRepository` that implements this
 * interface and exporting it as `shiftRepository` below — no component or
 * hook changes required.
 */
export interface ShiftRepository {
  listWorkplaces(): Promise<Workplace[]>;
  createWorkplace(draft: WorkplaceDraft): Promise<Workplace>;
  listShifts(): Promise<Shift[]>;
  createShift(draft: ShiftDraft): Promise<Shift>;
  deleteShift(id: string): Promise<void>;
}

function createId(prefix: "shift" | "workplace"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const localShiftRepository: ShiftRepository = {
  async listWorkplaces() {
    return loadWorkplaces();
  },

  async createWorkplace(draft) {
    const workplace: Workplace = {
      ...draft,
      id: createId("workplace"),
    };
    persistAddedWorkplace(workplace);
    return workplace;
  },

  async listShifts() {
    return loadShifts();
  },

  async createShift(draft) {
    const shift: Shift = {
      ...draft,
      id: createId("shift"),
      createdAt: new Date().toISOString(),
    };
    persistAddedShift(shift);
    return shift;
  },

  async deleteShift(id) {
    persistRemovedShift(id);
  },
};

export const shiftRepository: ShiftRepository = localShiftRepository;
