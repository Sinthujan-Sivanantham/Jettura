import React from "react";
import DatePicker from "../../flights/ui/DatePicker";
import CityAutocomplete from "../ui/CityAutocomplete";
import { useLanguage } from "@/context/LanguageContext";
import { format, addDays, startOfDay } from "date-fns";

import { MapPin } from "lucide-react";

export default function HotelSearchInputs({
    destination,
    setDestination,
    dates,
    setDates,
    isStartOpen,
    setIsStartOpen,
    isEndOpen,
    setIsEndOpen,
    errors,
    setErrors,
    shakeKey
}) {
    const { t, language } = useLanguage();

    const today = new Date();
    const tomorrow = addDays(today, 1);
    const datePlaceholderFormat = language === "de" ? "dd.MM.yyyy" : "MM/dd/yyyy";
    const checkInP = format(today, datePlaceholderFormat);
    const checkOutP = format(tomorrow, datePlaceholderFormat);

    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";

    return (
        <div className={`relative z-40 grid grid-cols-1 min-[760px]:grid-cols-2 gap-x-6 gap-y-4 ${rowStyle}`}>
            <div className="min-[760px]:col-span-2">
                <CityAutocomplete
                    label={t("search.hotel.destination")}
                    placeholder={t("search.hotel.destinationPlaceholder")}
                    value={destination}
                    onSelect={(v) => {
                        setDestination(v);
                        setErrors(p => ({ ...p, destination: false }));
                    }}
                    error={errors.destination}
                    shakeKey={shakeKey}
                />
            </div>

            <DatePicker
                label={t("search.hotel.checkIn")}
                placeholder={checkInP}
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
                onOpenChange={setIsStartOpen}
                minDate={startOfDay(new Date())}
                shakeKey={shakeKey}
            />
            <DatePicker
                label={t("search.hotel.checkOut")}
                placeholder={checkOutP}
                value={dates.end}
                error={errors.end}
                onChange={(v) => {
                    setDates({ ...dates, end: v });
                    setErrors(p => ({ ...p, end: false }));
                }}
                open={isEndOpen}
                onOpenChange={setIsEndOpen}
                minDate={dates.start ? new Date(dates.start) : startOfDay(new Date())}
                shakeKey={shakeKey}
            />
        </div>
    );
}
