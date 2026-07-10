import { cn } from "@/lib/utils"

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success"
}) {
  const variants: Record<string, string> = {
    default:
      "border-accent-500/20 bg-accent-500/10 text-accent-500",
    secondary:
      "border-border-default bg-surface-sunken text-text-secondary",
    outline:
      "border-border-default bg-transparent text-text-primary",
    destructive:
      "border-accent-red/20 bg-accent-red/10 text-accent-red",
    success:
      "border-accent-green/20 bg-accent-green/10 text-accent-green",
  }

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-5 w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
