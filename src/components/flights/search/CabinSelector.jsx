import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

export default function CabinSelector({ cabin, setCabin }) {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col text-left gap-2">
            <label className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 ml-1 tracking-[0.2em] italic leading-none">
                {t("search.flight.class")}
            </label>
            <Select value={cabin} onValueChange={setCabin}>
                <SelectTrigger className="h-11 lg:h-14 text-xs min-[760px]:text-base font-black italic uppercase rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md shadow-inner outline-none">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl font-black italic uppercase text-xs">
                    <SelectItem value="ECONOMY">{t("search.flight.details.cabins.ECONOMY")}</SelectItem>
                    <SelectItem value="BUSINESS">{t("search.flight.details.cabins.BUSINESS")}</SelectItem>
                    <SelectItem value="FIRST">{t("search.flight.details.cabins.FIRST")}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
