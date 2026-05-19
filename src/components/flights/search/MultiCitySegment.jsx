import React from "react";
import { motion } from "framer-motion";
import { Trash2, PlaneTakeoff, PlaneLanding } from "lucide-react";
import { format } from "date-fns";
import AirportAutocomplete from "../ui/AirportAutocomplete";
import DatePicker from "../ui/DatePicker";
import { useLanguage } from "@/context/LanguageContext";

export default function MultiCitySegment({
    seg,
    index,
    totalSegments,
    onUpdate,
    onRemove,
    errors,
    shakeKey
}) {
    const { t, language } = useLanguage();
    const today = format(new Date(), language === "de" ? "MM.dd.yyyy" : "MM/dd/yyyy");
    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300";

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col gap-2 mb-6 ${rowStyle}`}
            style={{ zIndex: (totalSegments - index) * 10 }}
        >
            {/* Row 1: Route Header Centered */}
            <div className="flex items-center justify-center relative mb-2">
                <span
                    className="search-label-text font-black uppercase italic tracking-[0.15em] px-4 min-[760px]:px-6 py-1.5 min-[760px]:py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-sm transition-all"
                    style={{
                        color: "var(--brand-color)",
                        backgroundColor: "rgba(var(--brand-color-rgb), 0.1)",
                    }}
                >
                    Route {index + 1}
                </span>
                {totalSegments > 2 && (
                    <button
                        onClick={onRemove}
                        className="absolute right-0 p-2 text-zinc-400 hover:text-rose-500 transition-all font-bold"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Main Grid: Columns for Origin and Destination */}
            <div className="grid grid-cols-1 min-[760px]:grid-cols-2 gap-4 sm:gap-6 w-full">
                {/* Left Column: Origin & Date (Desktop) */}
                <div className="flex flex-col gap-4">
                    <AirportAutocomplete
                        label={t("search.flight.origin")}
                        placeholder={t("search.flight.originPlaceholder")}
                        icon={<PlaneTakeoff size={20} style={{ color: "var(--brand-color)" }} />}
                        value={seg.origin}
                        onSelect={(v) => onUpdate(index, "origin", v)}
                        error={errors.origin}
                        shakeKey={shakeKey}
                    />
                    <div className="hidden min-[760px]:block">
                        <DatePicker
                            label={t("search.flight.date")}
                            placeholder={today}
                            tripType="multi"
                            value={seg.date}
                            onChange={(v) => onUpdate(index, "date", v)}
                            error={errors.date}
                            shakeKey={shakeKey}
                        />
                    </div>
                </div>

                {/* Right Column: Destination & Date (Mobile) */}
                <div className="flex flex-col gap-4">
                    <AirportAutocomplete
                        label={t("search.flight.destination")}
                        placeholder={t("search.flight.destinationPlaceholder")}
                        icon={<PlaneLanding size={20} style={{ color: "var(--brand-color)" }} />}
                        value={seg.destination}
                        onSelect={(v) => onUpdate(index, "destination", v)}
                        error={errors.destination}
                        shakeKey={shakeKey}
                    />
                    <div className="min-[760px]:hidden">
                        <DatePicker
                            label={t("search.flight.date")}
                            placeholder={today}
                            tripType="multi"
                            value={seg.date}
                            onChange={(v) => onUpdate(index, "date", v)}
                            error={errors.date}
                            shakeKey={shakeKey}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
