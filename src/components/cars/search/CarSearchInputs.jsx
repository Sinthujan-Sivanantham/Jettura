import React from "react";
import { motion } from "framer-motion";
import DatePicker from "../../flights/ui/DatePicker";
import CarLocationAutocomplete from "./CarLocationAutocomplete"; // New component
import { useLanguage } from "@/context/LanguageContext";
import { format, addDays, startOfDay } from "date-fns";

export default function CarSearchInputs({
    location, setLocation,
    returnLocation, setReturnLocation,
    differentReturn, setDifferentReturn,
    dates, setDates,
    isStartOpen, setIsStartOpen,
    isEndOpen, setIsEndOpen,
    errors, setErrors,
    shakeKey
}) {
    const { t, language } = useLanguage();
    const brandColor = "var(--brand-color)";

    const today = new Date();
    const nextWeek = addDays(today, 3);
    const datePlaceholderFormat = language === "de" ? "MM.dd.yyyy" : "MM/dd/yyyy";
    const pickupP = format(today, datePlaceholderFormat);
    const returnP = format(nextWeek, datePlaceholderFormat);

    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";

    return (
        <div className={`relative z-40 flex flex-col gap-4 min-[760px]:gap-6 ${rowStyle}`}>
            {/* Different Return Toggle */}
            <div
                className="flex items-center gap-3 min-[760px]:gap-4 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md px-3 py-2 min-[760px]:px-4 min-[760px]:py-3 rounded-xl min-[760px]:rounded-2xl border border-white/10 w-fit mb-2 min-[760px]:mb-4 cursor-pointer hover:bg-white/15 dark:hover:bg-zinc-900/15 transition-all group"
                onClick={() => setDifferentReturn(!differentReturn)}
            >
                <div
                    className="relative w-10 h-5.5 rounded-full transition-all shadow-inner border border-white/10"
                    style={{
                        backgroundColor: differentReturn ? brandColor : "rgba(161, 161, 170, 0.1)",
                    }}
                >
                    <motion.div
                        animate={{ x: differentReturn ? 18 : 3 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                </div>

                <div className="flex flex-col text-[8px] min-[760px]:text-[10px] font-black uppercase italic tracking-[0.1em] text-zinc-700 dark:text-zinc-300 leading-tight transition-colors group-hover:text-[var(--brand-color)]">
                    <span>{t("search.car.differentReturn", "Different Return Location").split(' ').shift()}</span>
                    <span>{t("search.car.differentReturn", "Different Return Location").split(' ').slice(1).join(' ')}</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Locations Row */}
                <div className={`grid grid-cols-1 ${differentReturn ? 'min-[760px]:grid-cols-2' : ''} gap-6 sm:gap-4`}>
                    <CarLocationAutocomplete
                        label={t("search.car.pickup")}
                        placeholder={t("search.car.placeholder")}
                        value={location}
                        error={errors.location}
                        shakeKey={shakeKey}
                        onSelect={(v) => { setLocation(v); setErrors(p => ({ ...p, location: false })); }}
                        onClearError={() => setErrors(p => ({ ...p, location: false }))}
                    />
                    {differentReturn && (
                        <CarLocationAutocomplete
                            label={t("search.car.return")}
                            placeholder={t("search.car.placeholder")}
                            value={returnLocation}
                            error={errors.returnLocation}
                            shakeKey={shakeKey}
                            onSelect={(v) => { setReturnLocation(v); setErrors(p => ({ ...p, returnLocation: false })); }}
                            onClearError={() => setErrors(p => ({ ...p, returnLocation: false }))}
                        />
                    )}
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 min-[760px]:grid-cols-2 gap-6 sm:gap-4">
                    <DatePicker
                        label={t("search.car.pickupDate")}
                        placeholder={pickupP}
                        value={dates.start}
                        error={errors.start}
                        onChange={(v) => {
                            let newEnd = dates.end;
                            if (dates.end && new Date(v) > new Date(dates.end)) {
                                newEnd = "";
                            }
                            setDates({ start: v, end: newEnd });
                            setErrors(p => ({ ...p, start: false }));
                            setTimeout(() => setIsEndOpen(true), 250);
                        }}
                        open={isStartOpen}
                        onOpenChange={(open) => {
                            setIsStartOpen(open);
                            if (open) setErrors(p => ({ ...p, start: false }));
                        }}
                        minDate={startOfDay(new Date())}
                        shakeKey={shakeKey}
                    />
                    <DatePicker
                        label={t("search.car.returnDate")}
                        placeholder={returnP}
                        value={dates.end}
                        error={errors.end}
                        onChange={(v) => { setDates({ ...dates, end: v }); setErrors(p => ({ ...p, end: false })); }}
                        open={isEndOpen}
                        onOpenChange={(open) => {
                            setIsEndOpen(open);
                            if (open) setErrors(p => ({ ...p, end: false }));
                        }}
                        minDate={dates.start ? new Date(dates.start) : startOfDay(new Date())}
                        shakeKey={shakeKey}
                    />
                </div>
            </div>
        </div>
    );
}
