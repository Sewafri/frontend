import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-border-default bg-surface-card px-3 py-1.5 text-sm text-text-primary transition-colors placeholder:text-text-tertiary focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/20 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
