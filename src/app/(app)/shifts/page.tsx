import type { Metadata } from "next";

import { HistoryView } from "./history-view";

export const metadata: Metadata = {
  title: "Shift History",
};

export default function ShiftsPage() {
  return <HistoryView />;
}
