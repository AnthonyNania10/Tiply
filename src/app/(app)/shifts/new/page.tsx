import type { Metadata } from "next";

import { AddShiftForm } from "@/components/add-shift-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Add Shift",
};

export default function AddShiftPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Add shift"
        description="Enter hours and tips — the rest is prefilled."
      />
      <AddShiftForm />
    </div>
  );
}
