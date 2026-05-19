import React, { useState } from "react";
import HotelResultCard from "./HotelResultCard";
import { ShieldCheck, Filter, ArrowLeft, Sparkles, Star, DollarSign, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function HotelResultsPage({ hotels = [], onBack }) {
    const { t, language } = useLanguage();
    const brandColor = "var(--brand-color)";

    // Filter State
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 10000,
        minRating: 0,
        maxDistance: 50,
        hasPrice: null // null = all, true = with price, false = without price
    });

    // Apply Filters
    const filteredHotels = hotels.filter(hotel => {
        // Price filter
        if (filters.hasPrice === true && !hotel.price) return false;
        if (filters.hasPrice === false && hotel.price) return false;

        if (hotel.price) {
            const price = hotel.price.total || hotel.price.base || 0;
            if (price < filters.minPrice || price > filters.maxPrice) return false;
        }

        // Rating filter
        if (hotel.rating < filters.minRating) return false;

        // Distance filter
        if (hotel.distance?.value && hotel.distance.value > filters.maxDistance) return false;

        return true;
    });

    // Get price range from hotels
    const priceRange = hotels.reduce((acc, hotel) => {
        if (hotel.price?.total) {
            const price = hotel.price.total;
            return {
                min: Math.min(acc.min, price),
                max: Math.max(acc.max, price)
            };
        }
        return acc;
    }, { min: Infinity, max: 0 });

    const hasValidPriceRange = priceRange.min !== Infinity;

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#050505] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* PREMIUM HEADER */}
                <div className="w-full mb-16 px-4">
                    <div className="flex justify-between items-center mb-10">
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={onBack}
                            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95 shadow-sm hover:shadow-md backdrop-blur-xl"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] italic">{t("nav.back") || "Zurück"}</span>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[var(--brand-color)]/10 border border-[var(--brand-color)]/20 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] font-black uppercase italic tracking-widest"
                            style={{ color: brandColor }}
                        >
                            <ShieldCheck size={14} fill="currentColor" className="opacity-20" />
                            <Sparkles size={12} className="animate-pulse" />
                            GDS Synchronized
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center space-y-4"
                    >
                        <div className="inline-flex flex-col items-center">
                            <h1 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-3xl md:text-4xl sm:text-5xl lg:text-5xl xl:text-7xl font-black italic uppercase tracking-wide text-zinc-900 dark:text-white leading-[0.9] mb-4">
                                Intelligence <span style={{ color: brandColor }}>{t("search.tabs.hotels") || "Hotels"}</span>
                            </h1>
                            <div className="h-1.5 w-24 bg-[var(--brand-color)] rounded-full mb-6 opacity-30 blur-[1px]" />
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-8 sm:w-16 bg-zinc-200 dark:bg-zinc-800" />
                            <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] italic">
                                {filteredHotels.length} {language === "de" ? "Unterkünfte gefunden" : "Hotels found"}
                            </p>
                            <div className="h-[1px] w-8 sm:w-16 bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 xl:gap-10">
                    {/* SIDEBAR Filter */}
                    <aside className="w-full lg:w-60 xl:w-72 space-y-5 shrink-0">
                        <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.2rem] shadow-sm sticky top-8">
                            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] font-black uppercase italic mb-6 flex items-center gap-2" style={{ color: brandColor }}>
                                <Filter size={12} /> Intelligence Filter
                            </h3>

                            {/* Price Filter */}
                            {hasValidPriceRange && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <DollarSign size={12} className="text-zinc-400" />
                                        <label className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase italic text-zinc-600 dark:text-zinc-400">
                                            {language === "de" ? "Preis" : "Price"}
                                        </label>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[7px] sm:text-[8px] sm:text-[9px] text-zinc-500 mb-1 block">
                                                {language === "de" ? "Max" : "Max"}: {filters.maxPrice} EUR
                                            </label>
                                            <input
                                                type="range"
                                                min={Math.floor(priceRange.min)}
                                                max={Math.ceil(priceRange.max)}
                                                value={filters.maxPrice}
                                                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    accentColor: brandColor
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Star size={12} className="text-zinc-400" />
                                    <label className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase italic text-zinc-600 dark:text-zinc-400">
                                        {language === "de" ? "Bewertung" : "Rating"}
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    {[0, 3, 4, 5].map(rating => (
                                        <button
                                            key={rating}
                                            onClick={() => setFilters({ ...filters, minRating: rating })}
                                            className={`flex-1 py-2 px-3 rounded-xl text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black italic uppercase transition-all ${filters.minRating === rating
                                                ? 'text-white shadow-lg'
                                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                                }`}
                                            style={filters.minRating === rating ? { backgroundColor: brandColor } : {}}
                                        >
                                            {rating === 0 ? (language === "de" ? "Alle" : "All") : `${rating}★`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Distance Filter */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin size={12} className="text-zinc-400" />
                                    <label className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase italic text-zinc-600 dark:text-zinc-400">
                                        {language === "de" ? "Entfernung" : "Distance"}
                                    </label>
                                </div>
                                <div>
                                    <label className="text-[7px] sm:text-[8px] sm:text-[9px] text-zinc-500 mb-1 block">
                                        {language === "de" ? "Max" : "Max"}: {filters.maxDistance} KM
                                    </label>
                                    <input
                                        type="range"
                                        min={1}
                                        max={50}
                                        value={filters.maxDistance}
                                        onChange={(e) => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            accentColor: brandColor
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Price Availability Filter */}
                            <div className="mb-6">
                                <label className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase italic text-zinc-600 dark:text-zinc-400 mb-3 block">
                                    {language === "de" ? "Verfügbarkeit" : "Availability"}
                                </label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setFilters({ ...filters, hasPrice: null })}
                                        className={`w-full py-2 px-3 rounded-xl text-[7px] sm:text-[8px] sm:text-[9px] font-black italic uppercase transition-all ${filters.hasPrice === null
                                            ? 'text-white shadow-lg'
                                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                            }`}
                                        style={filters.hasPrice === null ? { backgroundColor: brandColor } : {}}
                                    >
                                        {language === "de" ? "Alle Hotels" : "All Hotels"}
                                    </button>
                                    <button
                                        onClick={() => setFilters({ ...filters, hasPrice: true })}
                                        className={`w-full py-2 px-3 rounded-xl text-[7px] sm:text-[8px] sm:text-[9px] font-black italic uppercase transition-all ${filters.hasPrice === true
                                            ? 'text-white shadow-lg'
                                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                            }`}
                                        style={filters.hasPrice === true ? { backgroundColor: brandColor } : {}}
                                    >
                                        {language === "de" ? "Mit Preis" : "With Price"}
                                    </button>
                                    <button
                                        onClick={() => setFilters({ ...filters, hasPrice: false })}
                                        className={`w-full py-2 px-3 rounded-xl text-[7px] sm:text-[8px] sm:text-[9px] font-black italic uppercase transition-all ${filters.hasPrice === false
                                            ? 'text-white shadow-lg'
                                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                            }`}
                                        style={filters.hasPrice === false ? { backgroundColor: brandColor } : {}}
                                    >
                                        {language === "de" ? "Ohne Preis" : "Without Price"}
                                    </button>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={() => setFilters({
                                    minPrice: 0,
                                    maxPrice: 10000,
                                    minRating: 0,
                                    maxDistance: 50,
                                    hasPrice: null
                                })}
                                className="w-full py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black italic uppercase hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
                            >
                                {language === "de" ? "Filter Zurücksetzen" : "Reset Filters"}
                            </button>
                        </div>
                    </aside>

                    {/* RESULTS LIST */}
                    <div className="flex-1 space-y-4">
                        {filteredHotels.length > 0 ? (
                            filteredHotels.map((hotel, idx) => (
                                <motion.div
                                    key={hotel.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <HotelResultCard hotel={hotel} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-32 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/20">
                                <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-black uppercase italic text-zinc-400 tracking-widest">
                                    {language === "de" ? "Keine Hotels gefunden." : "No hotels found."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}