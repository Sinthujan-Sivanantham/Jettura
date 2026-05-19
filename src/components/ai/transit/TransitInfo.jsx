import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock, Lightbulb, Navigation } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TransitInfo({ step, originStep }) {
    const { t } = useLanguage();
    return (
        <div className="p-6 lg:p-8 space-y-6 flex flex-col justify-center">

            <div className="flex gap-4 items-center bg-zinc-50/50 dark:bg-white/5 p-3 rounded-2xl">
                <div className="w-1.5 h-10 bg-[var(--brand-color)] rounded-full shadow-[0_0_15px_var(--brand-color)]" />
                <div className="flex flex-col">
                    <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t("aiPlanner.results.routeFrom")}</span>
                    <span className="text-[15px] font-bold text-zinc-800 dark:text-white truncate max-w-[220px]">
                        {originStep?.activity || originStep?.address || t("aiPlanner.results.currentLocation")}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-3xl border border-white/20 dark:border-white/5 shadow-sm">
                    <span className="text-[7px] sm:text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase block mb-1.5 tracking-wider">{t("aiPlanner.results.duration")}</span>
                    <div className="font-black dark:text-white text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base italic flex items-center gap-2">
                        <Clock size={16} className="text-[var(--brand-color)]" /> {step.duration}
                    </div>
                </div>
                <div className="bg-white/50 dark:bg-black/20 p-4 rounded-3xl border border-white/20 dark:border-white/5 shadow-sm">
                    <span className="text-[7px] sm:text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase block mb-1.5 tracking-wider">{t("aiPlanner.results.distance")}</span>
                    <div className="font-black dark:text-white text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base italic flex items-center gap-2">
                        <Navigation size={16} className="text-[var(--brand-color)]" /> {step.distance_km} km
                    </div>
                </div>
            </div>

            <div className="bg-[var(--brand-color)]/10 dark:bg-[var(--brand-color)]/5 p-4 rounded-2xl border border-[var(--brand-color)]/20 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] italic text-zinc-700 dark:text-zinc-300 flex gap-3 items-start">
                <Lightbulb className="text-[var(--brand-color)] shrink-0" size={16} />
                <p className="leading-relaxed">"{step.tip}"</p>
            </div>

            <Button
                className="w-full h-14 bg-[var(--brand-color)] hover:brightness-110 text-white font-black rounded-2xl text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs uppercase shadow-xl shadow-[var(--brand-color)]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 tracking-widest"
                onClick={() => {
                    const origin = originStep?.lat && originStep?.lng
                        ? `${originStep.lat},${originStep.lng}`
                        : '';
                    const destination = `${step.lat},${step.lng}`;

                    const url = origin
                        ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`
                        : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

                    window.open(url, '_blank');
                }}
            >
                {t("aiPlanner.results.navigation")} <ArrowUpRight size={18} strokeWidth={3} />
            </Button>
        </div>
    );
}
