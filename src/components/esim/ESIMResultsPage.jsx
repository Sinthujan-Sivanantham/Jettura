import React from "react";
import ESIMGrid from "./ESIMGrid";
import { ShieldCheck, ArrowLeft, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function ESIMResultsPage({ searchData, onBack }) {
    const { t } = useLanguage();
    const brandColor = "var(--brand-color)";

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#050505] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* Header Info */}
                <div className="flex flex-col sm:flex-row justify-between items-end mb-10 px-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-left"
                    >
                        <button
                            onClick={onBack}
                            className="group mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-[var(--brand-color)] transition-all active:scale-95 shadow-sm"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">{t("nav.back") || "Zurück"}</span>
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                            Intelligence <span style={{ color: brandColor }}>eSIM</span>
                        </h1>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic mt-3">
                            Verfügbare Pakete für {searchData?.destination || "Ihr Reiseziel"}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-xs font-black uppercase italic"
                        style={{ color: brandColor }}
                    >
                        <ShieldCheck size={16} /> Global Connectivity
                    </motion.div>
                </div>

                <div className="flex flex-col gap-10">
                    {/* RESULTS SECTION */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1"
                    >
                        <ESIMGrid searchTerm={searchData?.destination || ""} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
