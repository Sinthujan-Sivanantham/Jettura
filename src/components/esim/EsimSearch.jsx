import React from "react";
import EsimSearchInputs from "./search/EsimSearchInputs";
import EsimSearchControls from "./search/EsimSearchControls";
import SearchErrorAlert from "../common/SearchErrorAlert";
import { useEsimSearchLogic } from "@/hooks/useEsimSearchLogic";

export default function EsimSearch({ onSearchSuccess }) {
  const {
    destination, setDestination,
    dataVolume, setDataVolume,
    duration, setDuration,
    searching,
    errors, setErrors,
    shakeKey,
    handleSearch
  } = useEsimSearchLogic(onSearchSuccess);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <EsimSearchInputs
        destination={destination}
        setDestination={setDestination}
        dataVolume={dataVolume}
        setDataVolume={setDataVolume}
        errors={errors}
        setErrors={setErrors}
        shakeKey={shakeKey}
      />

      <EsimSearchControls
        duration={duration}
        setDuration={setDuration}
        searching={searching}
        handleSearch={handleSearch}
      />

      <SearchErrorAlert errors={errors} shakeKey={shakeKey} />
    </div>
  );
}