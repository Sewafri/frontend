import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import ProgressBar from "@/components/ui/progress-bar";
import { Users } from "lucide-react";

const ENROLLED_STUDENTS = [
  { id: "s1", name: "Alex Johnson", email: "alex@example.com", progress: 65, lastActive: "2 hours ago", grade: "B+" },
  { id: "s2", name: "Maria Garcia", email: "maria@example.com", progress: 82, lastActive: "1 day ago", grade: "A-" },
  { id: "s3", name: "James Thompson", email: "james@example.com", progress: 34, lastActive: "3 days ago", grade: "C+" },
  { id: "s4", name: "Priya Sharma", email: "priya@example.com", progress: 91, lastActive: "5 hours ago", grade: "A" },
  { id: "s5", name: "Kevin Osei", email: "kevin@example.com", progress: 15, lastActive: "1 week ago", grade: "D" },
];

export default function StudentProgressPage() {
  return (
    <div className="">
      <PageHeader
        title="Student Progress"
        description="Track enrolled student performance"
      />

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-glass text-xs text-text-secondary">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Last Active</th>
                <th className="pb-3 font-medium">Grade</th>
              </tr>
            </thead>
            <tbody>
              {ENROLLED_STUDENTS.map((s) => (
                <tr key={s.id} className="border-b border-border-glass last:border-0">
                  <td className="py-3 font-medium text-white">{s.name}</td>
                  <td className="py-3 text-text-secondary">{s.email}</td>
                  <td className="py-3">
                    <ProgressBar value={s.progress} size="sm" className="max-w-[120px]" />
                  </td>
                  <td className="py-3 text-text-secondary">{s.lastActive}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.grade.startsWith("A") ? "bg-green-500/10 text-green-400" :
                      s.grade.startsWith("B") ? "bg-blue-500/10 text-blue-400" :
                      s.grade.startsWith("C") ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>{s.grade}</span>
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
