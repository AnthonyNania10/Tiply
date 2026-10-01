import type { Metadata } from "next";

import { AddShiftForm } from "@/components/add-shift-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Add Shift",
};

export default function AddShiftPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="New entry"
        title="Add shift"
        description="Date and workplace are already filled in — enter hours and tips, then save."
      />
      <AddShiftForm />
    </div>
  );
}
