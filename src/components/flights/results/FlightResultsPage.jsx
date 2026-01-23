import React, { useState, useMemo } from "react";
import FlightFilterSidebar from "./FlightFilterSidebar";
import FlightResultCard from "./FlightResultCard";
import FlightResultsHeader from "./ui/FlightResultsHeader";
import FlightResultsEmptyState from "./ui/FlightResultsEmptyState";
import { motion, AnimatePresence } from "framer-motion";

export default function FlightResultsPage({ flights = [], dictionaries = {}, onBack }) {
  // 1. FILTER STATE
  const [filters, setFilters] = useState({
    price: 3000,
    stops: [],
    time: [0, 24],
    airlines: []
  });

  // Extract unique airlines from active flights
  const availableAirlines = useMemo(() => {
    const airlines = new Set();
    flights.forEach(f => {
      f.itineraries.forEach(i => {
        i.segments.forEach(s => airlines.add(s.carrierCode));
      });
    });
    return Array.from(airlines);
  }, [flights]);

  // 2. FILTER LOGIK
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const price = parseFloat(flight.price.total);
      const stopCount = flight.itineraries[0].segments.length - 1;
      const depHour = new Date(flight.itineraries[0].segments[0].departure.at).getHours();
      const flightAirlines = flight.itineraries.flatMap(i => i.segments.map(s => s.carrierCode));

      if (price > filters.price) return false;
      if (filters.stops.length > 0) {
        const stopKey = stopCount >= 2 ? "2" : stopCount.toString();
        if (!filters.stops.includes(stopKey)) return false;
      }
      if (depHour < filters.time[0] || depHour > filters.time[1]) return false;

      if (filters.airlines.length > 0) {
        const hasSelectedAirline = flightAirlines.some(code => filters.airlines.includes(code));
        if (!hasSelectedAirline) return false;
      }

      return true;
    });
  }, [flights, filters]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#050505] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <FlightResultsHeader count={filteredFlights.length} onBack={onBack} />

        <div className="flex flex-col lg:flex-row gap-6 xl:gap-10">

          <FlightFilterSidebar
            filters={filters}
            setFilters={setFilters}
            availableAirlines={availableAirlines}
            dictionaries={dictionaries}
          />

          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight, index) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FlightResultCard flight={flight} dictionaries={dictionaries} />
                  </motion.div>
                ))
              ) : (
                <FlightResultsEmptyState />
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}