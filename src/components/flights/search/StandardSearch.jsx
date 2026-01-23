import React from "react";
import { PlaneTakeoff, PlaneLanding } from "lucide-react";
import AirportAutocomplete from "../ui/AirportAutocomplete";
import DatePicker from "../ui/DatePicker";
import { useLanguage } from "@/context/LanguageContext";
import { format, addDays, startOfDay } from "date-fns";



export default function StandardSearch({
    tripType,
    origin,
    setOrigin,
    destination,
    setDestination,
    dates,
    setDates,
    isHinflugOpen,
    setIsHinflugOpen,
    isReturnOpen,
    setIsReturnOpen,
    errors,
    setErrors,
    shakeKey
}) {
    const { t, language } = useLanguage();
    const datePlaceholderFormat = language === "de" ? "dd.MM.yyyy" : "MM/dd/yyyy";
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const outboundP = format(today, datePlaceholderFormat);
    const inboundP = format(nextWeek, datePlaceholderFormat);

    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";

    return (
        <div className={`relative z-40 grid grid-cols-1 min-[760px]:grid-cols-2 gap-x-6 gap-y-4 ${rowStyle}`}>
            <AirportAutocomplete
                label={t("search.flight.origin")}
                placeholder={t("search.flight.originPlaceholder")}
                icon={<PlaneTakeoff size={20} style={{ color: "var(--brand-color)" }} />}
                value={origin}
                onSelect={setOrigin}
                error={errors.origin}
                shakeKey={shakeKey}
                onClearError={() => setErrors(prev => ({ ...prev, origin: false }))}
            />
            <AirportAutocomplete
                label={t("search.flight.destination")}
                placeholder={t("search.flight.destinationPlaceholder")}
                icon={<PlaneLanding size={20} style={{ color: "var(--brand-color)" }} />}
                value={destination}
                onSelect={setDestination}
                error={errors.destination}
                shakeKey={shakeKey}
                onClearError={() => setErrors(prev => ({ ...prev, destination: false }))}
            />

            <div className="grid grid-cols-1 min-[760px]:grid-cols-2 gap-6 sm:gap-4 min-[760px]:col-span-2">
                <DatePicker
                    label={t("search.flight.outbound")}
                    placeholder={outboundP}
                    tripType={tripType}
                    origin={origin} destination={destination} value={dates.start}
                    open={isHinflugOpen} onOpenChange={(open) => {
                        setIsHinflugOpen(open);
                        if (open) setErrors(prev => ({ ...prev, start: false }));
                    }}
                    error={errors.start}
                    onChange={(v) => {
                        let newEnd = dates.end;
                        if (dates.end && new Date(v) > new Date(dates.end)) {
                            newEnd = "";
                        }
                        setDates({ start: v, end: newEnd });
                        if (tripType === "roundtrip") setTimeout(() => setIsReturnOpen(true), 250);
                    }}
                    minDate={startOfDay(new Date())}
                    shakeKey={shakeKey}
                />
                {tripType === "roundtrip" ? (
                    <DatePicker
                        label={t("search.flight.inbound")}
                        placeholder={inboundP}
                        tripType={tripType}
                        origin={destination} destination={origin} value={dates.end}
                        open={isReturnOpen} onOpenChange={(open) => {
                            setIsReturnOpen(open);
                            if (open) setErrors(prev => ({ ...prev, end: false }));
                        }}
                        onChange={(v) => setDates({ ...dates, end: v })}
                        error={errors.end}
                        minDate={dates.start ? new Date(dates.start) : startOfDay(new Date())}
                        shakeKey={shakeKey}
                    />
                ) : (
                    <div className="hidden min-[760px]:block" />
                )}
            </div>
        </div>
    );
}
