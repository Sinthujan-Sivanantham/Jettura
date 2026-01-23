import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
// import { getLocationSuggestions } from "@/services/kayakCarApi"; // Removed per user request

// Mock function replacing the API call
const getLocationSuggestions = async (query) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock data based on query
    if (!query || query.length < 2) return [];

    const mockDb = [
        { id: "BER", displayname: "Berlin, Germany", type: "airport" },
        { id: "MUC", displayname: "Munich, Germany", type: "airport" },
        { id: "FRA", displayname: "Frankfurt, Germany", type: "airport" },
        { id: "JFK", displayname: "New York, USA", type: "airport" },
        { id: "LHR", displayname: "London Heathrow, UK", type: "airport" },
        { id: "DXB", displayname: "Dubai, UAE", type: "airport" },
        { id: "CDG", displayname: "Paris Charles de Gaulle, France", type: "airport" },
        { id: "AMS", displayname: "Amsterdam Schiphol, Netherlands", type: "airport" },
        { id: "ZRH", displayname: "Zurich, Switzerland", type: "airport" },
        { id: "VIE", displayname: "Vienna, Austria", type: "airport" },
    ];

    return mockDb.filter(item =>
        item.displayname.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
    );
};

export default function CarLocationAutocomplete({ label, placeholder, onSelect, value, error, onClearError, shakeKey }) {
    const { t } = useLanguage();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const controls = useAnimation();

    // Handle initial value
    useEffect(() => {
        if (value) {
            // value is the object { id, displayname... }
            // We want to show the display name
            setQuery(typeof value === 'object' ? (value.displayname || value.city || value.shortName || value.id) : value);
        }
    }, [value]);

    useEffect(() => {
        if (error && shakeKey > 0) {
            controls.stop();
            controls.set({ x: 0 });
            controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
        }
    }, [shakeKey, error, controls]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async (q) => {
        if (q.length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }
        setLoading(true);
        try {
            const results = await getLocationSuggestions(q);
            setSuggestions(results || []);
            setIsOpen(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Debounce manual implementation since I'm not sure if useDebounce hook exists
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query && document.activeElement === wrapperRef.current?.querySelector('input')) {
                fetchSuggestions(query);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);


    const handleSelect = (item) => {
        // Construct a display name
        const displayName = item.displayname || item.city || item.shortName || item.id;
        setQuery(displayName);
        setIsOpen(false);
        if (onSelect) {
            onSelect({ ...item, fullName: displayName }); // Ensure compatibility with existing logic if needed
        }
    };

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (onClearError) onClearError();
    };

    const brandColor = "var(--brand-color)";

    return (
        <div className="w-full relative" ref={wrapperRef}>
            <motion.div animate={controls}>
                {label && (
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mb-2 ml-1 flex items-center gap-1.5 italic leading-none">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-5 h-5" style={{ color: error ? "#f43f5e" : brandColor }} />
                    <Input
                        value={query}
                        onChange={handleChange}
                        onFocus={() => {
                            if (query.length >= 2) setIsOpen(true);
                            if (onClearError) onClearError();
                        }}
                        placeholder={error ? (t("search.flight.errors.required") || "Required") : (placeholder || "City or Airport...")}
                        className={cn(
                            "h-11 min-[760px]:h-14 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-2xl font-black italic transition-all focus:ring-0 focus:border-[var(--brand-color)] focus-visible:ring-0 focus-visible:ring-offset-0",
                            "text-xs min-[760px]:text-sm min-[1200px]:text-base uppercase",
                            error
                                ? "border-rose-500 dark:border-rose-500 address-error-input"
                                : "border-zinc-200 dark:border-zinc-800",
                            "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px] pr-4 shadow-sm"
                        )}
                        style={{ outline: "none" }}
                    />
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {isOpen && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
                    >
                        {suggestions.map((item, i) => (
                            <div
                                key={item.id || i}
                                className="px-4 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                                onClick={() => handleSelect(item)}
                            >
                                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    {item.displayname || item.city || item.shortName || item.id}
                                </span>
                                {item.country && (
                                    <span className="text-xs text-zinc-500">
                                        {item.country}
                                    </span>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
