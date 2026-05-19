import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, Loader2 } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export default function ESIMCard({ esim, onBook, isBooking }) {
  const { t } = useLanguage();

  const renderData = () => {
    if (esim.data === "Unlimited" || esim.data === "Unbegrenzt") return t("esimShop.card.unlimited");
    return esim.data;
  };

  const renderDuration = () => {
    const value = esim.duration.split(" ")[0];
    return `${value} ${t("esimShop.card.days")}`;
  };

  return (
    <Card className="overflow-hidden border-none bg-white dark:bg-zinc-900 shadow-xl rounded-[2rem]">
      {/* Header Blau */}
      <div className="bg-[#3b60ff] p-5 flex justify-between items-center text-white">
        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-bold tracking-tight">{esim.country}</span>
        <Wifi size={20} />
      </div>

      <CardContent className="p-8 space-y-4">
        <div className="flex justify-between text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm border-b pb-2 border-zinc-100 dark:border-zinc-800">
          <span className="text-zinc-400">{t("esimShop.card.data")}</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {renderData()}
          </span>
        </div>
        <div className="flex justify-between text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm border-b pb-2 border-zinc-100 dark:border-zinc-800">
          <span className="text-zinc-400 capitalize">{t("esimShop.card.days")}</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {renderDuration()}
          </span>
        </div>
        {/* Preis in Blau-Akzent oder Schwarz */}
        <div className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-3xl md:text-4xl font-black text-center pt-6 text-zinc-900 dark:text-white">
          €{esim.price}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={onBook}
          disabled={isBooking}
          className="w-full bg-[#3b60ff] hover:bg-blue-700 text-white font-bold h-12 rounded-xl border-none flex items-center justify-center gap-2"
        >
          {isBooking ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {t("common.processing") || "Wird gebucht..."}
            </>
          ) : (
            t("esimShop.card.bookNow")
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
