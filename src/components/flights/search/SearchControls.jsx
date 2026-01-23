import React from "react";
import PassengerPicker from "../ui/PassengerPicker";
import CabinSelector from "./CabinSelector";
import SearchButton from "@/components/common/SearchButton";
import { useLanguage } from "@/context/LanguageContext";

export default function SearchControls({
    passengers,
    setPassengers,
    cabin,
    setCabin,
    loading,
    handleSearch
}) {
    const { t } = useLanguage();
    const rowStyle = "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl p-6 min-[760px]:p-8 rounded-[2rem] sm:rounded-[3rem] border border-transparent shadow-sm transition-all duration-300 my-4";

    return (
        <div className={`grid grid-cols-1 min-[760px]:grid-cols-3 gap-6 sm:gap-4 items-end ${rowStyle}`}>
            <PassengerPicker
                passengers={passengers}
                setPassengers={setPassengers}
            />

            <CabinSelector
                cabin={cabin}
                setCabin={setCabin}
            />

            <SearchButton
                onClick={handleSearch}
                loading={loading}
                label={t("search.flight.searchButton")}
                className="w-full"
            />
        </div>
    );
}
