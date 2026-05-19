import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wifi, MapPin } from "lucide-react";
import AirportAutocomplete from "../../flights/ui/AirportAutocomplete";
import { useLanguage } from "@/context/LanguageContext";

export default function EsimSearchInputs({
    destination, setDestination,
    dataVolume, setDataVolume,
    errors, setErrors,
    shakeKey
}) {
    const { t } = useLanguage();
    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";
    const selectTriggerStyle = "h-11 lg:h-14 search-input-text font-black italic uppercase rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md shadow-inner outline-none focus:ring-0 focus:border-[var(--brand-color)] transition-all [&>span]:pr-1.5";

    return (
        <div className={`relative z-40 grid grid-cols-1 min-[760px]:grid-cols-2 gap-x-6 gap-y-4 ${rowStyle}`}>
            <div className="w-full">
                <AirportAutocomplete
                    label={t("search.esim.destination")}
                    placeholder={t("search.esim.placeholder")}
                    value={destination}
                    error={errors.destination}
                    shakeKey={shakeKey}
                    onSelect={(v) => { setDestination(v); setErrors({ destination: false }); }}
                    onClearError={() => setErrors({ destination: false })}
                    icon={<MapPin />}
                />
            </div>
            <div className="flex flex-col text-left gap-2">
                <label className="search-label-text font-black uppercase text-zinc-700 dark:text-zinc-300 ml-1 tracking-[0.2em] italic flex items-center gap-2 leading-none">
                    <Wifi size={14} style={{ color: "var(--brand-color)" }} />
                    {t("search.esim.dataVolume")}
                </label>
                <Select value={dataVolume} onValueChange={setDataVolume}>
                    <SelectTrigger className={selectTriggerStyle}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl font-black italic uppercase">
                        <SelectItem value="1gb">1 {t("search.esim.package")}</SelectItem>
                        <SelectItem value="5gb">5 {t("search.esim.package")}</SelectItem>
                        <SelectItem value="unlimited">{t("search.esim.unlimited")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
