// ProgressBar: A horizontal progress bar with optional label and percentage
// Props:
//   value: number (0-100)
//   label?: string (optional label above the bar)
//   showPercentage?: boolean (default true, shows 42% text)
//   size?: "sm" | "md" (default "md")
//   className?: string

export default function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  className = "",
}: {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const heights = { sm: "h-1.5", md: "h-2.5" };
  const textSizes = { sm: "text-xs", md: "text-sm" };

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className={`${textSizes[size]} font-medium text-text-secondary`}>{label}</span>}
          {showPercentage && <span className={`${textSizes[size]} font-medium text-text-primary`}>{clamped}%</span>}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-gray-800 ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full bg-gradient-to-r from-brand-orange to-orange-500 transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
