import React from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Fuel, Gauge, Car, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CarFilterSidebar({ filters, setFilters, availableCategories, availableProviders }) {
    const { t } = useLanguage();
    const brandColor = "var(--brand-color)";

    const toggleFilter = (key, value) => {
        setFilters(prev => {
            const current = prev[key] || [];
            if (current.includes(value)) {
                return { ...prev, [key]: current.filter(v => v !== value) };
            }
            return { ...prev, [key]: [...current, value] };
        });
    };

    return (
        <div className="w-full lg:w-80 space-y-8">
            {/* PRICE FILTER */}
            <div className="bg-white dark:bg-zinc-900/50 p-7 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 italic flex items-center gap-2">
                    {t("filters.maxPrice")} <span className="text-zinc-900 dark:text-white ml-auto">{filters.price}€</span>
                </h3>
                <Slider
                    value={[filters.price]}
                    max={1000}
                    step={10}
                    onValueChange={(val) => setFilters({ ...filters, price: val[0] })}
                />
                <div className="flex justify-between mt-4 text-[9px] font-bold text-zinc-400 uppercase italic">
                    <span>0€</span>
                    <span>1000€+</span>
                </div>
            </div>

            {/* CATEGORY FILTER */}
            <div className="bg-white dark:bg-zinc-900/50 p-7 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 italic flex items-center gap-2">
                    {t("search.car.results.seats")}
                </h3>
                <div className="space-y-4">
                    {availableCategories.map((cat) => (
                        <div key={cat} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleFilter('categories', cat)}>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={filters.categories.includes(cat)}
                                    onCheckedChange={() => toggleFilter('categories', cat)}
                                />
                                <span className="text-[11px] font-black uppercase italic text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors capitalize">
                                    {cat.toLowerCase()}
                                </span>
                            </div>
                            <Car size={14} className="text-zinc-300 dark:text-zinc-700" />
                        </div>
                    ))}
                </div>
            </div>

            {/* TRANSMISSION FILTER */}
            <div className="bg-white dark:bg-zinc-900/50 p-7 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 italic flex items-center gap-2">
                    {t("filters.stops")}
                </h3>
                <div className="space-y-4">
                    {[
                        { id: 'AUTOMATIC', label: t("search.car.results.transmission.automatic") },
                        { id: 'MANUAL', label: t("search.car.results.transmission.manual") }
                    ].map((type) => (
                        <div key={type.id} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleFilter('transmission', type.id)}>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={filters.transmission.includes(type.id)}
                                    onCheckedChange={() => toggleFilter('transmission', type.id)}
                                />
                                <span className="text-[11px] font-black uppercase italic text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                    {type.label}
                                </span>
                            </div>
                            <Gauge size={14} className="text-zinc-300 dark:text-zinc-700" />
                        </div>
                    ))}
                </div>
            </div>

            {/* PROVIDER FILTER */}
            <div className="bg-white dark:bg-zinc-900/50 p-7 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 italic flex items-center gap-2">
                    {t("filters.airlines")}
                </h3>
                <div className="space-y-4">
                    {availableProviders.map((provider) => (
                        <div key={provider} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleFilter('providers', provider)}>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={filters.providers.includes(provider)}
                                    onCheckedChange={() => toggleFilter('providers', provider)}
                                />
                                <span className="text-[11px] font-black uppercase italic text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                    {provider}
                                </span>
                            </div>
                            <Briefcase size={14} className="text-zinc-300 dark:text-zinc-700" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
