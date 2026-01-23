import React from "react";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FlightResultsEmptyState() {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/20"
        >
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400">
                <SearchX size={32} />
            </div>
            <p className="text-sm font-black uppercase italic text-zinc-400 tracking-widest">
                {t("results.noResults") || "Keine Flüge gefunden."}
            </p>
        </motion.div>
    );
}
