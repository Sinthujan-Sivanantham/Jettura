
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Loader2, Plane, Building2, MapPin, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "@/components/ui/popover";
import { searchAirportsAmadeus, findNearestAirport } from "@/services/amadeusFlightApi";

const autocompleteCache = {};

export default function AirportAutocomplete({ label, icon, placeholder, onSelect, value, error, onClearError, shakeKey }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false); // New state for resolving Mapbox -> Airport
  const [show, setShow] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (error && shakeKey > 0) {
      controls.stop();
      controls.set({ x: 0 });
      controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
    }
  }, [shakeKey, error, controls]);

  useEffect(() => {
    if (value) {
      if (query && query.includes(value)) {
        return;
      }

      if (value.length === 3 && /^[A-Z]{3}$/.test(value)) {
        const cached = Object.values(autocompleteCache).flat().find(item => item.iataCode === value);
        if (cached) {
          setQuery(`${cached.cityName} (${cached.iataCode})`);
          return;
        }

        searchAirportsAmadeus(value).then(res => {
          if (res && res.length > 0) {
            const match = res.find(r => r.iataCode === value) || res[0];
            setQuery(`${match.cityName} (${match.iataCode})`);
          } else {
            setQuery(value);
          }
        }).catch(() => setQuery(value));
        return;
      }

      setQuery(value);
    } else {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    const fetchLocations = async () => {
      const trimmedQuery = query.trim();

      if (trimmedQuery.length < 2 || trimmedQuery.includes("(")) {
        setSuggestions([]);
        return;
      }

      const cacheKey = `${trimmedQuery}-${language}`;
      if (autocompleteCache[cacheKey]) {
        setSuggestions(autocompleteCache[cacheKey]);
        return;
      }

      setLoading(true);

      try {
        // Parallel requests: Amadeus (Airports/Cities) + Mapbox (Places/Addresses)
        const [amadeusRaw, mapboxRes] = await Promise.all([
          searchAirportsAmadeus(trimmedQuery).catch(e => []),
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json?access_token=${mapboxToken}&types=country,region,place,locality,address&limit=3&language=${language}`)
            .then(r => r.json())
            .catch(e => ({ features: [] }))
        ]);

        const amadeusResults = amadeusRaw.map(item => {
          let country = item.countryName;
          if (item.countryCode) {
            try {
              const regionNames = new Intl.DisplayNames([language], { type: 'region' });
              country = regionNames.of(item.countryCode);
            } catch (e) {
              console.error("Locales Error", e);
            }
          }
          return { ...item, countryName: country };
        });

        const mapboxItems = (mapboxRes.features || []).map(f => {
          let country = f.context?.find(c => c.id.startsWith('country'))?.text || "";
          // Mapbox places often have only the local name or english name.
          // We can try to rely on context text, but since we asked for language specific response in fetch url (`language=${language}`),
          // Mapbox should already return localized names for the most part.
          // However, extra safety:
          const countryCode = f.context?.find(c => c.id.startsWith('country'))?.short_code?.toUpperCase();
          if (countryCode) {
            try {
              const regionNames = new Intl.DisplayNames([language], { type: 'region' });
              country = regionNames.of(countryCode);
            } catch (e) {
              // fallback
            }
          }

          return {
            id: f.id,
            name: f.text,
            cityName: f.place_name,
            countryName: country,
            type: "location",
            center: f.center,
            source: "mapbox"
          };
        });

        // Combine: Amadeus first (most relevant for flights), then Mapbox
        // Deduplicate? Amadeus "Paris" vs Mapbox "Paris".
        // Amadeus is better for flights because it gives IATA directly.
        // We'll prioritize Amadeus.

        const combined = [...amadeusResults, ...mapboxItems];

        autocompleteCache[cacheKey] = combined;
        setSuggestions(combined);

      } catch (e) {
        console.error("Autocomplete Error:", e);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timer);
  }, [query, mapboxToken, language]);

  const handleSelect = async (s) => {
    // If it's an Amadeus result, it has an IATA code.
    if (s.iataCode) {
      const displayValue = `${s.cityName} (${s.iataCode})`;
      setQuery(displayValue);
      onSelect(s.iataCode);
      setShow(false);
      return;
    }

    // If it's a Mapbox result, we need to find the nearest airport.
    if (s.source === "mapbox" && s.center) {
      setResolving(true);
      setQuery(s.cityName); // Show the selected name temporarily
      try {
        const [lng, lat] = s.center;
        const nearest = await findNearestAirport(lat, lng);

        if (nearest && nearest.iataCode) {
          const displayValue = `${s.name} → ${nearest.iataCode}`;
          setQuery(displayValue);
          onSelect(nearest.iataCode);
        } else {
          // Return just the name? Or error?
          // For flight search, we usually NEED an IATA code.
          console.warn("No airport found near this location.");
          // Fallback: Just select the name? Or show error?
          // The current StandardSearch expects IATA.
          // We'll keep the query but maybe not trigger valid onSelect?
          // Or trigger query.
        }
      } catch (e) {
        console.error(e);
      } finally {
        setResolving(false);
        setShow(false);
      }
    }
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
                <label className="search-label-text font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mb-2 ml-1 flex items-center gap-1.5 italic leading-none">
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
                    // onSelect(val); // Don't trigger onSelect immediately on type for manual typing unless it matches?
                    // StandardSearch expects IATA. Raw text might break it. 
                    // Better to only trigger on explicit select or valid IATA match.
                    if (val.length === 3 && /^[A-Z]{3}$/.test(val)) onSelect(val);
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
                    "search-input-text uppercase",
                    error
                      ? "border-rose-500 dark:border-rose-500 airport-error-input"
                      : "border-zinc-200 dark:border-zinc-800",
                    icon ? "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px]" : "pl-5"
                  )}
                  style={{ outline: "none" }}
                  autoComplete="off"
                />
              </div>
              {(loading || resolving) && (
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
                    key={`${s.iataCode || s.id}-${idx}`}
                    onClick={() => handleSelect(s)}
                    className="p-3 pl-5 hover:bg-zinc-50 dark:hover:bg-[var(--brand-color)]/10 cursor-pointer flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-400">
                        {s.type === "city" ? <Building2 size={12} /> :
                          s.type === "airport" ? <Plane size={12} /> :
                            <MapPin size={12} />}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-black search-input-text text-zinc-700 dark:text-zinc-200 uppercase tracking-tighter truncate italic">
                          {s.name}
                        </span>
                        <span className="search-label-text text-zinc-400 font-bold uppercase truncate">
                          {s.cityName} {s.countryName ? `, ${s.countryName}` : ""}
                        </span>
                      </div>
                    </div>
                    {s.iataCode && (
                      <span className="font-black bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-lg search-input-text italic shrink-0" style={{ color: brandColor }}>
                        {s.iataCode}
                      </span>
                    )}
                    {s.type === "location" && (
                      <span className="font-bold search-label-text bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-lg italic shrink-0 text-zinc-400">
                        → IATA
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <span className="search-label-text font-bold text-zinc-400 italic">
                    {loading ? (t("search.flight.searching") || "Searching...") : (t("search.flight.noResults") || "No results found")}
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