import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, CheckCircle2, Info } from "lucide-react";
import { Button } from "./button";
import { useLanguage } from "@/context/LanguageContext";

export default function StatusPopup({
    isOpen,
    onClose,
    title,
    message,
    type = "error"
}) {
    const { t } = useLanguage();
    const defaultTitle = t("profile.post.alertTitle") || "Intelligence Hinweis";
    const displayTitle = title || defaultTitle;
    const colors = {
        error: {
            bg: "bg-rose-50 dark:bg-rose-950/20",
            border: "border-rose-200 dark:border-rose-900/50",
            icon: "text-rose-500",
            brand: "var(--brand-color)"
        },
        success: {
            bg: "bg-emerald-50 dark:bg-emerald-950/20",
            border: "border-emerald-200 dark:border-emerald-900/50",
            icon: "text-emerald-500",
            brand: "var(--brand-color)"
        },
        info: {
            bg: "bg-blue-50 dark:bg-blue-950/20",
            border: "border-blue-200 dark:border-blue-900/50",
            icon: "text-blue-500",
            brand: "var(--brand-color)"
        }
    };

    const config = colors[type] || colors.error;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full max-w-md overflow-hidden rounded-[2.5rem] border ${config.border} ${config.bg} p-8 shadow-2xl backdrop-blur-xl`}
                    >
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className={`p-4 rounded-[1.5rem] bg-white dark:bg-zinc-900 shadow-xl ${config.icon}`}>
                                {type === "error" && <AlertCircle size={40} strokeWidth={2.5} />}
                                {type === "success" && <CheckCircle2 size={40} strokeWidth={2.5} />}
                                {type === "info" && <Info size={40} strokeWidth={2.5} />}
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase italic tracking-tighter dark:text-white">
                                    {displayTitle}
                                </h3>
                                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest italic leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <Button
                                onClick={onClose}
                                className="w-full h-14 text-white font-black italic uppercase text-xs sm:text-sm tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
                                style={{ backgroundColor: "var(--brand-color)" }}
                            >
                                {t("common.understood") || "Verstanden"}
                            </Button>
                        </div>

                        {/* Decorative element */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 dark:bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 dark:bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
