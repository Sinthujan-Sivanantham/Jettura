import React, { useState } from "react";
import { AddressAutofill } from '@mapbox/search-js-react';
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

export default function AddressAutocomplete({ label, placeholder, onSelect, value, error, onClearError, shakeKey }) {
    const { t, language } = useLanguage();
    const searchLanguage = language === 'de' ? 'de' : 'en';
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const [val, setVal] = useState(value || "");
    const controls = useAnimation();

    // Handle initial value updates
    React.useEffect(() => {
        if (value) setVal(typeof value === 'object' ? value.fullName : value);
    }, [value]);

    React.useEffect(() => {
        if (error && shakeKey > 0) {
            controls.stop();
            controls.set({ x: 0 });
            controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
        }
    }, [shakeKey, error, controls]);

    const handleRetrieve = (res) => {
        if (res?.features?.length > 0) {
            const feature = res.features[0];
            const p = feature.properties;
            // Versuch die volle Adresse inkl. PLZ zusammenzubauen
            let place = p.full_address || p.place_name || p.name;
            
            if (p.postcode && !place.includes(p.postcode)) {
                place = [p.name, p.address_number ? p.address_number + " " + p.street : p.street, p.postcode, p.place, p.country].filter(Boolean).join(", ");
            }

            // Timeout um Mapbox's eigenes Auto-Fill zu überschreiben
            setTimeout(() => {
                setVal(place);
                if (onSelect) {
                    onSelect({ fullName: place, ...feature });
                }
            }, 50);
        }
    };

    const handleChange = (e) => {
        setVal(e.target.value);
        if (onSelect) onSelect(e.target.value);
    };

    const brandColor = "var(--brand-color)";

    return (
        <div className="w-full">
            <motion.div animate={controls}>
                {label && (
                    <label className="search-label-text font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mb-2 ml-1 flex items-center gap-1.5 italic leading-none">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-5 h-5" style={{ color: error ? "#f43f5e" : brandColor }} />

                    <AddressAutofill
                        accessToken={token}
                        onRetrieve={handleRetrieve}
                        theme={{
                            variables: {
                                fontFamily: 'inherit',
                                unit: 'clamp(0.75rem, 2vw, 1rem)'
                            }
                        }}
                        options={{
                            language: searchLanguage,
                            types: 'country,region,place,locality,district,address'
                        }}
                    >
                        <Input
                            value={val}
                            onChange={handleChange}
                            onFocus={() => {
                                if (onClearError) onClearError();
                            }}
                            autoComplete="address-line1"
                            placeholder={error ? (t("search.flight.errors.required") || "Required") : (placeholder || t("aiPlanner.form.originPlaceholder") || "City, Country...")}
                            className={cn(
                                "h-11 min-[760px]:h-14 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-2xl font-black italic transition-all focus:ring-0 focus:border-[var(--brand-color)] focus-visible:ring-0 focus-visible:ring-offset-0",
                                "search-input-text uppercase",
                                error
                                    ? "border-rose-500 dark:border-rose-500 address-error-input"
                                    : "border-zinc-200 dark:border-zinc-800",
                                "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px] pr-4 shadow-sm"
                            )}
                            style={{ outline: "none" }}
                        />
                    </AddressAutofill>
                </div>
            </motion.div>
        </div>
    );
}
