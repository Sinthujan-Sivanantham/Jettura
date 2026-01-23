import React from "react";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SearchErrorAlert({ errors, shakeKey }) {
    const { t } = useLanguage();

    const hasRealErrors = (errs) => {
        return Object.values(errs).some(value => {
            if (value === true) return true;
            if (Array.isArray(value)) return value.some(hasRealErrors);
            if (typeof value === "object" && value !== null) return hasRealErrors(value);
            return false;
        });
    };

    if (!hasRealErrors(errors)) return null;

    return (
        <div key={shakeKey} className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-xs sm:text-sm font-black uppercase italic tracking-widest">
                {t("search.flight.errors.fillAll")}
            </span>
        </div>
    );
}
