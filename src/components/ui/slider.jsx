"use client"
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => {
  const value = props.value || props.defaultValue || [0]
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/80">
        <SliderPrimitive.Range className="absolute h-full" style={{ backgroundColor: "var(--brand-color)" }} />
      </SliderPrimitive.Track>
      {value.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-5 w-5 rounded-full border-2 bg-white dark:bg-[#0c0c0e] cursor-pointer shadow-lg hover:scale-110 transition-transform focus:outline-none"
          style={{ borderColor: "var(--brand-color)" }}
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName
export { Slider }