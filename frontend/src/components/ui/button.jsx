import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#364559] text-white shadow hover:bg-[#2d3947] focus-visible:ring-[#2563eb]",
        destructive:
          "bg-[#dc2626] text-white shadow-sm hover:bg-[#b91c1c] focus-visible:ring-[#2563eb]",
        outline:
          "border-2 border-[#364559] text-[#364559] shadow-sm hover:bg-[#364559] hover:text-white focus-visible:ring-[#2563eb]",
        secondary:
          "bg-[#e5e7eb] text-[#1f2937] shadow-sm hover:bg-[#d1d5db] focus-visible:ring-[#2563eb]",
        ghost: "hover:bg-[#e5e7eb] hover:text-[#1f2937] focus-visible:ring-[#2563eb]",
        link: "text-[#364559] underline-offset-4 hover:underline focus-visible:ring-[#2563eb]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
