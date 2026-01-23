import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CityAutocomplete({
    label,
    placeholder,
    value,
    onSelect,
    error,
    shakeKey
}) {
    const { language } = useLanguage();
    const [inputValue, setInputValue] = useState(value || "");
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Popular cities with IATA codes
    const popularCities = [
        { name: "Paris", iata: "PAR", country: "France" },
        { name: "London", iata: "LON", country: "United Kingdom" },
        { name: "New York", iata: "NYC", country: "United States" },
        { name: "Berlin", iata: "BER", country: "Germany" },
        { name: "Tokyo", iata: "TYO", country: "Japan" },
        { name: "Dubai", iata: "DXB", country: "UAE" },
        { name: "Barcelona", iata: "BCN", country: "Spain" },
        { name: "Rome", iata: "ROM", country: "Italy" },
        { name: "Amsterdam", iata: "AMS", country: "Netherlands" },
        { name: "Singapore", iata: "SIN", country: "Singapore" },
        { name: "Los Angeles", iata: "LAX", country: "United States" },
        { name: "Hong Kong", iata: "HKG", country: "Hong Kong" },
        { name: "Istanbul", iata: "IST", country: "Turkey" },
        { name: "Bangkok", iata: "BKK", country: "Thailand" },
        { name: "Vienna", iata: "VIE", country: "Austria" },
        { name: "Munich", iata: "MUC", country: "Germany" },
        { name: "Frankfurt", iata: "FRA", country: "Germany" },
        { name: "Madrid", iata: "MAD", country: "Spain" },
        { name: "Lisbon", iata: "LIS", country: "Portugal" },
        { name: "Prague", iata: "PRG", country: "Czech Republic" }
    ];

    // Filter cities based on input
    useEffect(() => {
        if (inputValue.length < 2) {
            setSuggestions([]);
            return;
        }

        const filtered = popularCities.filter(city =>
            city.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            city.iata.toLowerCase().includes(inputValue.toLowerCase()) ||
            city.country.toLowerCase().includes(inputValue.toLowerCase())
        ).slice(0, 8);

        setSuggestions(filtered);
    }, [inputValue]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (city) => {
        setInputValue(`${city.name} (${city.iata})`);
        onSelect(city.iata); // Pass IATA code to parent
        setIsOpen(false);
        setSuggestions([]);
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        setIsOpen(true);
    };

    return (
        <div ref={wrapperRef} className="relative">
            {label && (
                <label className="block text-[10px] font-black uppercase italic tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <MapPin size={18} className="text-zinc-400" />
                </div>

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder || (language === "de" ? "Stadt suchen..." : "Search city...")}
                    className={`w-full h-14 pl-12 pr-4 bg-white dark:bg-zinc-900 border-2 rounded-2xl text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 transition-all outline-none ${error
                            ? 'border-red-500 animate-shake'
                            : 'border-zinc-200 dark:border-zinc-800 focus:border-[var(--brand-color)]'
                        }`}
                    key={shakeKey}
                />

                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 size={18} className="animate-spin text-zinc-400" />
                    </div>
                )}
            </div>

            {error && (
                <p className="text-[9px] text-red-500 mt-1 font-bold italic">
                    {error}
                </p>
            )}

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                    {suggestions.map((city, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(city)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                        >
                            <div className="w-8 h-8 rounded-full bg-[var(--brand-color)]/10 flex items-center justify-center flex-shrink-0">
                                <MapPin size={14} className="text-[var(--brand-color)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-black italic text-zinc-900 dark:text-white truncate">
                                    {city.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                                    {city.country}
                                </div>
                            </div>
                            <div className="text-xs font-black italic text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                {city.iata}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results */}
            {isOpen && inputValue.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 text-center">
                    <p className="text-xs text-zinc-400 italic">
                        {language === "de" ? "Keine Städte gefunden" : "No cities found"}
                    </p>
                </div>
            )}
        </div>
    );
}
