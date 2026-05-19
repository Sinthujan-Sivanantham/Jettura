"use client";
import Link from "next/link";
import { Plane, Instagram, Twitter, Facebook, Globe, ShieldCheck, CreditCard } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CookieSettingsButton } from "@/components/common/CookieBanner";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 mt-auto">
      <style>{`
        .hover-brand:hover { color: var(--brand-color) !important; }
      `}</style>
      <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full max-w-[1440px]">
        <div className="grid grid-cols-2 min-[760px]:grid-cols-4 gap-8 sm:gap-10 md:gap-12">

          {/* BRANDING */}
          <div className="space-y-3 sm:space-y-4 col-span-2 min-[760px]:col-span-1">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 rounded-xl" style={{ backgroundColor: "var(--brand-color)" }}>
                <Plane className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="fluid-h3 font-black tracking-tighter italic" style={{ color: "var(--brand-color)" }}>
                JETTURA
              </span>
            </Link>
            <p className="fluid-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-medium italic">
              {t("footer.about")}
            </p>
            <div className="flex gap-3 sm:gap-4 pt-2">
              <Instagram size={20} className="sm:w-[22px] sm:h-[22px] text-slate-400 hover-brand cursor-pointer transition-colors" />
              <Twitter size={20} className="sm:w-[22px] sm:h-[22px] text-slate-400 hover-brand cursor-pointer transition-colors" />
              <Facebook size={20} className="sm:w-[22px] sm:h-[22px] text-slate-400 hover-brand cursor-pointer transition-colors" />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-span-1">
            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base font-black uppercase tracking-widest mb-4 sm:mb-6 italic" style={{ color: "var(--brand-color)" }}>{t("footer.navTitle")}</h3>
            <ul className="space-y-3 sm:space-y-4 fluid-xs font-bold uppercase italic">
              <li><Link href="/" className="text-slate-500 dark:text-slate-400 hover-brand transition">{t("nav.flights")}</Link></li>
              <li><Link href="/blog" className="text-slate-500 dark:text-slate-400 hover-brand transition">{t("nav.blog")}</Link></li>
              <li><Link href="/ai-planner" className="text-slate-500 dark:text-slate-400 hover-brand transition">{t("nav.planner")}</Link></li>
              <li><Link href="/esim" className="text-slate-500 dark:text-slate-400 hover-brand transition">{t("nav.esim")}</Link></li>
            </ul>
          </div>

          {/* SERVICES */}
          <div className="col-span-1">
            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base font-black uppercase tracking-widest mb-4 sm:mb-6 italic" style={{ color: "var(--brand-color)" }}>{t("footer.partnerTitle")}</h3>
            <ul className="space-y-3 sm:space-y-4 fluid-xs font-bold uppercase italic">
              <li className="text-slate-500 dark:text-slate-400">{t("footer.links.cars")}</li>
              <li className="text-slate-500 dark:text-slate-400">{t("footer.links.insurance")}</li>
              <li className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs pt-2 italic text-slate-400 font-black tracking-widest uppercase">
                {t("footer.poweredBy")}
              </li>
            </ul>
          </div>

          {/* TRUST */}
          <div className="space-y-3 sm:space-y-4 col-span-2 min-[760px]:col-span-1">
            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base font-black uppercase tracking-widest mb-4 sm:mb-6 italic" style={{ color: "var(--brand-color)" }}>{t("footer.securityTitle")}</h3>
            <div className="flex items-center gap-2 sm:gap-3 fluid-xs font-black uppercase italic text-slate-500 dark:text-slate-400">
              <ShieldCheck size={18} className="sm:w-5 sm:h-5 text-green-500" />
              <span>{t("footer.security.ssl")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 fluid-xs font-black uppercase italic text-slate-500 dark:text-slate-400">
              <CreditCard size={18} className="sm:w-5 sm:h-5" style={{ color: "var(--brand-color)" }} />
              <span>{t("footer.security.payment")}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 fluid-xs font-black uppercase italic text-slate-500 dark:text-slate-400">
              <Globe size={18} className="sm:w-5 sm:h-5 text-purple-500" />
              <span>{t("footer.security.support")}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-100 dark:border-slate-800 mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs md:text-sm text-slate-400 uppercase tracking-tight font-black italic text-center md:text-left">
          <p>{t("footer.copyright")}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 sm:gap-6 md:gap-8 items-center justify-center">
            <Link href="/impressum" className="hover-brand cursor-pointer transition-colors">{t("footer.impressum")}</Link>
            <Link href="/datenschutz" className="hover-brand cursor-pointer transition-colors">{t("footer.privacy")}</Link>
            <Link href="/agb" className="hover-brand cursor-pointer transition-colors">{t("footer.terms")}</Link>
            <CookieSettingsButton 
              label="Cookie-Einstellungen" 
              className="hover-brand cursor-pointer transition-colors flex items-center gap-1 font-black uppercase italic" 
            />
          </div>
        </div>
      </div>

      {/* AFFILIATE DISCLAIMER */}
      <div className="bg-slate-900 dark:bg-zinc-950 text-white py-3 sm:py-4 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-black italic text-center uppercase tracking-[0.15em] sm:tracking-[0.2em] px-4">
        {t("footer.disclaimer")}
      </div>
    </footer>
  );
}