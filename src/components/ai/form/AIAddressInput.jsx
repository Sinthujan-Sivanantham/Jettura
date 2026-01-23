import React, { useState, useEffect } from "react";
import { AddressAutofill } from '@mapbox/search-js-react';
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function AIAddressInput({
    label,
    placeholder,
    value,
    onChange,
    error,
    name
}) {
    const { t, language } = useLanguage();
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    const [val, setVal] = useState(value || "");

    useEffect(() => {
        setVal(value || "");
    }, [value]);

    const handleRetrieve = (res) => {
        if (res?.features?.length > 0) {
            const feature = res.features[0];
            const place = feature.properties.place_name || feature.properties.full_address;
            setVal(place);
            if (onChange) {
                onChange(place);
            }
        }
    };

    const handleChange = (e) => {
        setVal(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    const brandColor = "var(--brand-color)";
    const searchLanguage = language === 'de' ? 'de' : 'en';

    return (
        <div className="w-full mb-4">
            {label && (
                <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mb-2 ml-1 flex items-center gap-1.5 italic leading-none">
                    {label}
                </label>
            )}
            <div className="relative">
                <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-5 h-5"
                    style={{ color: error ? "#f43f5e" : brandColor }}
                />

                {/* 
                    AddressAutofill wrapper. 
                    No 'options' with country restrictions ensures GLOBAL search.
                */}
                <AddressAutofill
                    accessToken={token}
                    onRetrieve={handleRetrieve}
                    options={{
                        language: searchLanguage,
                        types: 'country,region,place,locality,district,address'
                    }}
                >
                    <Input
                        name={name || "address"}
                        value={val}
                        onChange={handleChange}
                        placeholder={placeholder || "City, Address..."}
                        autoComplete="off"
                        className={cn(
                            "h-11 min-[760px]:h-14 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-2xl font-black italic transition-all focus:ring-0 focus:border-[var(--brand-color)] focus-visible:ring-0 focus-visible:ring-offset-0",
                            "text-xs min-[760px]:text-sm min-[1200px]:text-base uppercase",
                            error
                                ? "border-rose-500 dark:border-rose-500"
                                : "border-zinc-200 dark:border-zinc-800",
                            "pl-14 min-[760px]:pl-[48px] min-[1200px]:pl-[64px] pr-4 shadow-sm"
                        )}
                        style={{ outline: "none" }}
                    />
                </AddressAutofill>

                {/* 
                   Hidden inputs to help Mapbox Autofill context if needed, 
                   though primarily we use the retrieval from the main input.
                */}
                <div style={{ display: 'none' }}>
                    <input name="city" autoComplete="address-level2" />
                    <input name="country" autoComplete="country-name" />
                </div>
            </div>
        </div>
    );
}
