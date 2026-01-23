import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthDivider() {
    const { t } = useLanguage();

    return (
        <div className="relative py-2 mb-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-zinc-700" /></div>
            <div className="relative flex justify-center text-sm text-slate-500 font-medium">
                <span className="bg-white dark:bg-zinc-950 px-4">oder</span>
            </div>
        </div>
    );
}
