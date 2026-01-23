import React from "react";
import { Filter, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";

export default function FlightFilterSidebar({ filters, setFilters, availableAirlines, dictionaries }) {
  const { t } = useLanguage();

  const handleStopChange = (id, checked) => {
    const newStops = checked
      ? [...filters.stops, id]
      : filters.stops.filter(s => s !== id);
    setFilters({ ...filters, stops: newStops });
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 space-y-5 shrink-0">
      {/* Header Bereich */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xs sm:text-sm font-black uppercase italic tracking-[0.2em] flex items-center gap-2" style={{ color: "var(--brand-color)" }}>
          <Filter size={14} /> {t("filters.title")}
        </h2>
        <button
          onClick={() => setFilters({ price: 3000, stops: [], time: [0, 24], airlines: [] })}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:opacity-80 transition-colors italic"
        >
          {t("filters.reset")}
        </button>
      </div>

      {/* Preis-Filter Card */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.2rem] shadow-sm">
        <label className="text-[11px] font-black uppercase italic mb-4 block opacity-60" style={{ color: "var(--brand-color)" }}>
          {t("filters.maxPrice")}
        </label>
        <Slider
          value={[filters.price]}
          max={3000}
          step={50}
          onValueChange={(val) => setFilters({ ...filters, price: val[0] })}
          className="mb-4"
        />
        <div className="flex justify-between text-xs font-black italic" style={{ color: "var(--brand-color)" }}>
          <span>0 €</span>
          <span>{filters.price} €</span>
        </div>
      </div>

      {/* Stopps-Filter Card */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.2rem] shadow-sm">
        <label className="text-[11px] font-black uppercase italic mb-5 block opacity-60" style={{ color: "var(--brand-color)" }}>
          {t("filters.stops")}
        </label>
        <div className="space-y-4">
          {[
            { id: "0", label: t("filters.direct") },
            { id: "1", label: t("filters.oneStop") },
            { id: "2", label: t("filters.plusStops") },
          ].map((option) => (
            <div key={option.id} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={option.id}
                  checked={filters.stops.includes(option.id)}
                  onCheckedChange={(checked) => handleStopChange(option.id, checked)}
                  className="rounded-lg shadow-sm"
                />
                <label htmlFor={option.id} className="text-xs font-black uppercase cursor-pointer hover:opacity-80 transition-colors italic">
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zeit-Filter Card */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.2rem] shadow-sm">
        <label className="text-[11px] font-black uppercase italic mb-4 block flex items-center gap-2 opacity-60" style={{ color: "var(--brand-color)" }}>
          <Clock size={12} /> {t("filters.departureTime")}
        </label>
        <Slider
          value={filters.time}
          max={24}
          step={1}
          onValueChange={(val) => setFilters({ ...filters, time: val })}
          className="mb-4"
        />
        <div className="flex justify-between text-[10px] font-black italic text-zinc-500 uppercase">
          <span>{filters.time[0]}:00</span>
          <span>{filters.time[1]}:00</span>
        </div>
      </div>

      {/* Airline-Filter Card */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.2rem] shadow-sm">
        <label className="text-[11px] font-black uppercase italic mb-5 block opacity-60" style={{ color: "var(--brand-color)" }}>{t("filters.airlines")}</label>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {availableAirlines && availableAirlines.length > 0 ? availableAirlines.map((code, idx) => (
            <div key={`${code}-${idx}`} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={code}
                  checked={filters.airlines.includes(code)}
                  onCheckedChange={(checked) => {
                    const newAirlines = checked
                      ? [...filters.airlines, code]
                      : filters.airlines.filter(a => a !== code);
                    setFilters({ ...filters, airlines: newAirlines });
                  }}
                  className="rounded-lg shadow-sm"
                />
                <label htmlFor={code} className="text-xs font-black uppercase cursor-pointer hover:opacity-80 transition-colors italic leading-none pt-1">
                  {dictionaries?.carriers?.[code] || code}
                </label>
              </div>
            </div>
          )) : <p className="text-[11px] text-zinc-400 italic">{t("filters.noAirlines")}</p>}
        </div>
      </div>
    </aside>
  );
}