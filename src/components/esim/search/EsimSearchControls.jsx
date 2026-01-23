import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";
import SearchButton from "@/components/common/SearchButton";
import { useLanguage } from "@/context/LanguageContext";

export default function EsimSearchControls({
    duration, setDuration,
    searching,
    handleSearch
}) {
    const { t } = useLanguage();
    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";
    const selectTriggerStyle = "h-11 lg:h-14 text-xs min-[760px]:text-base font-black italic uppercase rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md shadow-inner outline-none focus:ring-0 focus:border-[var(--brand-color)] transition-all";

    return (
        <div className={`grid grid-cols-1 min-[760px]:grid-cols-3 gap-6 sm:gap-4 items-end ${rowStyle}`}>
            <div className="min-[760px]:col-span-2 flex flex-col text-left gap-2">
                <label className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 ml-1 tracking-[0.2em] italic flex items-center gap-2 leading-none">
                    <Clock size={14} style={{ color: "var(--brand-color)" }} />
                    {t("search.esim.duration")}
                </label>
                <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className={selectTriggerStyle}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl font-black italic uppercase">
                        <SelectItem value="7">7 {t("search.esim.days")}</SelectItem>
                        <SelectItem value="30">30 {t("search.esim.days")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <SearchButton
                onClick={handleSearch}
                loading={searching}
                label={t("search.esim.searchButton")}
                className="w-full"
            />
        </div>
    );
}
