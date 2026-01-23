import React from "react";
import TimePicker from "../../flights/ui/TimePicker";
import SearchButton from "@/components/common/SearchButton";
import { useLanguage } from "@/context/LanguageContext";

export default function CarSearchControls({
    times, setTimes,
    searching,
    handleSearch,
    shakeKey
}) {
    const { t } = useLanguage();
    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";

    return (
        <div className={`grid grid-cols-1 min-[760px]:grid-cols-3 gap-6 sm:gap-4 items-end ${rowStyle}`}>
            <TimePicker
                label={t("search.car.pickupTime")}
                value={times.pickup}
                onChange={(v) => setTimes({ ...times, pickup: v })}
                shakeKey={shakeKey}
            />
            <TimePicker
                label={t("search.car.returnTime")}
                value={times.return}
                onChange={(v) => setTimes({ ...times, return: v })}
                shakeKey={shakeKey}
            />
            <SearchButton
                onClick={handleSearch}
                loading={searching}
                label={searching ? t("search.car.analyzing") : t("search.car.searchButton")}
                className="w-full"
            />
        </div>
    );
}
