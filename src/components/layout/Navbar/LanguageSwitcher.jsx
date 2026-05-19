import { useLanguage } from "../../../context/LanguageContext";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
    const { language, switchLanguage } = useLanguage();

    const toggleLanguage = () => {
        switchLanguage(language === "de" ? "en" : "de");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="h-9 w-9 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-95"
            title={language === "de" ? "Switch to English" : "Auf Deutsch umstellen"}
        >
            {language === "de" ? (
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg leading-none" role="img" aria-label="Deutsch">🇩🇪</span>
            ) : (
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg leading-none" role="img" aria-label="English">🇬🇧</span>
            )}
        </Button>
    );
}
