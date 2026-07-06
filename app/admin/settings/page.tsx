import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";

const PLATFORM_SETTINGS = [
  { label: "Allow new registrations", description: "New users can create accounts" },
  { label: "Instructor applications", description: "Accept new instructor applications" },
  { label: "Auto-publish courses", description: "Auto-approve course submissions" },
  { label: "Maintenance mode", description: "Disable platform for maintenance" },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Platform configuration"
      />

      <GlassCard>
        <div className="space-y-2">
          {PLATFORM_SETTINGS.map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-surface-card-hover">
              <div>
                <p className="text-sm font-medium text-text-primary">{s.label}</p>
                <p className="text-xs text-text-tertiary">{s.description}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-border-default after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-surface-card after:transition-all peer-checked:bg-brand-500 peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
