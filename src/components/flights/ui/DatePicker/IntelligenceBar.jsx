import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function IntelligenceBar({ isSyncing, brandColor, onConfirm }) {
    const { t } = useLanguage();
    return (
        <div className="p-3 lg:p-5 bg-zinc-50 dark:bg-zinc-950 border-t dark:border-zinc-900 flex justify-between items-center px-4 lg:px-10">
            <div className="flex items-center gap-1.5 italic">
                <Sparkles size={14} className={cn(isSyncing && "animate-pulse")} style={{ color: brandColor, fill: brandColor }} />
                <span className="search-label-text font-black uppercase tracking-widest italic opacity-80" style={{ color: brandColor }}>
                    {isSyncing ? t("search.flight.syncing") : t("search.flight.active")}
                </span>
            </div>
            <button
                onClick={onConfirm}
                className="text-white font-black italic uppercase search-input-text rounded-lg lg:rounded-xl px-6 lg:px-12 py-2 lg:py-3.5 shadow-lg active:scale-95 transition-all"
                style={{ backgroundColor: brandColor }}
            >
                {t("search.flight.confirm")}
            </button>
        </div>
    );
}
