import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border-2 border-[#d1d5db] bg-white px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#6b7280] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#2563eb] focus-visible:border-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f3f4f6] aria-invalid:border-[#dc2626] aria-invalid:ring-[#dc2626]",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
