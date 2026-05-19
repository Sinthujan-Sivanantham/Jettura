import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, Info, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import FlightSegmentItem from "./ui/FlightSegmentItem";
import { calculateWaitTime } from "@/utils/flightUtils";

export default function FlightDetailsModal({ flight, onClose, logo, dictionaries }) {
  const { t, language } = useLanguage();
  const brandColor = "var(--brand-color)";

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!flight) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col text-zinc-900 dark:text-white"
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b dark:border-zinc-900 flex justify-between items-center bg-white dark:bg-zinc-950 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-1.5 border border-zinc-100 shadow-sm shrink-0 flex items-center justify-center">
              <img src={logo} alt="airline" className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-black italic uppercase tracking-tighter leading-none">
                {t("search.flight.details.title") || "Flight Details"}
              </h2>
              <p className="text-[7px] sm:text-[8px] md:text-[10px] xl:text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: brandColor }}>Intelligence Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-10">
          {flight.itineraries.map((itinerary, itineraryIdx) => (
            <div key={itineraryIdx}>

              <div className="mb-6 flex items-center gap-3">
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base font-black uppercase italic px-3 py-1 rounded-lg border tracking-widest"
                  style={{
                    color: brandColor,
                    backgroundColor: `color-mix(in srgb, ${brandColor} 10%, transparent)`,
                    borderColor: `color-mix(in srgb, ${brandColor} 20%, transparent)`
                  }}>
                  {itineraryIdx === 0
                    ? (t("search.flight.details.outbound") || "Outbound")
                    : (t("search.flight.details.inbound") || "Inbound")}
                </span>
                <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
              </div>

              {itinerary.segments.map((seg, i) => {
                const pricingIndex = itineraryIdx === 0 ? i : flight.itineraries[0].segments.length + i;

                return (
                  <FlightSegmentItem
                    key={seg.id || `${itineraryIdx}-${i}`}
                    segment={seg}
                    nextSegment={itinerary.segments[i + 1]}
                    itineraryIndex={itineraryIdx}
                    pricingIndex={pricingIndex}
                    flight={flight}
                    dictionaries={dictionaries}
                    t={t}
                    language={language}
                    brandColor={brandColor}
                    calculateWait={calculateWaitTime}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-white dark:bg-[#0c0c0e] border-t dark:border-zinc-900 flex flex-col items-center gap-4">
          <button
            onClick={() => {
              if (flight.deepLink) {
                window.open(flight.deepLink, "_blank");
                return;
              }

              const marker = "694152";
              const itineraries = flight.itineraries;
              const firstLeg = itineraries[0].segments[0];
              const lastLeg = itineraries[0].segments.at(-1);

              const dateObj = new Date(firstLeg.departure.at);
              const day = dateObj.getDate().toString().padStart(2, '0');
              const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

              const adults = flight.travelerPricings ? flight.travelerPricings.length : 1;

              let searchPath = `${firstLeg.departure.iataCode}${day}${month}${lastLeg.arrival.iataCode}`;

              if (itineraries[1] && itineraries[1].segments.length > 0) {
                const returnLeg = itineraries[1].segments[0];
                const retDate = new Date(returnLeg.departure.at);
                const retDay = retDate.getDate().toString().padStart(2, '0');
                const retMonth = (retDate.getMonth() + 1).toString().padStart(2, '0');
                searchPath += `${retDay}${retMonth}`;
              }

              searchPath += `${adults}`;
              window.open(`https://www.aviasales.com/search/${searchPath}?marker=${marker}&market=us`, "_blank");
            }}
            className="w-full h-12 sm:h-14 md:h-16 rounded-[2rem] text-white font-black italic uppercase text-[10px] sm:text-xs md:text-sm tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all relative overflow-hidden group flex items-center justify-center gap-4"
            style={{ backgroundColor: brandColor }}
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3 md:text-base lg:text-lg">
              {t("search.flight.details.book") || "Book"} <span className="opacity-40 font-bold not-italic">|</span>
              <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg md:text-xl lg:text-2xl">
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] md:text-xs uppercase opacity-60 mr-1 not-italic font-bold">{t("search.flight.details.from") || "from"}</span>
                {flight.price.total} {flight.price.currency}
              </span>
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>

          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Info size={11} />
                <span className="text-[7px] font-black uppercase italic tracking-widest">GDS Live Feed</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <ShieldAlert size={11} />
                <span className="text-[7px] font-black uppercase italic tracking-widest">TLS Encrypted</span>
              </div>
            </div>
            <p className="text-[7px] font-black uppercase text-zinc-500 tracking-[0.4em] text-center opacity-40">
              Jettura Intelligence Unit • v2.04 GDS Sync
            </p>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}