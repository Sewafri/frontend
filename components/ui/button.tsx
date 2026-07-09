import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-accent-500/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-accent-500 bg-accent-500 text-white hover:bg-accent-600 hover:border-accent-600",
        outline:
          "border-border-default bg-transparent text-text-primary hover:bg-surface-sunken",
        secondary:
          "border-border-default bg-surface-sunken text-text-primary hover:bg-border-default",
        ghost:
          "border-transparent bg-transparent text-text-secondary hover:bg-surface-sunken hover:text-text-primary",
        destructive:
          "border-accent-red/20 bg-accent-red/10 text-accent-red hover:bg-accent-red/20",
        link: "border-transparent bg-transparent text-accent-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
        lg: "h-10 gap-2 px-5 text-base",
        icon: "size-9",
        "icon-sm": "size-8 rounded-lg",
        "icon-xs": "size-7 rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
