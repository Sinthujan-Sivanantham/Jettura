import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, AtSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterFields({ register, errors }) {
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    return (
        <div className="space-y-4">
            {/* NAME & USERNAME */}
            <div className="space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic ml-1 flex items-center gap-2">
                        <User size={10} className="md:w-2.5 md:h-2.5" style={{ color: "var(--brand-color)" }} /> {t("auth.fullNameLabel")}
                    </Label>
                    <Input {...register("fullName")} placeholder="Max Mustermann" className="h-10 md:h-12 text-xs md:text-sm font-bold rounded-xl md:rounded-2xl border-zinc-100 dark:border-zinc-800 focus-visible:ring-2" style={{ "--tw-ring-color": "var(--brand-color)" }} />
                    {errors.fullName && <p className="text-[8px] font-bold text-red-500 uppercase ml-1">{t(`auth.errors.${errors.fullName.message}`)}</p>}
                </div>

                <div className="space-y-1.5 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic ml-1 flex items-center gap-2">
                        <AtSign size={10} className="md:w-2.5 md:h-2.5" style={{ color: "var(--brand-color)" }} /> {t("auth.usernameLabel")}
                    </Label>
                    <Input {...register("username")} placeholder="max_traveler" className="h-10 md:h-12 text-xs md:text-sm font-bold rounded-xl md:rounded-2xl border-zinc-100 dark:border-zinc-800 focus-visible:ring-2" style={{ "--tw-ring-color": "var(--brand-color)" }} />
                    {errors.username && <p className="text-[8px] font-bold text-red-500 uppercase ml-1">{t(`auth.errors.${errors.username.message}`)}</p>}
                </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5 md:space-y-2">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic ml-1 flex items-center gap-2">
                    <Mail size={10} className="md:w-2.5 md:h-2.5" style={{ color: "var(--brand-color)" }} /> {t("auth.emailLabel")}
                </Label>
                <Input {...register("email")} type="email" placeholder="name@jettura.com" className="h-10 md:h-12 text-xs md:text-sm font-bold rounded-xl md:rounded-2xl border-zinc-100 dark:border-zinc-800 focus-visible:ring-2" style={{ "--tw-ring-color": "var(--brand-color)" }} />
                {errors.email && <p className="text-[8px] font-bold text-red-500 uppercase ml-1">{t(`auth.errors.${errors.email.message}`)}</p>}
            </div>

            {/* PASSWORDS */}
            <div className="space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic ml-1 flex items-center gap-2">
                        <Lock size={10} className="md:w-2.5 md:h-2.5" style={{ color: "var(--brand-color)" }} /> {t("auth.secretPassword")}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-10 md:h-12 text-xs md:text-sm font-bold rounded-xl md:rounded-2xl border-zinc-100 dark:border-zinc-800 focus-visible:ring-2 pr-10"
                            style={{ "--tw-ring-color": "var(--brand-color)" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-[8px] font-bold text-red-500 uppercase ml-1">{t(`auth.errors.${errors.password.message}`)}</p>}
                </div>

                <div className="space-y-1.5 md:space-y-2">
                    <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic ml-1 flex items-center gap-2">
                        <Lock size={10} className="md:w-2.5 md:h-2.5" style={{ color: "var(--brand-color)" }} /> {t("auth.repeatPasswordLabel")}
                    </Label>
                    <div className="relative">
                        <Input
                            {...register("repeatPassword")}
                            type={showRepeatPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-10 md:h-12 text-xs md:text-sm font-bold rounded-xl md:rounded-2xl border-zinc-100 dark:border-zinc-800 focus-visible:ring-2 pr-10"
                            style={{ "--tw-ring-color": "var(--brand-color)" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            {showRepeatPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.repeatPassword && <p className="text-[8px] font-bold text-red-500 uppercase ml-1">{t(`auth.errors.${errors.repeatPassword.message}`)}</p>}
                </div>
            </div>
        </div>
    );
}
