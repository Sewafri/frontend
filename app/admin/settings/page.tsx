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
    <div className="">
      <PageHeader
        title="Settings"
        description="Platform configuration"
      />

      <GlassCard>
        <div className="space-y-6">
          {PLATFORM_SETTINGS.map((s) => (
            <div key={s.label} className="flex items-center justify-between border-b border-border-glass pb-4 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-white">{s.label}</p>
                <p className="text-xs text-text-secondary">{s.description}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-orange peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
