import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const heights = { sm: "h-1.5", md: "h-2" };

  return (
    <div className={cn("", className)}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-xs font-medium text-text-secondary">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs font-semibold text-brand-500">{clamped}%</span>
          )}
        </div>
      )}
      <div className={cn(
        "w-full overflow-hidden rounded-full bg-surface-sunken",
        heights[size],
      )}>
        <div
          className={cn(
            "rounded-full bg-brand-500 transition-all duration-500 ease-out",
            heights[size],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
