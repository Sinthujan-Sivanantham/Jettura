import { format } from "date-fns";
import { de, enGB } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function DatePickerTrigger({
    value, label, placeholder, disabled, error, date, brandColor, shakeKey
}) {
    const { t, language } = useLanguage();
    const currentLocale = language === "de" ? de : enGB;
    const controls = useAnimation();

    useEffect(() => {
        if (error && shakeKey > 0) {
            controls.stop();
            controls.set({ x: 0 });
            controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
        }
    }, [shakeKey, error, controls]);

    return (
        <>
            <label className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 mb-2 ml-1 tracking-[0.2em] italic flex items-center gap-2 leading-none">
                {label || t("search.flight.date")}
            </label>

            <motion.div animate={controls} className="w-full">
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            "h-11 min-[760px]:h-14 w-full flex items-center rounded-2xl border transition-all overflow-hidden text-left relative",
                            "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-zinc-900/20",
                            error
                                ? "border-rose-500 dark:border-rose-500"
                                : "border-zinc-200 dark:border-zinc-800",
                            "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px] pr-4"
                        )}
                    >
                        <CalendarIcon
                            className="absolute left-4 top-1/2 -translate-y-1/2 shrink-0 w-5 h-5 pointer-events-none"
                            style={{ color: error ? "#f43f5e" : brandColor }}
                        />
                        <span className={cn(
                            "truncate text-xs min-[760px]:text-sm min-[1200px]:text-base font-black uppercase italic",
                            !date ? (error ? "text-rose-500" : "text-zinc-400") : "text-zinc-900 dark:text-white"
                        )}>
                            {date ? format(date, "eee, dd. MMM", { locale: currentLocale }) : (error ? t("search.flight.errors.required") : (placeholder || t("search.flight.selectDate")))}
                        </span>
                    </button>
                </PopoverTrigger>
            </motion.div>
        </>
    );
}
