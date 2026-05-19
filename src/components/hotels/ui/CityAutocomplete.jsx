
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Loader2, Building2, MapPin, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { searchAirportsAmadeus, findNearestAirport } from "@/services/amadeusFlightApi";

const autocompleteCache = {};

export default function CityAutocomplete({ label, placeholder, onSelect, value, error, onClearError, shakeKey }) {
    const { t, language } = useLanguage();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState(false);
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
                console.error("Hotel Autocomplete Error:", e);
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
            onSelect(s.iataCode);
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
                    onSelect(nearest.iataCode);
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
                                <label className="search-label-text font-black uppercase italic tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2 block">
                                    {label}
                                </label>
                            )}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                    <MapPin size={18} className="text-zinc-400" />
                                </div>
                                <Input
                                    value={query}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setQuery(val);
                                        if (val.length === 3 && /^[A-Z]{3}$/.test(val)) onSelect(val);
                                        setShow(true);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder={error || placeholder || (language === "de" ? "Stadt suchen..." : "Search city...")}
                                    onFocus={() => {
                                        setShow(true);
                                        if (onClearError) onClearError();
                                        else if (error && onSelect) onSelect("");
                                    }}
                                    className={cn(
                                        "w-full h-14 pl-12 pr-4 bg-white dark:bg-zinc-900 border-2 rounded-2xl search-input-text font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all outline-none",
                                        error
                                            ? "border-red-500 animate-shake"
                                            : "border-zinc-200 dark:border-zinc-800 focus:border-[var(--brand-color)]"
                                    )}
                                    style={{ outline: "none" }}
                                    autoComplete="off"
                                />
                            </div>
                            {(loading || resolving) && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 className="animate-spin text-zinc-400" size={18} />
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
                                                    <MapPin size={14} className="text-[var(--brand-color)]" />}
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
                                            <span className="font-black bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded search-input-text italic shrink-0 text-[var(--brand-color)]">
                                                {s.iataCode}
                                            </span>
                                        )}
                                        {s.type === "location" && (
                                            <span className="font-bold search-label-text bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded italic shrink-0 text-zinc-400">
                                                → IATA
                                            </span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center">
                                    <span className="search-label-text font-bold text-zinc-400 italic">
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
