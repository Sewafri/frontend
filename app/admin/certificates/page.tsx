import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { ALL_CERTIFICATES } from "@/constants/dashboard";
import { Award, Download, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminCertificatesPage() {
  return (
    <div className="">
      <PageHeader
        title="Certificates"
        description="Manage course completion certificates"
      />

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-glass text-xs text-text-secondary">
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Completed</th>
                <th className="pb-3 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {ALL_CERTIFICATES.map((cert) => (
                <tr key={cert.id} className="border-b border-border-glass last:border-0">
                  <td className="py-3 font-medium text-white">{cert.courseName}</td>
                  <td className="py-3 text-text-secondary">Student</td>
                  <td className="py-3 text-text-secondary">{cert.completionDate}</td>
                  <td className="py-3">
                    <button className="cursor-pointer flex items-center gap-1 text-xs text-brand-orange hover:underline">
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
