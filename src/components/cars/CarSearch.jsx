import React from "react";
import CarSearchInputs from "./search/CarSearchInputs";
import CarSearchControls from "./search/CarSearchControls";
import SearchErrorAlert from "../common/SearchErrorAlert";
import { useCarSearchLogic } from "@/hooks/useCarSearchLogic";

export default function CarSearch({ onSearchSuccess }) {
  const {
    dates, setDates,
    times, setTimes,
    location, setLocation,
    returnLocation, setReturnLocation,
    differentReturn, setDifferentReturn,
    searching,
    isStartOpen, setIsStartOpen,
    isEndOpen, setIsEndOpen,
    errors, setErrors,
    shakeKey,
    handleSearch
  } = useCarSearchLogic(onSearchSuccess);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <CarSearchInputs
        location={location} setLocation={setLocation}
        returnLocation={returnLocation} setReturnLocation={setReturnLocation}
        differentReturn={differentReturn} setDifferentReturn={setDifferentReturn}
        dates={dates} setDates={setDates}
        isStartOpen={isStartOpen} setIsStartOpen={setIsStartOpen}
        isEndOpen={isEndOpen} setIsEndOpen={setIsEndOpen}
        errors={errors} setErrors={setErrors}
        shakeKey={shakeKey}
      />

      <CarSearchControls
        times={times} setTimes={setTimes}
        searching={searching}
        handleSearch={handleSearch}
        shakeKey={shakeKey}
      />

      <SearchErrorAlert errors={errors} shakeKey={shakeKey} />
    </div>
  );
}