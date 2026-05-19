import React from "react";
import { Clock, FileText, Coffee } from "lucide-react";
import WeatherBadge from "@/components/flights/ui/WeatherBadge";
import { getLocationName } from "@/utils/flightUtils";

export default function FlightLayoverInfo({
    waitDuration,
    nextCityCode,
    dictionaries,
    t,
    language,
    brandColor
}) {
    const nextCityName = getLocationName(nextCityCode, dictionaries, language);

    return (
        <div className="ml-8 mt-6 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border dark:border-zinc-800 space-y-4 shadow-inner">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border dark:border-zinc-700" style={{ color: brandColor }}>
                        <Clock size={14} />
                    </div>
                    <div>
                        <p className="text-[7px] sm:text-[8px] font-black uppercase italic leading-none mb-1 tracking-widest" style={{ color: brandColor }}>{t("search.flight.details.wait") || "Wait"}</p>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-black uppercase italic leading-none tracking-tight">
                            {waitDuration} {t("search.flight.details.layover") || "Layover"}
                        </p>
                    </div>
                </div>
                <WeatherBadge cityCode={nextCityCode} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t dark:border-zinc-800">
                <div className="flex gap-2 items-start p-2 rounded-xl border text-zinc-500 dark:text-zinc-400"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${brandColor} 5%, transparent)`,
                        borderColor: `color-mix(in srgb, ${brandColor} 10%, transparent)`
                    }}>
                    <FileText size={12} style={{ color: brandColor }} className="shrink-0 mt-0.5" />
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase italic leading-tight">
                        {t("search.flight.details.baggageCheck") || "Check baggage in"} <span style={{ color: brandColor }}>{nextCityName}</span> {t("search.flight.details.baggageCheckSuffix") || "?"}
                    </p>
                </div>
                <div className="flex gap-2 items-start bg-zinc-100/50 dark:bg-zinc-800/40 p-2 rounded-xl border dark:border-zinc-700/50 text-zinc-500 dark:text-zinc-400">
                    <Coffee size={12} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[7px] sm:text-[8px] font-bold uppercase italic leading-tight">
                        {t("search.flight.details.gastronomy") || "Short stay - grab a coffee."}
                    </p>
                </div>
            </div>
        </div>
    );
}
