"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import ProgressBar from "@/components/ui/progress-bar";
import { getCourseEnrollments } from "@/lib/data/enrollments";
import type { Enrollment } from "@/types/db";

interface EnrollmentWithUser extends Enrollment {
  user: { id: string; fullName: string; email: string }
}

export default function StudentProgressPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [enrollments, setEnrollments] = useState<EnrollmentWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    getCourseEnrollments(courseId)
      .then((data) => setEnrollments(data as unknown as EnrollmentWithUser[]))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  return (
    <div className="">
      <PageHeader
        title="Student Progress"
        description="Track enrolled student performance"
      />

      {loading ? (
        <p className="text-sm text-text-secondary">Loading students...</p>
      ) : enrollments.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">No students enrolled yet.</p>
      ) : (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-default text-xs text-text-secondary">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id} className="border-b border-border-default last:border-0">
                    <td className="py-3 font-medium text-text-primary">{e.user?.fullName ?? "Unknown"}</td>
                    <td className="py-3 text-text-secondary">{e.user?.email ?? "—"}</td>
                    <td className="py-3">
                      <ProgressBar value={e.progressPercent ?? 0} size="sm" className="max-w-[120px]" />
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.status === "ACTIVE" ? "bg-accent-green/10 text-accent-green" :
                        e.status === "COMPLETED" ? "bg-accent-blue/10 text-accent-blue" :
                        "bg-accent-amber/10 text-accent-amber"
                      }`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
