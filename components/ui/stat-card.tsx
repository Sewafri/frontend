import { ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ label, value, icon: Icon, iconBg = "bg-gray-100 dark:bg-gray-800", iconColor = "text-gray-900 dark:text-gray-100", trend, trendUp }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border-default bg-surface-card p-5 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-3xl font-bold tracking-tighter text-text-primary">{value}</p>
          {trend && trend !== "neutral" && (
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
            )}>
              {trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowUp className="h-3 w-3 rotate-180" />}
              {trend}
            </span>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          iconBg,
          iconColor,
        )}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
