import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  loadShifts,
  loadWorkplaces,
  persistAddedShift,
  persistAddedWorkplace,
  persistRemovedShift,
} from "@/data/local-store";
import { MOCK_WORKPLACES } from "@/data/mock-data";
import type { Shift, Workplace } from "@/types";

function createLocalStorage(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      return values.get(key) ?? null;
    },
    key(index) {
      return [...values.keys()][index] ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

const shift: Shift = {
  id: "shift-user-1",
  date: "2026-10-01",
  workplaceId: "wp-harbor",
  hoursWorked: 6,
  cashTips: 85,
  cardTips: 140,
  hourlyWage: 9,
  createdAt: "2026-10-01T23:00:00.000Z",
};

describe("local store", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: createLocalStorage() });
  });

  it("starts with no shifts", () => {
    expect(loadShifts()).toEqual([]);
  });

  it("persists user-entered shifts and can remove them", () => {
    persistAddedShift(shift);
    expect(loadShifts()).toEqual([shift]);

    persistRemovedShift(shift.id);
    expect(loadShifts()).toEqual([]);
  });

  it("keeps starter workplaces and appends custom workplaces", () => {
    const custom: Workplace = {
      id: "workplace-user-1",
      name: "The Blue Room",
      role: "Bartender",
      defaultHourlyWage: 12.5,
    };

    expect(loadWorkplaces()).toEqual(MOCK_WORKPLACES);

    persistAddedWorkplace(custom);

    expect(loadWorkplaces()).toEqual([...MOCK_WORKPLACES, custom]);
  });

  it("reads older stored state that does not include workplaces", () => {
    window.localStorage.setItem(
      "tiply.demo.v1",
      JSON.stringify({
        addedShifts: [shift],
        removedShiftIds: [],
        profile: null,
      }),
    );

    expect(loadShifts()).toEqual([shift]);
    expect(loadWorkplaces()).toEqual(MOCK_WORKPLACES);
  });
});
