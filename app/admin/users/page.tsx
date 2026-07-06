import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { ALL_STUDENTS } from "@/constants/dashboard";
import { Search, Mail } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="">
      <PageHeader
        title="Users"
        description="Manage platform users"
      />

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input type="text" placeholder="Search users..." className="w-full cursor-pointer rounded-lg border border-border-glass bg-surface-dark py-2.5 pl-10 pr-4 text-sm text-white placeholder-text-secondary outline-none focus:border-brand-orange/50" />
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-glass text-xs text-text-secondary">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Enrolled</th>
                <th className="pb-3 font-medium">Courses</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ALL_STUDENTS.map((s) => (
                <tr key={s.id} className="border-b border-border-glass last:border-0">
                  <td className="py-3 font-medium text-white">{s.name}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Mail className="h-3.5 w-3.5" /> {s.email}
                    </span>
                  </td>
                  <td className="py-3 text-text-secondary">{s.enrolledDate}</td>
                  <td className="py-3 text-text-secondary">{s.coursesCount}</td>
                  <td className="py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
