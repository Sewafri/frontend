"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import ApprovalCard from "@/components/ui/approval-card";
import { Info } from "lucide-react";

const APPLICATIONS = [
  { id: "a1", name: "Dr. Sarah Wilson", email: "sarah@example.com", initials: "SW", appliedFor: "Instructor", date: "2026-07-01", status: "pending" },
  { id: "a2", name: "Prof. Michael Brown", email: "michael@example.com", initials: "MB", appliedFor: "Instructor", date: "2026-06-28", status: "pending" },
  { id: "a3", name: "Lisa Chen", email: "lisa@example.com", initials: "LC", appliedFor: "Instructor", date: "2026-06-25", status: "approved" },
  { id: "a4", name: "James Rodriguez", email: "james@example.com", initials: "JR", appliedFor: "Instructor", date: "2026-06-20", status: "rejected" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(APPLICATIONS);

  const handleApprove = (id: string) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: "approved" } : a));
  };

  const handleReject = (id: string) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" } : a));
  };

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Review instructor applications"
      />

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-accent-amber/20 bg-accent-amber/5 px-4 py-3 text-xs text-accent-amber">
        <Info className="h-4 w-4 shrink-0" />
        Backend endpoint not yet available — showing preview data. Approve/reject actions are local only.
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <ApprovalCard
            key={app.id}
            applicant={{ name: app.name, email: app.email, initials: app.initials }}
            appliedFor={app.appliedFor}
            date={app.date}
            status={app.status}
            onApprove={() => handleApprove(app.id)}
            onReject={() => handleReject(app.id)}
          />
        ))}
      </div>
    </div>
  );
}
