import React from "react";
import PassengerPicker from "../../flights/ui/PassengerPicker";
import SearchButton from "@/components/common/SearchButton";
import { useLanguage } from "@/context/LanguageContext";

export default function HotelSearchControls({
    passengers,
    setPassengers,
    loading,
    handleSearch
}) {
    const { t } = useLanguage();
    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";

    return (
        <div className={`grid grid-cols-1 min-[760px]:grid-cols-3 gap-6 sm:gap-4 items-end ${rowStyle}`}>
            <div className="min-[760px]:col-span-2">
                <PassengerPicker
                    passengers={passengers}
                    setPassengers={setPassengers}
                />
            </div>
            <SearchButton
                onClick={handleSearch}
                loading={loading}
                label={t("search.hotel.searchButton")}
                className="w-full"
            />
        </div>
    );
}
