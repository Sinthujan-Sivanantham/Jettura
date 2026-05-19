import React from "react";
import HotelResultCard from "../hotels/results/HotelResultCard";
import { useLanguage } from "@/context/LanguageContext";
import { Hotel } from "lucide-react";

export default function SavedHotelsList({ hotels, onUnsave }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-8 text-left">
            {/* Header */}
            <div className="flex items-center gap-4">
                <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black uppercase italic tracking-tighter dark:text-white">
                    {t("profile.hotels.savedCount") || "Hotels"}
                </h2>
                <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase">
                    {hotels.length} {t("profile.hotels.savedCount") || "Hotels"}
                </span>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 gap-6">
                {hotels.length > 0 ? (
                    hotels.map((saved) => (
                        <HotelResultCard
                            key={saved.id}
                            hotel={saved.hotel_data}
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
                            <Hotel className="text-zinc-200 dark:text-zinc-800" size={32} />
                        </div>
                        <p className="text-zinc-300 font-black uppercase italic text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-[0.2em]">
                            {t("profile.hotels.noSavedHotels")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
