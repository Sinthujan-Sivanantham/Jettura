import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// import { getFlightPriceCalendar } from "@/services/amadeusApi"; // Removed
import { useLanguage } from "@/context/LanguageContext";

import DatePickerTrigger from "./DatePickerTrigger";
import CalendarView from "./CalendarView";
import FlexibleView from "./FlexibleView";
import IntelligenceBar from "./IntelligenceBar";

export default function DatePicker({
    value, onChange, label, placeholder, origin, destination, disabled, open: externalOpen, onOpenChange: setExternalOpen, error, minDate, shakeKey
}) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("concrete");
    const [priceData, setPriceData] = useState({});
    const [internalOpen, setInternalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const isControlled = externalOpen !== undefined;
    const isOpen = isControlled ? externalOpen : internalOpen;
    const onOpenChangeHandler = isControlled ? setExternalOpen : setInternalOpen;
    const date = value ? new Date(value) : null;
    const brandColor = "var(--brand-color, #3b60ff)";

    useEffect(() => {
        // Price Calendar Logic Disabled due to API Removal
        if (origin && destination && isOpen) {
            // const loadPrices = async () => { ... }
            // Stub:
            setIsSyncing(false);
        }
    }, [origin, destination, isOpen]);

    const handleDateSelect = (d) => {
        if (d) {
            onChange(format(d, "yyyy-MM-dd"));
            onOpenChangeHandler(false);
        }
    };

    return (
        <div className="flex flex-col text-left w-full group relative">
            <Popover open={isOpen} onOpenChange={onOpenChangeHandler}>
                <DatePickerTrigger
                    value={value} label={label} placeholder={placeholder} disabled={disabled}
                    error={error} date={date} brandColor={brandColor}
                    shakeKey={shakeKey}
                />

                <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="w-auto p-0 rounded-[2rem] lg:rounded-[2.8rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] shadow-2xl z-[100001] overflow-hidden mx-auto -translate-x-[10px] w-[300px] sm:w-[350px] lg:w-auto lg:min-w-[600px] lg:translate-x-0"
                >
                    {/* Top Bar: Tabs & Legend */}
                    <div className="p-2 lg:p-5 border-b dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/30 flex flex-col sm:flex-row justify-between items-center gap-2 lg:gap-4 px-3 lg:px-8">
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border dark:border-zinc-800 w-full lg:w-auto">
                            <button
                                onClick={() => setActiveTab("concrete")}
                                className={cn(
                                    "flex-1 lg:flex-none px-3 lg:px-6 py-2 search-input-text font-black uppercase italic rounded-lg transition-all",
                                    activeTab === "concrete" ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-zinc-400"
                                )}
                                style={activeTab === "concrete" ? { color: brandColor } : {}}
                            >
                                {t("search.flight.concrete")}
                            </button>
                            <button
                                onClick={() => setActiveTab("flexible")}
                                className={cn(
                                    "flex-1 lg:flex-none px-3 lg:px-6 py-2 search-input-text font-black uppercase italic rounded-lg transition-all",
                                    activeTab === "flexible" ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-zinc-400"
                                )}
                                style={activeTab === "flexible" ? { color: brandColor } : {}}
                            >
                                {t("search.flight.flexible")}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 lg:p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === "concrete" ? (
                                <CalendarView
                                    date={date} handleDateSelect={handleDateSelect}
                                    brandColor={brandColor} priceData={priceData}
                                    minDate={minDate}
                                />
                            ) : (
                                <FlexibleView
                                    date={date} handleDateSelect={handleDateSelect}
                                    brandColor={brandColor}
                                    minDate={minDate}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <IntelligenceBar
                        isSyncing={isSyncing} brandColor={brandColor}
                        onConfirm={() => onOpenChangeHandler(false)}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
