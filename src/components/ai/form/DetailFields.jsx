import React from "react";
import { Controller } from "react-hook-form";
import { Clock, Users, Briefcase } from "lucide-react";
import DatePicker from "../../flights/ui/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

export default function DetailFields({ control, errors, rowStyle, inputStyle }) {
    const { t } = useLanguage();
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 items-end ${rowStyle}`}>
            {/* Start Date */}
            <div className="w-full">
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label={t("aiPlanner.form.date")}
                            placeholder={t("aiPlanner.form.datePlaceholder")}
                            value={field.value}
                            onChange={(v) => field.onChange(v)}
                            error={!!errors.date}
                            minDate={new Date()}
                        />
                    )}
                />
            </div>

            {/* Days */}
            <div className="flex flex-col text-left gap-2">
                <label className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 ml-1 tracking-[0.2em] italic flex items-center gap-2 leading-none">
                    <Clock size={14} style={{ color: "var(--brand-color)" }} /> {t("aiPlanner.form.days")}
                </label>
                <input
                    type="number"
                    {...control.register("days")}
                    className={inputStyle}
                />
            </div>

            {/* Passengers */}
            <div className="flex flex-col text-left gap-2">
                <label className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 ml-1 tracking-[0.2em] italic flex items-center gap-2 leading-none">
                    <Users size={14} style={{ color: "var(--brand-color)" }} /> {t("aiPlanner.form.passengers")}
                </label>
                <input
                    type="number"
                    {...control.register("passengers")}
                    className={inputStyle}
                />
            </div>

            {/* Class */}
            <div className="flex flex-col text-left gap-2">
                <label className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 ml-1 tracking-[0.2em] italic flex items-center gap-2 leading-none">
                    <Briefcase size={14} style={{ color: "var(--brand-color)" }} /> {t("aiPlanner.form.class")}
                </label>
                <Controller
                    name="travelClass"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={inputStyle}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl font-black italic uppercase">
                                <SelectItem value="Economy">{t("search.flight.details.cabins.ECONOMY")}</SelectItem>
                                <SelectItem value="Business">{t("search.flight.details.cabins.BUSINESS")}</SelectItem>
                                <SelectItem value="First Class">{t("search.flight.details.cabins.FIRST")}</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    );
}
