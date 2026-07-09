import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { Settings } from "lucide-react";

export default function InstructorSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Your account and profile settings"
      />
      <GlassCard>
        <div className="flex flex-col items-center py-16 text-center">
          <Settings className="mb-3 h-10 w-10 text-text-tertiary" />
          <p className="text-sm text-text-tertiary">Profile settings will be available when integrated with the users endpoint.</p>
        </div>
      </GlassCard>
    </div>
  );
}
