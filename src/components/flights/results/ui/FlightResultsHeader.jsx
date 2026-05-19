import React from "react";
import { ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function FlightResultsHeader({ count, onBack }) {
    const { t } = useLanguage();

    return (
        <div className="w-full mb-16 px-4">
            {/* Top Navigation Row */}
            <div className="flex flex-row justify-between items-center mb-8 sm:mb-10 gap-2">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95 shadow-sm hover:shadow-md backdrop-blur-xl"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] italic">{t("nav.back") || "Zurück"}</span>
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[var(--brand-color)]/10 border border-[var(--brand-color)]/20 text-[7px] sm:text-[8px] sm:text-[11px] font-black uppercase italic tracking-[0.1em] sm:tracking-widest"
                    style={{ color: "var(--brand-color)" }}
                >
                    <ShieldCheck size={12} fill="currentColor" className="opacity-20" />
                    <Sparkles size={10} className="animate-pulse" />
                    <span className="whitespace-nowrap">{t("search.flight.active") || "GDS Synchronized"}</span>
                </motion.div>
            </div>

            {/* Centered Heading Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex flex-col items-center">
                    <h1 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-3xl md:text-4xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-[0.9] mb-4">
                        {t("results.title") || "Suchergebnisse"}
                    </h1>
                    <div className="h-1.5 w-24 bg-[var(--brand-color)] rounded-full mb-6 opacity-30 blur-[1px]" />
                </div>

                <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-8 sm:w-16 bg-zinc-200 dark:bg-zinc-800" />
                    <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] italic">
                        {count} {t("results.found") || "Verbindungen gefunden"}
                    </p>
                    <div className="h-[1px] w-8 sm:w-16 bg-zinc-200 dark:bg-zinc-800" />
                </div>
            </motion.div>
        </div>
    );
}
