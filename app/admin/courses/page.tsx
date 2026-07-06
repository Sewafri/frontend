import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import StatusBadge from "@/components/ui/status-badge";
import { ALL_COURSES } from "@/constants/dashboard";
import { BookOpen, Users, DollarSign } from "lucide-react";

const TOTAL_STUDENTS = ALL_COURSES.reduce((acc, c) => acc + c.students, 0);
const TOTAL_REVENUE = ALL_COURSES.reduce((acc, c) => acc + c.students * c.price, 0);

const summaryCards = [
  { label: "Total Courses", value: ALL_COURSES.length, icon: BookOpen, accent: "brand" as const },
  { label: "Total Students", value: TOTAL_STUDENTS.toLocaleString(), icon: Users, accent: "blue" as const },
  { label: "Est. Revenue", value: `$${TOTAL_REVENUE.toLocaleString()}`, icon: DollarSign, accent: "green" as const },
];

export default function AdminCoursesPage() {
  return (
    <div>
      <PageHeader
        title="Courses"
        description="Moderate platform courses"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-xl bg-surface-card p-5 shadow-sm ring-1 ring-border-default">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${
              card.accent === "brand" ? "bg-brand-500/10 text-brand-500" :
              card.accent === "blue" ? "bg-accent-blue/10 text-accent-blue" :
              "bg-accent-green/10 text-accent-green"
            }`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{card.value}</p>
              <p className="text-xs text-text-tertiary">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <GlassCard className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-tertiary">
                <th className="px-6 pb-3 pt-4 font-medium">Course</th>
                <th className="px-6 pb-3 pt-4 font-medium">Instructor</th>
                <th className="px-6 pb-3 pt-4 font-medium">Category</th>
                <th className="px-6 pb-3 pt-4 font-medium">Students</th>
                <th className="px-6 pb-3 pt-4 font-medium">Price</th>
                <th className="px-6 pb-3 pt-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ALL_COURSES.map((c) => (
                <tr key={c.id} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                  <td className="px-6 py-3.5 font-medium text-text-primary">{c.title}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{c.instructor}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{c.category}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{c.students.toLocaleString()}</td>
                  <td className="px-6 py-3.5 text-text-secondary">${c.price}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
