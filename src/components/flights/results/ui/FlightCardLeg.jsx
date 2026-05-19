import React from "react";
import { Plane } from "lucide-react";
import { motion } from "framer-motion";
import {
    getLocationName,
    formatFlightTime,
    formatFlightDateShort
} from "@/utils/flightUtils";

export default function FlightCardLeg({
    itinerary,
    idx,
    itinerariesCount,
    dictionaries,
    language,
    t
}) {
    const segs = itinerary.segments;
    const first = segs[0];
    const last = segs.at(-1);
    const airline = first.carrierCode;

    return (
        <div className="relative">
            <div className="absolute -top-7 left-0">
                <span
                    className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase italic tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800"
                    style={{ color: "var(--brand-color)" }}
                >
                    {itinerariesCount === 2
                        ? (idx === 0 ? t("search.flight.outbound") || "Hinflug" : t("search.flight.inbound") || "Rückflug")
                        : `Leg ${idx + 1}`}
                </span>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                <div className="w-11 h-11 bg-white rounded-xl p-1.5 border border-zinc-100 shadow-sm shrink-0 flex items-center justify-center">
                    <img
                        src={`https://images.kiwi.com/airlines/64/${airline}.png`}
                        alt={airline}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.target.src = "https://images.kiwi.com/airlines/64/default.png";
                        }}
                    />
                </div>

                <div className="flex-1 grid grid-cols-3 items-center">
                    <div className="text-left">
                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] font-black text-zinc-400 block mb-0.5 tracking-tighter">
                            {formatFlightDateShort(first.departure.at, language)}
                        </span>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic uppercase leading-none tracking-tighter">
                            {formatFlightTime(first.departure.at, language)}
                        </p>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-bold uppercase italic mt-1 truncate max-w-[150px]" style={{ color: "var(--brand-color)" }}>
                            {getLocationName(first.departure.iataCode, dictionaries, language)}
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4 relative">
                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-black text-zinc-400 mb-2 uppercase tracking-widest leading-none">
                            {itinerary.duration?.replace('PT', '').toLowerCase() || '--'}
                        </span>
                        <div className="w-full h-[1.5px] bg-zinc-100 dark:bg-zinc-800 relative flex items-center justify-center">
                            <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute"
                            >
                                <Plane
                                    size={14}
                                    className={`${idx === 1 ? 'rotate-180' : 'rotate-5'}`}
                                    style={{ color: "var(--brand-color)", fill: "currentColor" }}
                                />
                            </motion.div>
                        </div>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase mt-2 italic leading-none">
                            {segs.length > 1
                                ? `${segs.length - 1} ${segs.length === 2 ? t("search.flight.details.stop") : t("search.flight.details.stops")}`
                                : t("search.flight.details.direct")}
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] font-black text-zinc-400 block mb-0.5 tracking-tighter">
                            {formatFlightDateShort(last.arrival.at, language)}
                        </span>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic uppercase leading-none tracking-tighter">
                            {formatFlightTime(last.arrival.at, language)}
                        </p>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-bold uppercase italic mt-1 truncate max-w-[150px]" style={{ color: "var(--brand-color)" }}>
                            {getLocationName(last.arrival.iataCode, dictionaries, language)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
