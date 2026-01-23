import { motion } from "framer-motion";

import { useLanguage } from "../../context/LanguageContext";

export default function ESIMHero() {
  const { t } = useLanguage();
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4 pt-10"
    >
      <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white">
        {t("esimShop.hero.title").split("Jettura eSIM")[0]}
        <span style={{ color: "var(--brand-color)" }}>Jettura eSIM</span>
        {t("esimShop.hero.title").split("Jettura eSIM")[1]}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
        {t("esimShop.hero.subtitle")}
      </p>
    </motion.section>
  );
}
