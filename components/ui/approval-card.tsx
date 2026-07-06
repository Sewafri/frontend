import { Check, X, Clock, User } from "lucide-react";
import StatusBadge from "./status-badge";

// ApprovalCard: Used in admin applications list to review instructor applications
// Props:
//   applicant: { name, email, initials }
//   appliedFor: string (e.g. "Instructor")
//   date: string
//   status: string (passed to StatusBadge)
//   onApprove?: () => void
//   onReject?: () => void

interface Applicant {
  name: string;
  email: string;
  initials: string;
}

interface ApprovalCardProps {
  applicant: Applicant;
  appliedFor: string;
  date: string;
  status: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function ApprovalCard({
  applicant,
  appliedFor,
  date,
  status,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-card p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/20 text-sm font-bold text-brand-orange">
            {applicant.initials}
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">{applicant.name}</h4>
            <p className="text-sm text-text-secondary">{applicant.email}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Applied for: {appliedFor}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {date}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status + Actions */}
        <div className="flex flex-col items-end gap-3">
          <StatusBadge status={status} />
          {status === "pending" && (
            <div className="flex items-center gap-2">
              <button
                onClick={onApprove}
                className="flex items-center gap-1 rounded-lg bg-accent-green/10 px-3 py-1.5 text-xs font-medium text-accent-green transition-colors hover:bg-accent-green/20"
              >
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                onClick={onReject}
                className="flex items-center gap-1 rounded-lg bg-accent-red/10 px-3 py-1.5 text-xs font-medium text-accent-red transition-colors hover:bg-accent-red/20"
              >
                <X className="h-3.5 w-3.5" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
