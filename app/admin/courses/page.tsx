import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { ALL_COURSES } from "@/constants/dashboard";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";

const TOTAL_STUDENTS = ALL_COURSES.reduce((acc, c) => acc + c.students, 0);
const TOTAL_REVENUE = ALL_COURSES.reduce((acc, c) => acc + c.students * c.price, 0);

export default function AdminCoursesPage() {
  return (
    <div className="">
      <PageHeader
        title="Courses"
        description="Moderate platform courses"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border-glass bg-surface-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10"><BookOpen className="h-5 w-5 text-brand-orange" /></div>
            <div><p className="text-2xl font-bold text-white">{ALL_COURSES.length}</p><p className="text-xs text-text-secondary">Total Courses</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-border-glass bg-surface-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10"><Users className="h-5 w-5 text-blue-400" /></div>
            <div><p className="text-2xl font-bold text-white">{TOTAL_STUDENTS.toLocaleString()}</p><p className="text-xs text-text-secondary">Total Students</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-border-glass bg-surface-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-400" /></div>
            <div><p className="text-2xl font-bold text-white">${TOTAL_REVENUE.toLocaleString()}</p><p className="text-xs text-text-secondary">Est. Revenue</p></div>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-glass text-xs text-text-secondary">
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Instructor</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Students</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ALL_COURSES.map((c) => (
                <tr key={c.id} className="border-b border-border-glass last:border-0">
                  <td className="py-3 font-medium text-white">{c.title}</td>
                  <td className="py-3 text-text-secondary">{c.instructor}</td>
                  <td className="py-3 text-text-secondary">{c.category}</td>
                  <td className="py-3 text-text-secondary">{c.students.toLocaleString()}</td>
                  <td className="py-3 text-text-secondary">${c.price}</td>
                  <td className="py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
