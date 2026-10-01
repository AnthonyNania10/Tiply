import {
  loadShifts,
  persistAddedShift,
  persistRemovedShift,
} from "@/data/local-store";
import { MOCK_WORKPLACES } from "@/data/mock-data";
import type { Shift, ShiftDraft, Workplace } from "@/types";

/**
 * The contract every storage backend must satisfy. Swapping the mock for
 * Supabase means writing a `SupabaseShiftRepository` that implements this
 * interface and exporting it as `shiftRepository` below — no component or
 * hook changes required.
 */
export interface ShiftRepository {
  listWorkplaces(): Promise<Workplace[]>;
  listShifts(): Promise<Shift[]>;
  createShift(draft: ShiftDraft): Promise<Shift>;
  deleteShift(id: string): Promise<void>;
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `shift-${crypto.randomUUID()}`;
  }
  return `shift-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const localShiftRepository: ShiftRepository = {
  async listWorkplaces() {
    return MOCK_WORKPLACES;
  },

  async listShifts() {
    return loadShifts();
  },

  async createShift(draft) {
    const shift: Shift = {
      ...draft,
      id: createId(),
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
