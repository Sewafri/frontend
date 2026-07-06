import { PageHeader } from "@/components/ui/page-header";
import ChartPlaceholder from "@/components/ui/chart-placeholder";
import GlassCard from "@/components/ui/glass-card";
import { TOP_INSTRUCTORS } from "@/constants/dashboard";
import { Star, Users } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="">
      <PageHeader
        title="Analytics"
        description="Detailed platform analytics"
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Monthly Active Users" height={280} type="line" />
        <ChartPlaceholder title="Revenue by Category" height={280} type="bar" />
        <ChartPlaceholder title="Course Completion Rate" height={250} type="line" />
        <ChartPlaceholder title="Enrollment Trends" height={250} type="bar" />
      </div>

      <h2 className="mb-4 text-lg font-semibold text-white">Top Instructors</h2>
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-glass text-xs text-text-secondary">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Instructor</th>
                <th className="pb-3 font-medium">Specialty</th>
                <th className="pb-3 font-medium">Students</th>
                <th className="pb-3 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {TOP_INSTRUCTORS.map((inst) => (
                <tr key={inst.id} className="border-b border-border-glass last:border-0">
                  <td className="py-3 text-text-secondary">{inst.rank}</td>
                  <td className="py-3 font-medium text-white">{inst.name}</td>
                  <td className="py-3 text-text-secondary">{inst.specialty}</td>
                  <td className="py-3 text-text-secondary">{inst.students.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-yellow-500"><Star className="h-3.5 w-3.5 fill-yellow-500" /> {inst.rating}</span>
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
