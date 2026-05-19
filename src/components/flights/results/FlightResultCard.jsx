"use client";
import React, { useState, memo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, Heart, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlightDetailsModal from "./FlightDetailsModal";
import FlightShareModal from "./FlightShareModal";
import FlightCardLeg from "./ui/FlightCardLeg";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import StatusPopup from "../../ui/StatusPopup";
import { trackBooking } from "@/lib/bookingTracker";

const FlightResultCard = memo(({ flight, dictionaries, onSaveChange, isSavedView, savedId }) => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    title: "",
    type: "info"
  });

  const showAlert = (message, title = "Info", type = "info") => {
    setAlertConfig({ isOpen: true, message, title, type });
  };

  // Check if flight is already saved on mount
  useEffect(() => {
    async function checkSavedStatus() {
      if (!user) return;

      // FIX: Skip Supabase check for showcase OR fallback flights
      if (flight.id && (String(flight.id).startsWith("showcase-") || String(flight.id).startsWith("fallback-"))) {
        setIsSaved(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('saved_flights')
          .select('id')
          .eq('user_id', user.id)
          .eq('flight_id', flight.id)
          .single();

        if (data) setIsSaved(true);
      } catch (error) {
        // Not found is fine
      }
    }
    checkSavedStatus();
  }, [user, flight.id]);

  const toggleSave = async () => {
    if (!user) {
      showAlert(
        language === "de" ? "Bitte melde dich an, um Flüge zu speichern." : "Please log in to save flights.",
        language === "de" ? "Anmeldung erforderlich" : "Login Required",
        "info"
      );
      return;
    }

    // FIX: Show alert for Demo/Fallback elements
    if (flight.id && (String(flight.id).startsWith("showcase-") || String(flight.id).startsWith("fallback-"))) {
      showAlert(
        language === "de" ? "Dieser Flug kann nicht gespeichert werden." : "This flight cannot be saved.",
        "Info",
        "info"
      );
      return;
    }

    setSavingLoading(true);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_flights')
          .delete()
          .eq('user_id', user.id)
          .eq('flight_id', flight.id);

        if (error) throw error;
        setIsSaved(false);
      } else {
        const { error } = await supabase
          .from('saved_flights')
          .insert([{
            user_id: user.id,
            flight_id: flight.id,
            flight_data: flight
          }]);

        if (error) throw error;
        setIsSaved(true);
      }

      if (onSaveChange) onSaveChange(flight.id, !isSaved);

    } catch (error) {
      console.error("Save error:", error);
      showAlert(
        language === "de" ? "Fehler beim Speichern des Fluges." : "Error saving the flight.",
        "Error",
        "error"
      );
    } finally {
      setSavingLoading(false);
    }
  };

  // ... (Restlicher Code für handleBooking und Rendering bleibt identisch)
  const price = flight.price.total;
  const currency = flight.price.currency;
  const itineraries = flight.itineraries;

  const handleBooking = async () => {
    // Log booking in local state
    trackBooking({
      type: "flight",
      price: flight.price.total,
      currency: flight.price.currency,
      details: {
        airline: itineraries[0]?.segments[0]?.carrierCode || "Jettura Airline",
        route: `${itineraries[0]?.segments[0]?.departure?.iataCode || "FRA"} ➔ ${itineraries[0]?.segments?.at(-1)?.arrival?.iataCode || "CDG"}`,
        departureDate: itineraries[0]?.segments[0]?.departure?.at 
          ? new Date(itineraries[0].segments[0].departure.at).toLocaleDateString("de-DE") 
          : new Date().toLocaleDateString("de-DE"),
        stops: itineraries[0]?.segments ? (itineraries[0].segments.length - 1) : 0
      },
      user
    });

    if (flight.id && String(flight.id).startsWith("showcase-")) {
      window.open(`https://www.google.com/travel/flights`, "_blank");
      return;
    }

    if (flight.isV2) {
      try {
        const win = window.open("", "_blank");
        const res = await fetch("http://localhost:3001/api/search/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_id: flight.searchId, proposal_id: flight.proposalId })
        });
        if (!res.ok) throw new Error("Booking Link Error");
        const data = await res.json();
        if (data.url) win.location.href = data.url; else win.close();
      } catch (e) { console.error(e); }
      return;
    }

    if (flight.deepLink) {
      window.open(flight.deepLink, "_blank");
      return;
    }

    // Default Aviasales logic...
    const marker = "694152";
    const firstLeg = itineraries[0].segments[0];
    const lastLeg = itineraries[0].segments.at(-1);
    const dateObj = new Date(firstLeg.departure.at);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const adults = flight.travelerPricings ? flight.travelerPricings.length : 1;
    let searchPath = `${firstLeg.departure.iataCode}${day}${month}${lastLeg.arrival.iataCode}`;
    if (itineraries[1]) {
      const retDate = new Date(itineraries[1].segments[0].departure.at);
      searchPath += `${retDate.getDate().toString().padStart(2, '0')}${(retDate.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    searchPath += adults;
    window.open(`https://www.aviasales.com/search/${searchPath}?marker=${marker}&market=us`, "_blank");
  };

  return (
    <>
      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800/60 rounded-[3.5rem] p-5 pt-10 mb-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group shadow-sm relative overflow-hidden text-zinc-900 dark:text-white">

        <div className="flex items-center gap-3 mb-8 sm:mb-12 relative z-10">
          <button
            onClick={toggleSave}
            disabled={savingLoading}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all border ${isSaved
              ? "bg-[var(--brand-color)] border-[var(--brand-color)] text-white"
              : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
              }`}
          >
            {savingLoading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isSaved ? "currentColor" : "none"} style={{ color: isSaved ? "white" : "var(--brand-color)" }} />}
          </button>

          <button onClick={() => setShowShare(true)} className="flex items-center justify-center w-10 h-10 rounded-full transition-all bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            <Share2 size={18} style={{ color: "var(--brand-color)" }} />
          </button>
        </div>

        <div className="absolute top-4 right-8 opacity-[0.02] pointer-events-none select-none text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-3xl md:text-4xl sm:text-5xl lg:text-7xl font-black italic uppercase">Jettura</div>

        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row items-center gap-6">
          <div className="flex-1 w-full space-y-10">
            {itineraries.map((itinerary, idx) => (
              <FlightCardLeg key={idx} itinerary={itinerary} idx={idx} itinerariesCount={itineraries.length} dictionaries={dictionaries} language={language} t={t} />
            ))}
          </div>

          <div className="flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l lg:border-l-0 lg:border-t xl:border-l xl:border-t-0 border-zinc-100 dark:border-zinc-800 w-full md:w-52 lg:w-full xl:w-64 p-5 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[2rem]">
            <div className="text-center w-full">
              <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em] italic block mb-2">{t("search.flight.details.from") || "AB"}</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="fluid-h2 font-black italic tracking-tighter text-zinc-900 dark:text-white">
                  {/* Handle non-numeric prices (e.g., 'Check') */}
                  {!isNaN(parseFloat(price)) ? Math.round(price) : price}
                </span>
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-black uppercase opacity-60">{currency}</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <button onClick={() => isSavedView ? router.push(`/profile/saved-flight/${savedId}`) : setShowDetails(true)} className="w-full h-11 sm:h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-[0.15em] border border-zinc-200 flex items-center justify-center gap-2">
                <Info size={14} strokeWidth={2.5} style={{ color: "var(--brand-color)" }} />
                <span>{t("common.learnMore") || "MEHR ERFAHREN"}</span>
              </button>

              <button onClick={handleBooking} className="w-full h-12 rounded-2xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] tracking-[0.15em] shadow-xl bg-[var(--brand-color)]">
                <span className="relative z-10">{t("search.flight.details.book") || "JETZT BUCHEN"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetails && <FlightDetailsModal flight={flight} dictionaries={dictionaries} onClose={() => setShowDetails(false)} logo={`https://images.kiwi.com/airlines/64/${itineraries[0].segments[0].carrierCode}.png`} />}
      <FlightShareModal isOpen={showShare} onClose={() => setShowShare(false)} flight={flight} dictionaries={dictionaries} />
      <StatusPopup isOpen={alertConfig.isOpen} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} message={alertConfig.message} title={alertConfig.title} type={alertConfig.type} />
    </>
  );
});

export default FlightResultCard;