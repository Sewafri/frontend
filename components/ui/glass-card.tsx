import { cn } from "@/lib/utils";

type CardVariant = "default" | "bordered";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-surface-card border border-border-default",
  bordered: [
    "bg-surface-card",
    "border-2 border-border-strong",
  ].join(" "),
};

export default function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
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
