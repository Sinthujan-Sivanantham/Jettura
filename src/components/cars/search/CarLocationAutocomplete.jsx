
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, Building2, Plane } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { searchAirportsAmadeus, findNearestAirport } from "@/services/amadeusFlightApi";

const autocompleteCache = {};

export default function CarLocationAutocomplete({ label, placeholder, onSelect, value, error, onClearError, shakeKey }) {
    const { t, language } = useLanguage();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [show, setShow] = useState(false);
    const wrapperRef = useRef(null);
    const controls = useAnimation();

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    useEffect(() => {
        if (value) {
            const displayName = typeof value === 'object'
                ? (value.displayname || value.cityName || value.name || value.id)
                : value;
            if (query && query.includes(displayName)) return;
            setQuery(displayName);
        }
    }, [value]);

    useEffect(() => {
        if (error && shakeKey > 0) {
            controls.stop();
            controls.set({ x: 0 });
            controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
        }
    }, [shakeKey, error, controls]);

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
                const [amadeusRaw, mapboxRes] = await Promise.all([
                    searchAirportsAmadeus(trimmedQuery).catch(e => []),
                    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json?access_token=${mapboxToken}&types=country,region,place,locality,address&limit=5&language=${language}`)
                        .then(r => r.json())
                        .catch(e => ({ features: [] }))
                ]);

                const amadeusResults = amadeusRaw.map(item => {
                    let country = item.countryName;
                    if (item.countryCode) {
                        try {
                            const regionNames = new Intl.DisplayNames([language], { type: 'region' });
                            country = regionNames.of(item.countryCode);
                        } catch (e) { }
                    }
                    return { ...item, countryName: country };
                });

                const mapboxItems = (mapboxRes.features || []).map(f => {
                    let country = f.context?.find(c => c.id.startsWith('country'))?.text || "";
                    const countryCode = f.context?.find(c => c.id.startsWith('country'))?.short_code?.toUpperCase();
                    if (countryCode) {
                        try {
                            const regionNames = new Intl.DisplayNames([language], { type: 'region' });
                            country = regionNames.of(countryCode);
                        } catch (e) { }
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

                const combined = [...amadeusResults, ...mapboxItems];
                autocompleteCache[cacheKey] = combined;
                setSuggestions(combined);

            } catch (e) {
                console.error("Car Autocomplete Error:", e);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchLocations, 300);
        return () => clearTimeout(timer);
    }, [query, mapboxToken, language]);

    const handleSelect = async (s) => {
        if (s.iataCode) {
            const displayValue = `${s.cityName} (${s.iataCode})`;
            setQuery(displayValue);
            if (onSelect) onSelect({ id: s.iataCode, displayname: displayValue, type: s.type });
            setShow(false);
            return;
        }

        if (s.source === "mapbox" && s.center) {
            setResolving(true);
            setQuery(s.cityName);
            try {
                const [lng, lat] = s.center;
                const nearest = await findNearestAirport(lat, lng);
                if (nearest && nearest.iataCode) {
                    const displayValue = `${s.name} → ${nearest.iataCode}`;
                    setQuery(displayValue);
                    if (onSelect) onSelect({ id: nearest.iataCode, displayname: displayValue, type: "location" });
                } else {
                    // Fallback to the place name if no airport is near
                    if (onSelect) onSelect({ id: s.id, displayname: s.cityName, type: "location" });
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
        <div className="w-full relative" ref={wrapperRef}>
            <Popover open={show && query.length >= 2} onOpenChange={setShow}>
                <PopoverAnchor asChild>
                    <div className="relative w-full text-left">
                        <motion.div animate={controls}>
                            {label && (
                                <label className="search-label-text font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mb-2 ml-1 flex items-center gap-1.5 italic leading-none">
                                    {label}
                                </label>
                            )}
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-5 h-5" style={{ color: error ? "#f43f5e" : brandColor }} />
                                <Input
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        if (onClearError) onClearError();
                                        setShow(true);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        setShow(true);
                                        if (onClearError) onClearError();
                                    }}
                                    placeholder={error ? (t("search.flight.errors.required") || "Required") : (placeholder || "City or Airport...")}
                                    className={cn(
                                        "h-11 min-[760px]:h-14 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-2xl font-black italic transition-all focus:ring-0 focus:border-[var(--brand-color)] focus-visible:ring-0 focus-visible:ring-offset-0",
                                        "search-input-text uppercase",
                                        error
                                            ? "border-rose-500 dark:border-rose-500"
                                            : "border-zinc-200 dark:border-zinc-800",
                                        "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px] pr-4 shadow-sm"
                                    )}
                                    style={{ outline: "none" }}
                                    autoComplete="off"
                                />
                                {(loading || resolving) && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </PopoverAnchor>

                <PopoverContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className="p-0 bg-transparent border-none shadow-none z-[100000]"
                    style={{ width: wrapperRef.current?.offsetWidth || 'auto' }}
                >
                    <div className="mt-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-3xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {suggestions.length > 0 ? (
                                suggestions.map((s, idx) => (
                                    <div
                                        key={`${s.iataCode || s.id}-${idx}`}
                                        onClick={() => handleSelect(s)}
                                        className="p-3 pl-5 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-full bg-[var(--brand-color)]/10 flex items-center justify-center flex-shrink-0">
                                                {s.type === "city" ? <Building2 size={14} className="text-[var(--brand-color)]" /> :
                                                    s.type === "airport" ? <Plane size={14} className="text-[var(--brand-color)]" /> :
                                                        <MapPin size={14} className="text-[var(--brand-color)]" />}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-black text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs text-zinc-700 dark:text-zinc-200 uppercase tracking-tighter truncate italic">
                                                    {s.name}
                                                </span>
                                                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase truncate">
                                                    {s.cityName} {s.countryName ? `, ${s.countryName}` : ""}
                                                </span>
                                            </div>
                                        </div>
                                        {s.iataCode && (
                                            <span className="font-black bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] italic shrink-0 text-[var(--brand-color)]">
                                                {s.iataCode}
                                            </span>
                                        )}
                                        {s.type === "location" && (
                                            <span className="font-bold text-[7px] sm:text-[8px] sm:text-[9px] bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded italic shrink-0 text-zinc-400">
                                                → IATA
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center">
                                    <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-bold text-zinc-400 italic">
                                        {loading ? (t("search.flight.searching") || "Suche...") : (t("search.flight.noResults") || "Keine Ergebnisse")}
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
