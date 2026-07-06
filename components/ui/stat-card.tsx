import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="group rounded-xl border border-border-glass bg-surface-card p-5 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-glass">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trendUp ? "text-green-400" : "text-red-400"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange transition-all duration-200 group-hover:bg-brand-orange/20">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
