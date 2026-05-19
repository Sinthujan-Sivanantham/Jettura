import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterSuccess() {
    const { t } = useLanguage();

    return (
        <div className="text-center py-10 space-y-6">
            <div className="flex justify-center">
                <CheckCircle2 className="w-20 h-20 animate-pulse" style={{ color: "var(--brand-color)" }} />
            </div>
            <div className="space-y-2">
                <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic uppercase tracking-tighter dark:text-white">{t("auth.checkEmails")}</h3>
                <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose">
                    {t("auth.activationSent")}
                </p>
            </div>
        </div>
    );
}
