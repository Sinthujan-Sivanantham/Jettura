import React, { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

export default function TimePicker({ label, value, onChange, error, shakeKey }) {
    const [isOpen, setIsOpen] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        if (error && shakeKey > 0) {
            controls.stop();
            controls.set({ x: 0 });
            controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
        }
    }, [shakeKey, error, controls]);

    // Parse initial value (expected "HH:mm")
    const [selectedHour, setSelectedHour] = useState(value?.split(":")[0] || "10");
    const [selectedMinute, setSelectedMinute] = useState(value?.split(":")[1] || "00");

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

    const hourRefs = useRef({});
    const minuteRefs = useRef({});

    // Update internal state when external value changes
    useEffect(() => {
        if (value && value.includes(":")) {
            const [h, m] = value.split(":");
            // Only update if changed to avoid loops/waste
            if (h !== selectedHour) setTimeout(() => setSelectedHour(h), 0);
            if (m !== selectedMinute) setTimeout(() => setSelectedMinute(m), 0);
        }
    }, [value, selectedHour, selectedMinute]);

    const handleSelect = (h, m) => {
        const time = `${h}:${m}`;
        onChange?.(time);
    };

    const scrollToSelected = (type) => {
        const refs = type === "hour" ? hourRefs.current : minuteRefs.current;
        const selected = type === "hour" ? selectedHour : selectedMinute;
        if (refs[selected]) {
            refs[selected].scrollIntoView({ block: "center", behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                scrollToSelected("hour");
                scrollToSelected("minute");
            }, 50);
        }
    }, [isOpen]);

    const brandColor = "var(--brand-color)";

    return (
        <div className="flex flex-col gap-0 w-full relative">
            {label && (
                <label className="search-label-text font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mb-2 ml-1 flex items-center gap-1.5 italic leading-none">
                    {label}
                </label>
            )}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <motion.div animate={controls} className="w-full">
                    <PopoverTrigger asChild>
                        <button
                            className={cn(
                                "h-11 min-[760px]:h-14 w-full search-input-text font-black italic uppercase bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl lg:rounded-2xl flex items-center transition-all shadow-inner outline-none focus:ring-2 relative",
                                error ? "border-rose-500 dark:border-rose-500" : "hover:border-zinc-300 dark:hover:border-zinc-700",
                                "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px] pr-4"
                            )}
                            style={{
                                "--tw-ring-color": brandColor,
                                color: value ? "inherit" : "var(--zinc-400)"
                            }}
                        >
                            <Clock
                                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-5 h-5 shrink-0"
                                style={{ color: error ? "#f43f5e" : brandColor }}
                            />
                            <span className={cn("search-input-text font-black italic uppercase truncate", value ? "text-zinc-900 dark:text-zinc-100" : (error ? "text-rose-500" : "text-zinc-400"))}>
                                {value || (error ? "AUSWÄHLEN!" : "Zeit wählen")}
                            </span>
                        </button>
                    </PopoverTrigger>
                </motion.div>

                <PopoverContent
                    align="start"
                    collisionPadding={20}
                    className="p-0 w-64 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-3xl border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden"
                >
                    <div className="flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase italic tracking-widest text-zinc-400">Intelligence Time</span>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border dark:border-zinc-700 shadow-sm">
                                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-black italic" style={{ color: brandColor }}>{selectedHour}:{selectedMinute}</span>
                            </div>
                        </div>

                        {/* Columns */}
                        <div className="flex h-64">
                            {/* Hours Column */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar border-r border-zinc-100 dark:border-zinc-900 py-2">
                                <p className="text-[7px] sm:text-[8px] font-black text-center text-zinc-300 uppercase tracking-tighter mb-2">Stunden</p>
                                {hours.map((h) => (
                                    <button
                                        key={h}
                                        ref={(el) => (hourRefs.current[h] = el)}
                                        onClick={() => {
                                            setSelectedHour(h);
                                            handleSelect(h, selectedMinute);
                                        }}
                                        className={cn(
                                            "w-full py-2.5 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-black italic transition-all relative flex items-center justify-center translate-x-0 active:scale-90",
                                            selectedHour === h ? "text-white scale-110" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                        )}
                                    >
                                        {selectedHour === h && (
                                            <motion.div
                                                layoutId="activeHour"
                                                className="absolute inset-x-2 inset-y-1 rounded-xl -z-10"
                                                style={{ backgroundColor: brandColor }}
                                            />
                                        )}
                                        {h}
                                    </button>
                                ))}
                            </div>

                            {/* Minutes Column */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                                <p className="text-[7px] sm:text-[8px] font-black text-center text-zinc-300 uppercase tracking-tighter mb-2">Minuten</p>
                                {minutes.map((m) => (
                                    <button
                                        key={m}
                                        ref={(el) => (minuteRefs.current[m] = el)}
                                        onClick={() => {
                                            setSelectedMinute(m);
                                            handleSelect(selectedHour, m);
                                        }}
                                        className={cn(
                                            "w-full py-2.5 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-black italic transition-all relative flex items-center justify-center translate-x-0 active:scale-90",
                                            selectedMinute === m ? "text-white scale-110" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                        )}
                                    >
                                        {selectedMinute === m && (
                                            <motion.div
                                                layoutId="activeMinute"
                                                className="absolute inset-x-2 inset-y-1 rounded-xl -z-10"
                                                style={{ backgroundColor: brandColor }}
                                            />
                                        )}
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full h-10 rounded-xl text-white font-black italic uppercase search-input-text tracking-widest shadow-xl active:scale-95 transition-all"
                                style={{ backgroundColor: brandColor }}
                            >
                                Fertig
                            </button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }
      `}</style>
        </div>
    );
}
