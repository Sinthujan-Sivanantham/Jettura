import { motion } from "framer-motion";
import { format, isSameMonth, addMonths } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function FlexibleView({ date, handleDateSelect, brandColor, minDate }) {
    const months = Array.from({ length: 12 }, (_, i) => {
        const d = addMonths(minDate || new Date(), i);
        return {
            name: format(d, "MMMM", { locale: de }),
            shortName: format(d, "MMM", { locale: de }).replace(".", ""), // Remove dot from "Jan." -> "JAN"
            year: d.getFullYear(),
            date: d
        };
    });

    return (
        <motion.div key="flex" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {months.map((m, idx) => {
                const isSelected = date && isSameMonth(date, m.date);
                return (
                    <button
                        key={idx}
                        onClick={() => handleDateSelect(m.date)}
                        className={cn(
                            "flex flex-col items-center justify-center aspect-square rounded-full border transition-all group p-1",
                            isSelected
                                ? "text-white shadow-xl scale-105 border-transparent"
                                : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95"
                        )}
                        style={isSelected ? { backgroundColor: brandColor } : {}}
                    >
                        <span className={cn(
                            "text-[10px] sm:text-xs lg:text-base font-black uppercase italic tracking-tighter text-center break-words w-full px-1"
                        )}
                            style={!isSelected ? { color: brandColor, opacity: 0.8 } : { color: "white" }}
                        >
                            <span className="lg:hidden">{m.shortName}</span>
                            <span className="hidden lg:inline">{m.name}</span>
                        </span>
                        <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold opacity-40 mt-0.5">{m.year}</span>
                    </button>
                );
            })}
        </motion.div>
    );
}
