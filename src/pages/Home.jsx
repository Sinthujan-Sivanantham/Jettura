import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LandingView from "@/components/home/landing/HomeLanding";
import FlightResultsPage from "@/components/flights/results/FlightResultsPage";
import HotelResultsPage from "@/components/hotels/results/HotelResultsPage";
import CarResultsPage from "@/components/cars/results/CarResultsPage";
import ESIMResultsPage from "@/components/esim/ESIMResultsPage";

export default function Home() {
  const [searchResult, setSearchResult] = useState(() => {
    const saved = localStorage.getItem("jettura-search-results");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.type || Array.isArray(parsed?.data)) return parsed;
      } catch (e) {
        console.error("Storage Error", e);
      }
    }
    return null;
  });

  const handleSearchSuccess = (res) => {
    setSearchResult(res);
    try {
      localStorage.setItem("jettura-search-results", JSON.stringify(res));
    } catch (e) {
      console.warn("Storage quota exceeded. Clearing old results and retrying...");
      try {
        localStorage.removeItem("jettura-search-results");
        localStorage.setItem("jettura-search-results", JSON.stringify(res));
      } catch (retryError) {
        console.error("Could not persist search results:", retryError);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setSearchResult(null);
    localStorage.removeItem("jettura-search-results");
  };

  const renderResults = () => {
    if (!searchResult) return null;
    switch (searchResult.type) {
      case "hotels":
        return <HotelResultsPage hotels={searchResult.hotels || []} onBack={handleReset} />;
      case "cars":
        return <CarResultsPage searchData={searchResult.data} onBack={handleReset} />;
      case "esim":
        return <ESIMResultsPage searchData={searchResult.data} onBack={handleReset} />;
      default:
        return (
          <FlightResultsPage
            flights={searchResult.data || []}
            dictionaries={searchResult.dictionaries || {}}
            onBack={handleReset}
          />
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen">
      <AnimatePresence mode="wait">
        {!searchResult ? (
          <LandingView onSearchSuccess={handleSearchSuccess} />
        ) : (
          <div key="results-container">
            {renderResults()}
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
