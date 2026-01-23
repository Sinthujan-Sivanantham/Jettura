import React from "react";
import FlightResultCard from "../flights/results/FlightResultCard";
import { useLanguage } from "@/context/LanguageContext";
import { Plane } from "lucide-react";

export default function SavedFlightsList({ flights, onUnsave }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-8 text-left">
            {/* Header */}
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-black uppercase italic tracking-tighter dark:text-white">
                    {t("profile.flights.savedCount") || "Gespeicherte Flüge"}
                </h2>
                <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
                <span className="text-[10px] font-black text-zinc-400 uppercase">
                    {flights.length} {t("profile.flights.savedCount") || "Flüge"}
                </span>
            </div>

            {/* Flights Grid */}
            <div className="grid grid-cols-1 gap-6">
                {flights.length > 0 ? (
                    flights.map((saved) => (
                        <FlightResultCard
                            key={saved.id}
                            flight={saved.flight_data}
                            dictionaries={null}
                            isSavedView={true}
                            savedId={saved.id}
                            onSaveChange={(id, isNowSaved) => {
                                if (!isNowSaved && onUnsave) onUnsave(id);
                            }}
                        />
                    ))
                ) : (
                    <div className="py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem] text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                            <Plane className="text-zinc-200 dark:text-zinc-800" size={32} />
                        </div>
                        <p className="text-zinc-300 font-black uppercase italic text-xs tracking-[0.2em]">
                            {t("profile.flights.noSavedFlights")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
