import { useLanguage } from "../../../context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ variant = "icon" }) {
    const { language, switchLanguage } = useLanguage();

    const toggleLanguage = () => {
        switchLanguage(language === "de" ? "en" : "de");
    };

    if (variant === "menuItem") {
        return (
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-3 py-2 w-full text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl group"
            >
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-zinc-100 dark:border-zinc-800 flex-shrink-0 group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors">
                    <Globe size={18} className="text-zinc-500 group-hover:text-[var(--brand-color)] transition-colors" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-tight leading-none text-zinc-900 dark:text-zinc-100">
                        {language === "de" ? "Sprache" : "Language"}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-500 group-hover:text-[var(--brand-color)] uppercase tracking-widest mt-1 transition-colors">
                        {language === "de" ? "🇩🇪 Deutsch (Ändern)" : "🇬🇧 English (Change)"}
                    </span>
                </div>
            </button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-9 px-3 w-auto flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-95 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title={language === "de" ? "Switch to English" : "Auf Deutsch umstellen"}
        >
            <Globe size={16} className="text-zinc-500" />
            <span className="font-black uppercase tracking-widest text-[10px] text-zinc-700 dark:text-zinc-300">
                {language === "de" ? "DE" : "EN"}
            </span>
        </Button>
    );
}
