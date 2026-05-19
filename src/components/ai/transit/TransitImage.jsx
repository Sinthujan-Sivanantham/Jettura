import React from "react";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TransitImage({ step, searchId }) {
    const { t } = useLanguage();
    const mainImg = `https://pollinations.ai/p/${encodeURIComponent(step.img_query || "landscape")}?width=800&height=400&seed=${searchId + step.id}&model=flux&nologo=true`;

    return (
        <div className="h-48 md:h-64 relative bg-zinc-200/50 dark:bg-zinc-800/50">
            <img src={mainImg} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 bg-[var(--brand-color)] px-3 py-1 rounded-full text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                {t("aiPlanner.results.nextStop")}
            </div>
            <div className="absolute bottom-5 left-6 right-6">
                <h3 className="text-white text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black uppercase italic tracking-tighter leading-none mb-1 drop-shadow-md">
                    {step.activity}
                </h3>
                <p className="text-white/70 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-medium uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin size={12} className="text-[var(--brand-color)]" /> {step.address}
                </p>
            </div>
        </div>
    );
}
