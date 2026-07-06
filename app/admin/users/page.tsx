import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { ALL_STUDENTS } from "@/constants/dashboard";
import { Search, Mail } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform users"
      />

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search users..."
          aria-label="Search users"
          className="w-full rounded-lg border border-border-default bg-surface-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/10"
        />
      </div>

      <GlassCard className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-tertiary">
                <th className="px-6 pb-3 pt-4 font-medium">Name</th>
                <th className="px-6 pb-3 pt-4 font-medium">Email</th>
                <th className="px-6 pb-3 pt-4 font-medium">Enrolled</th>
                <th className="px-6 pb-3 pt-4 font-medium">Courses</th>
                <th className="px-6 pb-3 pt-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ALL_STUDENTS.map((s) => (
                <tr key={s.id} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                  <td className="px-6 py-3.5 font-medium text-text-primary">{s.name}</td>
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1.5 text-text-secondary">
                      <Mail className="h-3.5 w-3.5 text-text-tertiary" /> {s.email}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-text-secondary">{s.enrolledDate}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{s.coursesCount}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
