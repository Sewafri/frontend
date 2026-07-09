import { PageHeader } from "@/components/ui/page-header";
import { Info } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Platform configuration"
      />

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-accent-amber/20 bg-accent-amber/5 px-4 py-3 text-xs text-accent-amber">
        <Info className="h-4 w-4 shrink-0" />
        Platform settings endpoint not yet available.
      </div>

      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-text-tertiary">Platform settings will be available when the backend endpoint is added.</p>
      </div>
    </div>
  );
}
