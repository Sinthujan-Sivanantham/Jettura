import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GoogleIcon, AppleIcon } from "./AuthIcons";

export default function SocialAuthButtons({ onSocialLogin, loading, socialLoading }) {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
                variant="outline"
                onClick={() => onSocialLogin('google')}
                disabled={!!socialLoading || loading}
                className="h-12 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 font-bold text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base rounded-lg w-full flex items-center justify-center gap-2"
            >
                {socialLoading === 'google' ? <Loader2 className="animate-spin w-5 h-5" /> : <><div className="w-5 h-5"><GoogleIcon /></div> <span className="mt-0.5">Google</span></>}
            </Button>
            <Button
                variant="outline"
                onClick={() => onSocialLogin('apple')}
                disabled={!!socialLoading || loading}
                className="h-12 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 font-bold text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base rounded-lg w-full flex items-center justify-center gap-2"
            >
                {socialLoading === 'apple' ? <Loader2 className="animate-spin w-5 h-5" /> : <><div className="w-5 h-5"><AppleIcon /></div> <span className="mt-0.5">Apple</span></>}
            </Button>
        </div>
    );
}
