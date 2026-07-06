import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ALL_CERTIFICATES } from "@/constants/dashboard";
import { Download } from "lucide-react";

export default function AdminCertificatesPage() {
  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Manage course completion certificates"
      />

      <GlassCard className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-tertiary">
                <th className="px-6 pb-3 pt-4 font-medium">Course</th>
                <th className="px-6 pb-3 pt-4 font-medium">Student</th>
                <th className="px-6 pb-3 pt-4 font-medium">Completed</th>
                <th className="px-6 pb-3 pt-4 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {ALL_CERTIFICATES.map((cert) => (
                <tr key={cert.id} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                  <td className="px-6 py-3.5 font-medium text-text-primary">{cert.courseName}</td>
                  <td className="px-6 py-3.5 text-text-secondary">Student</td>
                  <td className="px-6 py-3.5 text-text-secondary">{cert.completionDate}</td>
                  <td className="px-6 py-3.5">
                    <button className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-brand-500 transition-colors hover:text-brand-600">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
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
