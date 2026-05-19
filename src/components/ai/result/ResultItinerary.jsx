import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function ResultItinerary({ steps }) {
    return (
        <div className="p-10 space-y-10 h-[600px] overflow-y-auto text-left custom-scrollbar">
            <h4 className="font-black text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl flex items-center gap-3 dark:text-white uppercase italic tracking-tighter">
                <Star className="fill-current" size={26} style={{ color: "var(--brand-color)" }} /> Reise-Details
            </h4>
            <div className="space-y-10 border-l-4 ml-4 pl-10" style={{ borderColor: "rgba(var(--brand-color-rgb), 0.1)" }}>
                {steps.map((step, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative">
                        <div className="absolute -left-[54px] top-1 w-7 h-7 rounded-full border-4 border-white dark:border-zinc-900 shadow-md" style={{ backgroundColor: "var(--brand-color)" }} />
                        <div className="space-y-2">
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-black uppercase tracking-widest italic" style={{ color: "var(--brand-color)" }}>TAG {step.day}</span>
                            <p className="font-black text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl dark:text-zinc-100 italic uppercase leading-tight">{step.activity}</p>
                            <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl italic font-medium leading-relaxed">💡 {step.tip}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
