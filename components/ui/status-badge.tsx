// StatusBadge: A pill badge for displaying entity status
// Props: status (string) - one of: active, pending, approved, rejected, completed, draft, published, inactive
// Maps status to color:
//   active/published/completed -> green
//   pending -> yellow/amber
//   draft/inactive -> gray
//   rejected -> red
//   approved -> blue
// Size: text-xs px-2.5 py-0.5 rounded-full font-medium

type StatusVariant = "active" | "pending" | "approved" | "rejected" | "completed" | "draft" | "published" | "inactive";

const statusStyles: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-accent-green/10", text: "text-accent-green", dot: "bg-accent-green" },
  published: { bg: "bg-accent-green/10", text: "text-accent-green", dot: "bg-accent-green" },
  completed: { bg: "bg-accent-green/10", text: "text-accent-green", dot: "bg-accent-green" },
  pending: { bg: "bg-accent-amber/10", text: "text-accent-amber", dot: "bg-accent-amber" },
  draft: { bg: "bg-neutral-500/10", text: "text-neutral-400", dot: "bg-neutral-400" },
  inactive: { bg: "bg-neutral-500/10", text: "text-neutral-400", dot: "bg-neutral-400" },
  rejected: { bg: "bg-accent-red/10", text: "text-accent-red", dot: "bg-accent-red" },
  approved: { bg: "bg-accent-blue/10", text: "text-accent-blue", dot: "bg-accent-blue" },
};

export default function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase() as StatusVariant;
  const style = statusStyles[key] ?? statusStyles.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
