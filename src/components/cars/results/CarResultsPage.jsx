import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarResultCard from "./CarResultCard";
import CarFilterSidebar from "./CarFilterSidebar";
import { Gauge, Users, Fuel, ShieldCheck, ArrowRight, Sparkles, Car, Loader2, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CarResultsPage({ searchData, onBack }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        price: 1000,
        categories: [],
        transmission: [],
        providers: []
    });
    const brandColor = "var(--brand-color)";

    useEffect(() => {
        // Simulierte "Intelligence" Analyse
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500); // Slightly faster
        return () => clearTimeout(timer);
    }, [searchData]);

    // Safely extract offers
    const allOffers = useMemo(() => {
        return Array.isArray(searchData?.offers) ? searchData.offers : [];
    }, [searchData]);

    const filteredOffers = allOffers; // Todo: Implement actual filtering logic

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <Loader2 size={48} className="animate-spin text-[var(--brand-color)]" />
                <div className="text-center space-y-2">
                    <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black italic uppercase tracking-tighter text-zinc-800 dark:text-zinc-200">
                        {t("search.car.loading")}
                    </p>
                    <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">
                        Searching best rates...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            {/* Header / Back Button */}
            <div className="w-full mb-8 px-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onBack}
                        className="group flex items-center gap-3 px-5 py-2.5 mb-6 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95 shadow-sm hover:shadow-md backdrop-blur-xl w-fit"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] italic">{t("nav.back")}</span>
                    </motion.button>
                    <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl md:text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
                        {t("search.car.results.title")}
                    </h2>
                    <p className="text-zinc-500 font-medium text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm mt-1">
                        Found {filteredOffers.length} cars in {searchData.location}
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar (Hidden on mobile for now, or could be a drawer) */}
                <div className="hidden lg:block w-72 flex-shrink-0">
                    <CarFilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        availableCategories={[]}
                        availableProviders={[]}
                    />
                </div>

                {/* Results Grid */}
                <div className="flex-1 space-y-4">
                    {filteredOffers.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            {filteredOffers.map((offer, index) => (
                                <CarResultCard
                                    key={offer.id || index}
                                    offer={offer}
                                    onSelect={() => {}}
                                />
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                            <Car size={48} className="text-zinc-300 mb-4" />
                            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2">No cars found</h3>
                            <p className="text-zinc-500">Try changing your dates or location.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
