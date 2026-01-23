import React from "react";
import HotelSearchInputs from "./search/HotelSearchInputs";
import HotelSearchControls from "./search/HotelSearchControls";
import SearchErrorAlert from "../common/SearchErrorAlert";
import { useHotelSearchLogic } from "@/hooks/useHotelSearchLogic";

export default function HotelSearch({ onSearchSuccess }) {
    const {
        dates, setDates,
        destination, setDestination,
        passengers, setPassengers,
        loading,
        isStartOpen, setIsStartOpen,
        isEndOpen, setIsEndOpen,
        errors, setErrors,
        shakeKey,
        handleSearch
    } = useHotelSearchLogic(onSearchSuccess);

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <HotelSearchInputs
                destination={destination}
                setDestination={setDestination}
                dates={dates}
                setDates={setDates}
                isStartOpen={isStartOpen}
                setIsStartOpen={setIsStartOpen}
                isEndOpen={isEndOpen}
                setIsEndOpen={setIsEndOpen}
                errors={errors}
                setErrors={setErrors}
                shakeKey={shakeKey}
            />

            <HotelSearchControls
                passengers={passengers}
                setPassengers={setPassengers}
                loading={loading}
                handleSearch={handleSearch}
            />

            <SearchErrorAlert errors={errors} shakeKey={shakeKey} />
        </div>
    );
}