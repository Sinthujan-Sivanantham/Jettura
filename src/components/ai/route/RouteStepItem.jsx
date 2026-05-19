import React from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RouteStepItem({ step, i, selectedId, onSelect, searchId }) {
    const { t } = useLanguage();
    const query = step.img_query || step.activity || "travel";
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(query)}?width=300&height=200&seed=${searchId + i}&model=flux&nologo=true`;

    const isSelected = selectedId === step.id;

    return (
        <motion.div
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
            onClick={() => onSelect(step)}
            className={`cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 relative mb-3 ${isSelected
                ? "border-[var(--brand-color)] bg-white/20 dark:bg-white/10 shadow-lg backdrop-blur-xl"
                : "border-transparent bg-white/10 dark:bg-zinc-900/10 hover:bg-white/20 dark:hover:bg-zinc-900/20 backdrop-blur-md"
                }`}
        >
            <div className="h-28 sm:h-32 relative overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                <img 
                    src={imageUrl} 
                    className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-700" 
                    alt="" 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=600'; }}
                />
                <div className="absolute top-2 left-2 bg-[var(--brand-color)] px-2 py-0.5 rounded-lg text-[7px] sm:text-[8px] font-black text-white uppercase italic tracking-wider shadow-sm">
                    {t("aiPlanner.results.day")} {step.day}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-2 left-3 font-black text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] text-white truncate uppercase italic tracking-tight drop-shadow-md pr-2">
                    {step.activity}
                </p>
            </div>

            <div className="p-3 space-y-1.5 active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-1.5 text-[7px] sm:text-[8px] sm:text-[9px] text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-wide truncate opacity-80">
                    <MapPin size={10} className="shrink-0 text-[var(--brand-color)]" />
                    <span className="truncate">{step.address}</span>
                </div>

                <div className="flex justify-between items-center text-[7px] sm:text-[8px] font-black text-zinc-500 dark:text-zinc-400 uppercase pt-2 border-t border-white/10 dark:border-white/5 mt-1">
                    <span className="flex items-center gap-1 bg-white/30 dark:bg-black/30 px-1.5 py-0.5 rounded-md">
                        <Clock size={9} /> {step.duration}
                    </span>
                    <span className="text-[var(--brand-color)] italic bg-[var(--brand-color)]/10 px-1.5 py-0.5 rounded-md">
                        {step.distance_km} km
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
