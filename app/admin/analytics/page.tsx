import { PageHeader } from "@/components/ui/page-header";
import ChartPlaceholder from "@/components/ui/chart-placeholder";
import GlassCard from "@/components/ui/glass-card";
import { TOP_INSTRUCTORS } from "@/constants/dashboard";
import { Star, Trophy } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Detailed platform analytics"
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Monthly Active Users" subtitle="Last 12 months" height={280} type="line" />
        <ChartPlaceholder title="Revenue by Category" subtitle="Breakdown by course category" height={280} type="bar" />
        <ChartPlaceholder title="Course Completion Rate" subtitle="Average over time" height={250} type="line" />
        <ChartPlaceholder title="Enrollment Trends" subtitle="Weekly new enrollments" height={250} type="bar" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-brand-500" />
        <h2 className="text-lg font-semibold text-text-primary">Top Instructors</h2>
      </div>
      <GlassCard className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-tertiary">
                <th className="px-6 pb-3 pt-4 font-medium">#</th>
                <th className="px-6 pb-3 pt-4 font-medium">Instructor</th>
                <th className="px-6 pb-3 pt-4 font-medium">Specialty</th>
                <th className="px-6 pb-3 pt-4 font-medium">Students</th>
                <th className="px-6 pb-3 pt-4 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {TOP_INSTRUCTORS.map((inst) => (
                <tr key={inst.id} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                  <td className="px-6 py-3.5 text-text-tertiary">{inst.rank}</td>
                  <td className="px-6 py-3.5 font-medium text-text-primary">{inst.name}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{inst.specialty}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{inst.students.toLocaleString()}</td>
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1 text-accent-amber"><Star className="h-3.5 w-3.5 fill-accent-amber" /> {inst.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
