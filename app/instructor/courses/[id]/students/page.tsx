"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Student Progress</h1>
        <p className="mt-1 text-sm text-brand-text-mid">Track enrolled student performance</p>
      </div>

      {loading ? (
        <p className="text-sm text-brand-text-mid">Loading students...</p>
      ) : enrollments.length === 0 ? (
        <p className="py-8 text-center text-sm text-brand-text-mid">No students enrolled yet.</p>
      ) : (
        <div className="rounded-xl border border-brand-border bg-brand-card p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border text-xs text-brand-text-mid">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e.id} className="border-b border-brand-border last:border-0">
                    <td className="py-3 font-medium text-brand-text">{e.user?.fullName ?? "Unknown"}</td>
                    <td className="py-3 text-brand-text-mid">{e.user?.email ?? "\u2014"}</td>
                    <td className="py-3">
                      <ProgressBar value={e.progressPercent ?? 0} size="sm" className="max-w-[120px]" />
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.status === "ACTIVE" ? "bg-brand-green-light text-brand-green" :
                        e.status === "COMPLETED" ? "bg-accent-blue/10 text-accent-blue" :
                        "bg-brand-amber/10 text-brand-amber"
                      }`}>{e.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
