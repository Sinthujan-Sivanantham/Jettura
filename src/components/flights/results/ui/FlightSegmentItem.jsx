import React from "react";
import { Plane, Calendar, Zap, Clock, ShieldAlert } from "lucide-react";
import WeatherBadge from "@/components/flights/ui/WeatherBadge";
import { getLocationName, getLocationWithCountry, formatFlightTime, formatFlightDate } from "@/utils/flightUtils";
import FlightLayoverInfo from "./FlightLayoverInfo";

export default function FlightSegmentItem({
    segment,
    nextSegment,
    itineraryIndex,
    pricingIndex,
    flight,
    dictionaries,
    t,
    language,
    brandColor,
    calculateWait
}) {
    const cabinClass = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[pricingIndex]?.cabin || "ECONOMY";

    const depTime = formatFlightTime(segment.departure.at, language);
    const arrTime = formatFlightTime(segment.arrival.at, language);
    const depDate = formatFlightDate(segment.departure.at, language);
    const arrDate = formatFlightDate(segment.arrival.at, language);


    const depLoc = getLocationWithCountry(segment.departure.iataCode, dictionaries, language);
    const arrLoc = getLocationWithCountry(segment.arrival.iataCode, dictionaries, language);

    return (
        <div className="mb-8 last:mb-0">
            <div className="relative flex gap-6">
                {/* Timeline Visual */}
                <div className="flex flex-col items-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full z-10" style={{ backgroundColor: brandColor, boxShadow: `0 0 8px color-mix(in srgb, ${brandColor} 40%, transparent)` }} />
                    <div className="w-[1.5px] h-44 bg-zinc-100 dark:bg-zinc-800 my-0.5 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 shadow-sm">
                            <Plane size={10} style={{ color: brandColor }} className={`${itineraryIndex === 1 ? 'rotate-180' : 'rotate-5'}`} />
                        </div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full border-2 bg-white dark:bg-zinc-900 z-10" style={{ borderColor: brandColor }} />
                </div>

                <div className="flex-1 text-left">

                    {/* DEPARTURE */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-black text-zinc-400 uppercase italic tracking-widest">{t("search.flight.details.departure") || "Departure"}</p>
                            <WeatherBadge cityCode={segment.departure.iataCode} />
                        </div>

                        <div className="flex flex-col mb-1">
                            <span className="text-[10px] md:text-xs lg:text-sm xl:text-base font-black text-zinc-400 flex items-center gap-1 mb-0.5">
                                <Calendar size={12} /> {depDate}
                            </span>
                            <p className="text-lg md:text-xl lg:text-3xl xl:text-4xl font-black italic uppercase leading-none tracking-tight">
                                {depTime} {t("search.flight.details.timeSuffix") || "Uhr"}
                            </p>
                        </div>
                        <p className="text-[10px] md:text-xs lg:text-base xl:text-lg font-bold uppercase tracking-tight" style={{ color: brandColor }}>
                            {depLoc} <span className="opacity-40 ml-1">{t("search.flight.details.terminal") || "Terminal"} {segment.departure.terminal || '—'}</span>
                        </p>
                    </div>

                    {/* FLIGHT INFO */}
                    <div className="flex gap-2 mb-5">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg">
                            <Zap size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-[9px] md:text-xs lg:text-sm xl:text-base font-black italic text-zinc-500 uppercase">{t(`search.flight.details.cabins.${cabinClass}`) || cabinClass}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg">
                            <Clock size={12} style={{ color: brandColor }} />
                            <span className="text-[9px] md:text-xs lg:text-sm xl:text-base font-black italic text-zinc-500 uppercase">{segment.duration.replace('PT', '').toLowerCase()}</span>
                        </div>
                    </div>

                    {/* ARRIVAL */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-[8px] md:text-[10px] lg:text-xs xl:text-sm font-black text-zinc-400 uppercase italic tracking-widest">{t("search.flight.details.arrival") || "Arrival"}</p>
                            <WeatherBadge cityCode={segment.arrival.iataCode} />
                        </div>

                        <div className="flex flex-col mb-1">
                            <span className="text-[10px] md:text-xs lg:text-sm xl:text-base font-black text-zinc-400 flex items-center gap-1 mb-0.5">
                                <Calendar size={12} /> {arrDate}
                            </span>
                            <p className="text-lg md:text-xl lg:text-3xl xl:text-4xl font-black italic uppercase leading-none tracking-tight">
                                {arrTime} {t("search.flight.details.timeSuffix") || "Uhr"}
                            </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] md:text-xs lg:text-base xl:text-lg font-bold uppercase" style={{ color: brandColor }}>
                                {arrLoc}
                            </p>
                            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/30">
                                <ShieldAlert size={10} className="text-amber-600 dark:text-amber-500" />
                                <span className="text-[8px] font-black uppercase text-amber-700 dark:text-amber-500 italic">{t("search.flight.details.visaCheck") || "Visa-Check"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {nextSegment && (
                <FlightLayoverInfo
                    waitDuration={calculateWait(segment.arrival.at, nextSegment.departure.at).text}
                    nextCityCode={segment.arrival.iataCode}
                    dictionaries={dictionaries}
                    t={t}
                    language={language}
                    brandColor={brandColor}
                />
            )}
        </div>
    );
}
