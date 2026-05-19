import React from "react";
import { Sparkles, Info, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function AIAdvisorPanel({ plannedRoute }) {
    const { t } = useLanguage();

    if (!plannedRoute || (!plannedRoute.summary && !plannedRoute.general_advice)) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-rose-500/10 backdrop-blur-xl rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/50 p-6 md:p-8 space-y-6 overflow-hidden relative"
        >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                    <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm md:text-base font-black uppercase italic tracking-widest text-zinc-900 dark:text-white">
                    {t("aiPlanner.advisor.title")}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Trip Summary */}
                {plannedRoute.summary && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Info size={16} />
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                {t("aiPlanner.advisor.summary")}
                            </span>
                        </div>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                            {plannedRoute.summary}
                        </p>
                    </div>
                )}

                {/* General Advice */}
                {plannedRoute.general_advice && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                            <Lightbulb size={16} />
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                                {t("aiPlanner.advisor.advice")}
                            </span>
                        </div>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                            {plannedRoute.general_advice}
                        </p>
                    </div>
                )}
            </div>

            {/* AI Badge */}
            <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] text-zinc-400 uppercase font-bold tracking-tighter italic">
                    {t("aiPlanner.advisor.generatedBy")}
                </span>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse delay-75" />
                    <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse delay-150" />
                </div>
            </div>
        </motion.div>
    );
}
