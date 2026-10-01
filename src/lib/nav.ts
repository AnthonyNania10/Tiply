import {
  ChartColumn,
  History,
  Home,
  Plus,
  Receipt,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Rendered as the raised center action in the mobile bottom bar. */
  isPrimary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/shifts", label: "History", icon: History },
  { href: "/shifts/new", label: "Add Shift", icon: Plus, isPrimary: true },
  { href: "/analytics", label: "Analytics", icon: ChartColumn },
  { href: "/profile", label: "Profile", icon: User },
];

/** Reachable from the dashboard and profile instead of the five primary tabs. */
export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { href: "/tax-summary", label: "Tax summary", icon: Receipt },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/shifts") return pathname === "/shifts";
  return pathname === href || pathname.startsWith(`${href}/`);
}
