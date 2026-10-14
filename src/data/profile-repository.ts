import { loadProfile, persistProfile, resetDemoData } from "@/data/local-store";
import type { UserProfile } from "@/types";

/**
 * Profile + session contract. A Supabase implementation would read the row
 * for `auth.uid()` here and call `supabase.auth.signOut()` in `signOut`.
 */
export interface ProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(patch: Partial<UserProfile>): Promise<UserProfile>;
  signOut(): Promise<void>;
}

export const localProfileRepository: ProfileRepository = {
  async getProfile() {
    return loadProfile();
  },

  async updateProfile(patch) {
    const next = { ...loadProfile(), ...patch };
    persistProfile(next);
    return next;
  },

  async signOut() {
    resetDemoData();
  },
};

export const profileRepository: ProfileRepository = localProfileRepository;
