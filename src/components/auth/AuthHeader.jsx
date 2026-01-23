import { useLanguage } from "@/context/LanguageContext";

export default function AuthHeader({ isLogin }) {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
        {t("auth.headerTitlePrefix")} <br />
        <span className="text-[#ff7b1c]">Jettura</span>{t("auth.headerTitleSuffix")}<span className="text-[#ff7b1c]">.</span>
      </h2>
      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-normal">
        {t("auth.headerSubtitle")}
      </p>
    </div>
  );
}