
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Loader2, Plane, Building2, MapPin } from "lucide-react";
// import { searchLocations } from "@/services/kiwiApi";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "@/components/ui/popover";

const autocompleteCache = {};

import { searchAirportsAmadeus } from "@/services/amadeusFlightApi";

// Use the real API function directly
const searchLocations = async (query) => {
  return await searchAirportsAmadeus(query);
}

export default function AirportAutocomplete({ label, icon, placeholder, onSelect, value, error, onClearError, shakeKey }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef(null);

  useEffect(() => {
    if (error && shakeKey > 0) {
      controls.stop();
      controls.set({ x: 0 });
      controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
    }
  }, [shakeKey, error, controls]);

  useEffect(() => {
    if (value) {
      // Only update query if it's not already set (to avoid infinite loops)
      if (!query.includes(value)) {
        setQuery(value);
      }
    } else {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    const fetchAirports = async () => {
      const trimmedQuery = query.trim();

      if (trimmedQuery.length < 2 || trimmedQuery.includes("(")) {
        setSuggestions([]);
        return;
      }

      if (autocompleteCache[trimmedQuery]) {
        setSuggestions(autocompleteCache[trimmedQuery]);
        return;
      }

      setLoading(true);

      try {
        const results = await searchLocations(trimmedQuery);
        autocompleteCache[trimmedQuery] = results;
        setSuggestions(results);
      } catch (e) {
        console.error("Autocomplete Error:", e);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchAirports, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (s) => {
    const displayValue = `${s.cityName} (${s.iataCode})`;
    setQuery(displayValue);
    onSelect(s.iataCode);
    setShow(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  const brandColor = "var(--brand-color)";

  return (
    <div className="w-full" ref={containerRef}>
      <Popover open={show && query.length >= 2} onOpenChange={setShow}>
        <PopoverAnchor asChild>
          <div className="relative w-full text-left">
            <motion.div className="relative w-full" animate={controls}>
              {label && (
                <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mb-2 ml-1 flex items-center gap-1.5 italic leading-none">
                  {label}
                </label>
              )}
              <div className="relative">
                {icon && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ color: error ? "#f43f5e" : brandColor }}>
                    {icon}
                  </div>
                )}
                <Input
                  value={query}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuery(val);
                    onSelect(val);
                    setShow(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={error ? (t("search.flight.errors.required") || "Required") : (placeholder || label)}
                  onFocus={() => {
                    setShow(true);
                    if (onClearError) onClearError();
                  }}
                  className={cn(
                    "h-11 min-[760px]:h-14 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-2xl font-black italic transition-all focus:ring-0 focus:border-[var(--brand-color)]",
                    "text-xs min-[760px]:text-sm min-[1200px]:text-base uppercase",
                    error
                      ? "border-rose-500 dark:border-rose-500 airport-error-input"
                      : "border-zinc-200 dark:border-zinc-800",
                    icon ? "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px]" : "pl-5"
                  )}
                  style={{ outline: "none" }}
                />
              </div>
              {loading && (
                <div className="absolute right-3 top-[65%] -translate-y-1/2">
                  <Loader2 className="animate-spin" size={14} style={{ color: brandColor }} />
                </div>
              )}
            </motion.div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="p-0 bg-transparent border-none shadow-none z-[100000]"
          style={{ width: containerRef.current?.offsetWidth || 'auto' }}
        >
          <div className="mt-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-3xl border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {suggestions.length > 0 ? (
                suggestions.map((s, idx) => (
                  <div
                    key={`${s.iataCode}-${idx}`}
                    onClick={() => handleSelect(s)}
                    className="p-3 pl-5 hover:bg-zinc-50 dark:hover:bg-[var(--brand-color)]/10 cursor-pointer flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-400">
                        {s.type === "city" ? <Building2 size={12} /> : <Plane size={12} />}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-black text-[10px] sm:text-xs text-zinc-700 dark:text-zinc-200 uppercase tracking-tighter truncate italic">
                          {s.name}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase truncate">
                          {s.cityName}, {s.countryName}
                        </span>
                      </div>
                    </div>
                    <span className="font-black bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-lg text-[10px] italic shrink-0" style={{ color: brandColor }}>
                      {s.iataCode}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <span className="text-xs font-bold text-zinc-400 italic">
                    {loading ? (t("search.flight.searching") || "Searching...") : (t("search.flight.noResults") || "No airports found")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}