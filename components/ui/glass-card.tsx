import { cn } from "@/lib/utils";

type GlassCardVariant = "default" | "interactive" | "elevated" | "bordered" | "inset" | "featured";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassCardVariant;
}

const variantClasses: Record<GlassCardVariant, string> = {
  default:
    "bg-surface-card border border-border-subtle",
  interactive: [
    "bg-surface-card border border-border-subtle",
    "cursor-pointer",
    "transition-all duration-200",
    "hover:border-brand-300/30 hover:shadow-md hover:-translate-y-0.5",
  ].join(" "),
  elevated: [
    "bg-surface-card-elevated",
    "shadow-md border border-border-subtle",
  ].join(" "),
  bordered: [
    "bg-transparent",
    "border-2 border-border-default border-dashed",
  ].join(" "),
  inset: [
    "bg-surface-sunken",
    "border-none",
  ].join(" "),
  featured: [
    "bg-surface-card",
    "border-brand-500/20 shadow-glow",
    "relative overflow-hidden",
    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-brand-500/5 before:to-transparent before:pointer-events-none",
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
        "rounded-xl p-6",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
