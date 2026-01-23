import React from "react";
import { useFlightSearchLogic } from "@/hooks/useFlightSearchLogic";

// UI Components
import TripTypePicker from "./ui/TripTypePicker";
import StandardSearch from "./search/StandardSearch";
import MultiCitySearch from "./search/MultiCitySearch";
import SearchControls from "./search/SearchControls";
import SearchErrorAlert from "@/components/common/SearchErrorAlert";

export default function FlightSearch({ onSearchSuccess }) {
  const {
    tripType, setTripType,
    origin, setOrigin,
    destination, setDestination,
    dates, setDates,
    multiCitySegments, setMultiCitySegments,
    cabin, setCabin,
    passengers, setPassengers,
    loading,
    isReturnOpen, setIsReturnOpen,
    isHinflugOpen, setIsHinflugOpen,
    errors, setErrors,
    shakeKey,
    handleSearch
  } = useFlightSearchLogic(onSearchSuccess);

  return (
    <div className="w-full space-y-4 text-zinc-900 dark:text-white">
      {/* 1. Trip Type Auswahl */}
      <div className="w-full min-[760px]:flex min-[760px]:justify-start">
        <TripTypePicker tripType={tripType} setTripType={setTripType} />
      </div>

      <div className="flex flex-col gap-4 md:gap-5">
        {/* 2. Such-Felder (Standard oder Multi-City) */}
        {tripType !== "multi" ? (
          <StandardSearch
            tripType={tripType}
            origin={origin} setOrigin={setOrigin}
            destination={destination} setDestination={setDestination}
            dates={dates} setDates={setDates}
            isHinflugOpen={isHinflugOpen} setIsHinflugOpen={setIsHinflugOpen}
            isReturnOpen={isReturnOpen} setIsReturnOpen={setIsReturnOpen}
            errors={errors} setErrors={setErrors}
            shakeKey={shakeKey}
          />
        ) : (
          <MultiCitySearch
            segments={multiCitySegments}
            setSegments={setMultiCitySegments}
            errors={errors.multiCity || []}
            shakeKey={shakeKey}
          />
        )}

        {/* 3. Passagiere, Klasse & Suche-Button */}
        <SearchControls
          passengers={passengers}
          setPassengers={setPassengers}
          cabin={cabin}
          setCabin={setCabin}
          loading={loading}
          handleSearch={handleSearch}
        />

        {/* 4. Fehlermeldung */}
        <SearchErrorAlert errors={errors} shakeKey={shakeKey} />
      </div>
    </div>
  );
}