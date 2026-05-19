import React from "react";
import { motion } from "framer-motion";
import { Users, Fuel, Gauge, Check, Star, Shield, Car as CarIcon, ArrowRight } from "lucide-react";

export default function CarResultCard({ offer, onSelect }) {
    const { car, provider, price } = offer;

    // Fallback images based on category (Generic placeholders)
    const getCarImage = (cat) => {
        const category = cat?.toUpperCase() || "";
        if (category.includes("SUV")) return "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80"; // SUV
        if (category.includes("LUX")) return "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=600&q=80"; // Luxury
        if (category.includes("VAN")) return "https://images.unsplash.com/photo-1632245889029-e41bf26d3656?auto=format&fit=crop&w=600&q=80"; // Van
        return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80"; // Compact/Economy
    };

    const imageUrl = offer.imageUrl || getCarImage(car.category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
        >
            {/* Image Section */}
            <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <img
                    src={imageUrl}
                    alt={car.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                        {car.category || "Standard"}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{provider.companyName}</span>
                                <div className="flex items-center text-amber-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] gap-0.5">
                                    <Star size={10} fill="currentColor" />
                                    <span className="text-zinc-500 font-medium">9.2</span>
                                </div>
                            </div>
                            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter leading-tight">
                                {car.description}
                            </h3>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                            <Shield size={10} />
                            Full Insurance
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 my-4">
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs">
                            <Gauge size={14} className="text-zinc-400" />
                            <span>Unlimited mileage</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs">
                            <Users size={14} className="text-zinc-400" />
                            <span>5 Seats</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs">
                            <Fuel size={14} className="text-zinc-400" />
                            <span>Full to Full</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs">
                            {/* Auto/Manual Icon */}
                            <span className="font-bold border border-zinc-200 dark:border-zinc-700 px-1.5 rounded-[4px] text-[7px] sm:text-[8px] sm:text-[9px] uppercase">
                                {car.transmissionType === "AUTOMATIC" ? "Auto" : "Manual"}
                            </span>
                            <span>Transmission</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Price */}
                {/* Footer / Price */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 gap-4 sm:gap-0">
                    <div className="flex flex-col w-full sm:w-auto text-center sm:text-left">
                        <span className="text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] uppercase font-black italic tracking-[0.2em] mb-1">Total Price</span>
                        <div className="flex items-baseline justify-center sm:justify-start gap-1">
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl md:text-3xl font-black italic text-[var(--brand-color)] tracking-tighter">{Math.ceil(price.total)}</span>
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold uppercase opacity-60">{price.currency}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => onSelect(offer)}
                            className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] tracking-[0.15em] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Info size={14} strokeWidth={2.5} style={{ color: "var(--brand-color)" }} />
                            <span>DETAILS</span>
                        </button>

                        <button
                            onClick={() => onSelect(offer)}
                            className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] tracking-[0.15em] shadow-lg hover:shadow-xl active:scale-95 transition-all relative overflow-hidden group/btn bg-[var(--brand-color)] flex items-center justify-center gap-2"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10">BOOK NOW</span>
                            <ArrowRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
