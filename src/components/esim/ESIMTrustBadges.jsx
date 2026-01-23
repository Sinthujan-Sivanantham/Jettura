import { Zap, Globe, ShieldCheck } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function ESIMTrustBadges() {
  const { t } = useLanguage();
  const badges = [
    {
      icon: <Zap />,
      title: t("esimShop.trust.ready.title"),
      desc: t("esimShop.trust.ready.desc"),
      color: "text-yellow-500",
    },
    {
      icon: <Globe />,
      title: t("esimShop.trust.countries.title"),
      desc: t("esimShop.trust.countries.desc"),
      color: "text-blue-500",
    },
    {
      icon: <ShieldCheck />,
      title: t("esimShop.trust.secure.title"),
      desc: t("esimShop.trust.secure.desc"),
      color: "text-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {badges.map((b, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-center space-y-2"
        >
          <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-md">
            <span className={b.color}>{b.icon}</span>
          </div>
          <h4 className="font-bold text-zinc-900 dark:text-white">{b.title}</h4>
          <p className="text-sm text-zinc-500">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
