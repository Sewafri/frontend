import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: "brand" | "blue" | "green" | "purple" | "amber";
}

const accentMap = {
  brand: { bg: "bg-brand-500/10", icon: "text-brand-500", ring: "ring-brand-500/20" },
  blue: { bg: "bg-accent-blue/10", icon: "text-accent-blue", ring: "ring-accent-blue/20" },
  green: { bg: "bg-accent-green/10", icon: "text-accent-green", ring: "ring-accent-green/20" },
  purple: { bg: "bg-accent-purple/10", icon: "text-accent-purple", ring: "ring-accent-purple/20" },
  amber: { bg: "bg-accent-amber/10", icon: "text-accent-amber", ring: "ring-accent-amber/20" },
};

export function StatCard({ label, value, icon: Icon, trend, trendUp, accent = "brand" }: StatCardProps) {
  const a = accentMap[accent];
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface-card p-5 shadow-sm ring-1 ring-border-subtle transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-text-primary">{value}</p>
          {trend && (
            <p className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trendUp ? "text-accent-green" : "text-accent-red",
            )}>
              <span className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                trendUp ? "bg-accent-green" : "bg-accent-red",
              )} />
              {trend}
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg ring-1 transition-all duration-200 group-hover:scale-110",
          a.bg, a.icon, a.ring,
        )}>
          <Icon size={20} />
        </div>
      </div>
      <div className={cn(
        "absolute -bottom-2 -right-2 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30",
        a.bg,
      )} />
    </div>
  );
}
