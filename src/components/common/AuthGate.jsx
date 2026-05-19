"use client";
import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthGate({
    title = "Login Erforderlich",
    description = "Um diese Funktion nutzen zu können, melden Sie sich bitte an.",
    className = ""
}) {
    const { t } = useLanguage();

    return (
        <div className={`flex flex-col items-center justify-center py-10 space-y-6 text-center ${className}`}>
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-2">
                <Lock size={32} className="text-zinc-400" />
            </div>
            <div className="space-y-2 max-w-md">
                <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">
                    {t("auth.loginRequired", title)}
                </h3>
                <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {t("auth.loginDesc", description)}
                </p>
            </div>
            <Link href="/auth">
                <button
                    className="h-12 px-8 rounded-xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: "var(--brand-color)" }}
                >
                    {t("auth.toLogin", "Zum Login")}
                </button>
            </Link>
        </div>
    );
}
