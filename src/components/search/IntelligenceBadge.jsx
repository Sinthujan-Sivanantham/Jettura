import React from "react";
import { Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function IntelligenceBadge() {
    const { t } = useLanguage();

    return (
        <div
            className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 sm:py-2.5 rounded-full shadow-inner border animate-pulse border-none lg:border-solid lg:border-white/10"
            style={{
                backgroundColor: "rgba(var(--brand-color-rgb), 0.12)",
                borderColor: "rgba(var(--brand-color-rgb), 0.25)"
            }}
        >
            <Zap size={10} className="sm:w-[14px] sm:h-[14px]" style={{ color: "var(--brand-color)", fill: "var(--brand-color)" }} />
            <span className="text-[7px] sm:text-[8px] sm:text-[10px] md:text-[11px] font-black italic uppercase tracking-widest whitespace-nowrap" style={{ color: "var(--brand-color)" }}>
                {t("search.intelligenceActive", "Intelligence Engine Aktiv")}
            </span>
        </div>
    );
}
