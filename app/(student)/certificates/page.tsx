import { PageHeader } from "@/components/ui/page-header";
import { ALL_CERTIFICATES } from "@/constants/dashboard";
import { Award, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  return (
    <div className="">
      <PageHeader
        title="My Certificates"
        description="View and download your course completion certificates"
      />

      {ALL_CERTIFICATES.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-xl border border-border-glass bg-surface-dark p-6 transition-all hover:border-brand-orange/50"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-orange/10">
                <Award className="h-7 w-7 text-brand-orange" />
              </div>
              <h3 className="mb-1 font-semibold text-white">{cert.courseName}</h3>
              <p className="mb-4 text-xs text-text-secondary">Completed {cert.completionDate}</p>
              <div className="flex items-center gap-3 border-t border-border-glass pt-4">
                <button className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-brand-orange transition-colors hover:text-brand-orange/80">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
                <Link
                  href={`/verify/${cert.id}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Verify
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-glass bg-surface-dark py-20">
          <Award className="mb-3 h-12 w-12 text-text-secondary" />
          <p className="text-lg font-medium text-white">No certificates yet</p>
          <p className="mt-1 text-sm text-text-secondary">Complete courses to earn certificates</p>
        </div>
      )}
    </div>
  );
}
