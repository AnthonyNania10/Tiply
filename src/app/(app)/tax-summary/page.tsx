import type { Metadata } from "next";

import { TaxView } from "./tax-view";

export const metadata: Metadata = {
  title: "Tax & Income Summary",
};

export default function TaxSummaryPage() {
  return <TaxView />;
}
