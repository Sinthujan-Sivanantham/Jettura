import * as React from "react"
import { cn } from "@/lib/utils" // Falls kein Shadcn Utility vorhanden, durch normale Strings ersetzen

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Basis-Styling passend zu deinem "Premium" Look
        "flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b60ff] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-500 dark:focus-visible:ring-[#3b60ff]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }