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
  active: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  published: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  completed: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-400" },
  pending: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-400" },
  draft: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  inactive: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  rejected: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  approved: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
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
