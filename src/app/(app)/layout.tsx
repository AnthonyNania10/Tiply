import { AppShell } from "@/components/app-shell";
import { TiplyProvider } from "@/providers/tiply-provider";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <TiplyProvider>
      <AppShell>{children}</AppShell>
    </TiplyProvider>
  );
}
