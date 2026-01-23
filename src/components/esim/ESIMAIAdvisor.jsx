import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ESIMAIAdvisor() {
  const { t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentTip, setCurrentTip] = useState(t("esimShop.aiAdvisor.tip"));

  const handleAskAI = async () => {
    setIsAnalyzing(true);
    // Simuliere KI Analyse
    await new Promise(resolve => setTimeout(resolve, 1500));

    const tips = [
      "AI Tip: Based on your recent searches, we recommend a 30-day Regional Europe plan.",
      "AI Tip: For your upcoming trip to Japan, the 'Japan Unlimited' package is the best value.",
      "AI Tip: You usually use 1GB/day. A 10GB plan for 7 days would be perfect for your Turkey trip.",
      "AI Tip: Global plans are currently 20% off! Ideal for your multi-destination route."
    ];

    // Einfache Rotation oder Zufall (hier Zufall)
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl border border-zinc-100 dark:border-zinc-800">
      <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30">
        <Sparkles size={32} />
      </div>
      <div className="flex-1 text-center md:text-left space-y-1">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {t("esimShop.aiAdvisor.title")}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400">{t("esimShop.aiAdvisor.subtitle")}</p>
        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium pt-1">
          {currentTip}
        </p>
      </div>
      <Button
        onClick={handleAskAI}
        disabled={isAnalyzing}
        className="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-black text-white px-8 h-12 rounded-xl font-bold flex items-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            {t("common.analyzing") || "Analysiere..."}
          </>
        ) : (
          t("esimShop.aiAdvisor.button")
        )}
      </Button>
    </div>
  );
}
