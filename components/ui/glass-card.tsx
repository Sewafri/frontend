import { cn } from "@/lib/utils";

type GlassCardVariant = "default" | "interactive" | "featured";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassCardVariant;
}

const variantClasses: Record<GlassCardVariant, string> = {
  default: "bg-surface-card",
  interactive: [
    "cursor-pointer",
    "bg-surface-card",
    "transition-colors duration-200",
    "hover:border-brand-orange/30 hover:bg-surface-card-hover",
  ].join(" "),
  featured: [
    "bg-surface-card",
    "border-brand-orange/20",
  ].join(" "),
};

export default function GlassCard({
  children,
  className = "",
  variant = "default",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle p-6",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
