import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function SubmitButton({ isLoading }) {
    const { t } = useLanguage();
    return (
        <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-white font-black italic uppercase text-xs sm:text-sm md:text-base rounded-2xl shadow-xl active:scale-95 transition-all tracking-widest flex items-center justify-center gap-2 overflow-hidden group relative border-none"
            style={{ backgroundColor: "var(--brand-color)" }}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>{t("aiPlanner.form.optimize")}</span>
                </>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Button>
    );
}
