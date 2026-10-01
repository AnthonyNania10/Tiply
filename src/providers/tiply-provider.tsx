"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { MOCK_PROFILE, MOCK_WORKPLACES } from "@/data/mock-data";
import { profileRepository } from "@/data/profile-repository";
import { shiftRepository } from "@/data/shift-repository";
import { sortByDateDesc } from "@/lib/earnings";
import type {
  Shift,
  ShiftDraft,
  UserProfile,
  Workplace,
  WorkplaceDraft,
} from "@/types";

export interface TiplyStore {
  isLoading: boolean;
  /** Always newest-first. */
  shifts: Shift[];
  workplaces: Workplace[];
  profile: UserProfile;
  addWorkplace: (draft: WorkplaceDraft) => Promise<Workplace>;
  addShift: (draft: ShiftDraft) => Promise<Shift>;
  deleteShift: (id: string) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  workplaceName: (id: string) => string;
}

export const TiplyContext = createContext<TiplyStore | null>(null);

export function TiplyProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>(MOCK_WORKPLACES);
  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);

  // Data is read after mount so the browser-only demo store never causes a
  // hydration mismatch. A real backend would fetch on the server instead.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [loadedShifts, loadedWorkplaces, loadedProfile] = await Promise.all([
        shiftRepository.listShifts(),
        shiftRepository.listWorkplaces(),
        profileRepository.getProfile(),
      ]);
      if (cancelled) return;
      setShifts(sortByDateDesc(loadedShifts));
      setWorkplaces(loadedWorkplaces);
      setProfile(loadedProfile);
      setIsLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addShift = useCallback(async (draft: ShiftDraft) => {
    const created = await shiftRepository.createShift(draft);
    setShifts((current) => sortByDateDesc([...current, created]));
    return created;
  }, []);

  const addWorkplace = useCallback(async (draft: WorkplaceDraft) => {
    const created = await shiftRepository.createWorkplace(draft);
    setWorkplaces((current) => [...current, created]);
    return created;
  }, []);

  const deleteShift = useCallback(async (id: string) => {
    await shiftRepository.deleteShift(id);
    setShifts((current) => current.filter((shift) => shift.id !== id));
  }, []);

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    const next = await profileRepository.updateProfile(patch);
    setProfile(next);
  }, []);

  const signOut = useCallback(async () => {
    await profileRepository.signOut();
  }, []);

  const value = useMemo<TiplyStore>(() => {
    const names = new Map(workplaces.map((wp) => [wp.id, wp.name]));
    return {
      isLoading,
      shifts,
      workplaces,
      profile,
      addWorkplace,
      addShift,
      deleteShift,
      updateProfile,
      signOut,
      workplaceName: (id: string) => names.get(id) ?? "Unassigned",
    };
  }, [
    addWorkplace,
    addShift,
    deleteShift,
    isLoading,
    profile,
    shifts,
    signOut,
    updateProfile,
    workplaces,
  ]);

  return <TiplyContext.Provider value={value}>{children}</TiplyContext.Provider>;
}
