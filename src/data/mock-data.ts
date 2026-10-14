import type { UserProfile, Workplace } from "@/types";

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
