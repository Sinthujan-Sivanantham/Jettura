import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginFields({ register, errors }) {
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-4">
            <div className="space-y-1 md:space-y-1.5">
                <Label htmlFor="email" className="text-[7px] sm:text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">{t("auth.emailLabel")}</Label>
                <Input
                    id="email" {...register("email")} type="email" placeholder="name@jettura.com"
                    className="h-10 md:h-12 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs md:text-sm font-bold rounded-xl md:rounded-2xl border-zinc-100 dark:border-zinc-800 focus-visible:ring-2"
                    style={{ "--tw-ring-color": "var(--brand-color)" }}
                />
                {errors.email && <p className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold text-red-500 uppercase">{t(`auth.errors.${errors.email.message}`)}</p>}
            </div>

            <div className="space-y-1 md:space-y-1.5">
                <Label htmlFor="password" id="pass-label" className="text-[7px] sm:text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">{t("auth.passwordLabel")}</Label>
                <div className="relative">
                    <Input
                        id="password" {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••"
                        className="h-10 md:h-12 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs md:text-sm font-bold rounded-xl md:rounded-2xl border-zinc-100 dark:border-zinc-800 focus-visible:ring-2 pr-10"
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
                {errors.password && <p className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold text-red-500 uppercase">{t(`auth.errors.${errors.password.message}`)}</p>}
            </div>
        </div>
    );
}
