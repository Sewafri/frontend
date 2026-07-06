import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { User, Lock, Bell, CreditCard } from "lucide-react";

const NOTIFICATION_SETTINGS = [
  { label: "Course updates", description: "Get notified when course content is updated" },
  { label: "New courses", description: "Get notified when new courses are available" },
  { label: "Deadline reminders", description: "Receive reminders about upcoming deadlines" },
  { label: "Achievements", description: "Get notified when you earn new achievements" },
];

const PAYMENT_HISTORY = [
  { id: "p1", course: "Web Development Bootcamp", amount: "$89", date: "2026-06-15", status: "Completed" },
  { id: "p2", course: "Data Science Fundamentals", amount: "$79", date: "2026-06-10", status: "Completed" },
  { id: "p3", course: "UI/UX Design Masterclass", amount: "$69", date: "2026-05-28", status: "Completed" },
];

export default function SettingsPage() {
  return (
    <div className="">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="space-y-8">
        {/* Profile */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <User className="h-5 w-5 text-brand-orange" /> Profile
          </h2>
          <GlassCard>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Full Name</label>
                <input type="text" defaultValue="John Doe" readOnly className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2 text-sm text-text-primary outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Email</label>
                <input type="email" defaultValue="john@example.com" readOnly className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2 text-sm text-text-primary outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Bio</label>
                <textarea rows={3} defaultValue="Passionate learner exploring web development." readOnly className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2 text-sm text-text-primary outline-none" />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Password */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Lock className="h-5 w-5 text-brand-orange" /> Password
          </h2>
          <GlassCard>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">New Password</label>
                <input type="password" placeholder="Enter new password" className="w-full rounded-lg border border-border-glass bg-surface-card px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none" />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <Bell className="h-5 w-5 text-brand-orange" /> Notifications
          </h2>
          <GlassCard>
            <div className="space-y-4">
              {NOTIFICATION_SETTINGS.map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{n.label}</p>
                    <p className="text-xs text-text-secondary">{n.description}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-5 w-9 rounded-full bg-neutral-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-orange peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Payment History */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <CreditCard className="h-5 w-5 text-brand-orange" /> Payment History
          </h2>
          <GlassCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-glass text-xs text-text-secondary">
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((p) => (
                    <tr key={p.id} className="border-b border-border-glass last:border-0">
                      <td className="py-3 text-text-primary">{p.course}</td>
                      <td className="py-3 text-text-secondary">{p.amount}</td>
                      <td className="py-3 text-text-secondary">{p.date}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-accent-green/10 px-2 py-0.5 text-xs font-medium text-accent-green">{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
