import { PageHeader } from "@/components/ui/page-header";
import { Info } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Detailed platform analytics"
      />

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-accent-amber/20 bg-accent-amber/5 px-4 py-3 text-xs text-accent-amber">
        <Info className="h-4 w-4 shrink-0" />
        Analytics endpoints not yet available. Key metrics are shown on the dashboard.
      </div>

      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-text-tertiary">Full analytics coming when backend endpoints are added.</p>
      </div>
    </div>
  );
}
