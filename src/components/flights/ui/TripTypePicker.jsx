import React, { useState } from "react";
import { Repeat, ArrowRight, Shuffle, ChevronDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function TripTypePicker({ tripType, setTripType }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const types = [
    { id: "roundtrip", label: t("search.flight.tripTypes.roundtrip"), icon: <Repeat size={16} /> },
    { id: "oneway", label: t("search.flight.tripTypes.oneway"), icon: <ArrowRight size={16} /> },
    { id: "multi", label: t("search.flight.tripTypes.multi"), icon: <Shuffle size={16} /> },
  ];

  const activeOption = types.find(t => t.id === tripType) || types[0];

  return (
    <div className="mb-4 min-[760px]:mb-0">
      {/* Desktop Version: Side-by-Side Buttons (>= 760px) */}
      {/* Desktop Version: Buttons Aligned Left (>= 760px) */}
      <div className="hidden min-[760px]:flex items-center gap-1.5 p-1.5 bg-white/5 dark:bg-zinc-900/5 backdrop-blur-md rounded-[2rem] border border-zinc-200 dark:border-zinc-800 w-fit">
        {types.map((option) => {
          const isActive = tripType === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setTripType(option.id)}
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-[1.5rem] transition-all duration-300 font-black uppercase italic tracking-wider text-sm lg:text-base whitespace-nowrap",
                isActive
                  ? "bg-white/20 dark:bg-white/10 backdrop-blur-md text-[var(--brand-color)] scale-[1.02] shadow-sm"
                  : "text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              <span className={cn("transition-colors", isActive ? "text-[var(--brand-color)]" : "text-zinc-600 dark:text-zinc-400")}>{option.icon}</span>
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="min-[760px]:hidden w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center justify-between w-full px-6 py-3 rounded-xl bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all outline-none",
                open && "ring-2 ring-[var(--brand-color)]/30 border-transparent"
              )}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--brand-color)" }} className="shrink-0">{activeOption.icon}</span>
                <span className="text-xs font-black uppercase italic tracking-wider text-zinc-700 dark:text-zinc-100">
                  {activeOption.label}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={cn("text-zinc-400 transition-transform duration-300", open && "rotate-180")}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            sideOffset={8}
            className="w-[--radix-popover-trigger-width] p-2 rounded-[2rem] border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl shadow-2xl z-[1000]"
          >
            <div className="space-y-1">
              {types.map((option) => {
                const isActive = tripType === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setTripType(option.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-[var(--brand-color)] text-white shadow-md shadow-[var(--brand-color)]/20"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(isActive ? "text-white" : "text-zinc-400")}>{option.icon}</span>
                      <span className="text-xs font-black uppercase italic tracking-tight">
                        {option.label}
                      </span>
                    </div>
                    {isActive && <Check size={14} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}