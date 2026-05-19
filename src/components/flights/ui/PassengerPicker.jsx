import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Minus, Users, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PassengerPicker({ passengers, setPassengers }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const update = (type, val) => {
    const newVal = Math.max(0, passengers[type] + val);
    if (type === 'adults' && (newVal < 1 || newVal > 5)) return;
    setPassengers({ ...passengers, [type]: newVal });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setOpen(false);
    }
  };

  const total = passengers.adults + passengers.children + passengers.infants;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer text-left group">
          <label className="search-label-text font-black uppercase text-zinc-700 dark:text-zinc-300 mb-2 ml-1 tracking-[0.2em] italic leading-none">{t("search.passengerTypes.total")}</label>
          <div className="h-11 min-[760px]:h-14 flex items-center px-4 lg:px-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-zinc-900/20 search-input-text font-black italic uppercase shadow-inner transition-all text-zinc-900 dark:text-white group-hover:border-[var(--brand-color)]">
            <Users className="w-4 h-4 min-[760px]:w-5 min-[760px]:h-5 mr-3 min-[760px]:mr-4 text-zinc-400 group-hover:opacity-100 transition-colors" style={{ color: "var(--brand-color)" }} />
            {total} {t("search.passengerTypes.total")}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        onKeyDown={handleKeyDown}
        className="w-[240px] sm:w-[280px] p-0 rounded-[2rem] bg-white dark:bg-[#0c0c0e] border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden mr-4"
      >
        <div className="p-4 sm:p-5 space-y-4">
          {[
            { id: 'adults', label: t('search.passengerTypes.adults'), desc: t('search.passengerTypes.adultsDesc') },
            { id: 'children', label: t('search.passengerTypes.children'), desc: t('search.passengerTypes.childrenDesc') },
            { id: 'infants', label: t('search.passengerTypes.infants'), desc: t('search.passengerTypes.infantsDesc') }
          ].map(({ id, label, desc }) => (
            <div key={id} className="flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="search-input-text font-black italic uppercase text-zinc-900 dark:text-white transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300 leading-tight">
                  {label}
                </span>
                <span className="search-label-text font-bold text-zinc-400 uppercase italic">
                  {desc}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => update(id, -1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-zinc-500 hover:text-black dark:hover:text-white"
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span className="search-input-text font-black w-5 text-center italic">
                  {passengers[id]}
                </span>
                <button
                  type="button"
                  onClick={() => update(id, 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white shadow-lg"
                  style={{ backgroundColor: "var(--brand-color)" }}
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 text-zinc-400">
            <Info size={12} style={{ color: "var(--brand-color)" }} />
            <span className="search-label-text font-black uppercase tracking-tighter italic">
              {t("search.passengerTypes.standard")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-white font-black italic uppercase search-input-text rounded-xl py-2.5 shadow-xl active:scale-95 transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand-color)" }}
          >
            {t("search.passengerTypes.apply")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}