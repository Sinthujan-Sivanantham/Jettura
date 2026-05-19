"use client";
import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import ESIMHero from "../components/esim/ESIMHero";
import ESIMAIAdvisor from "../components/esim/ESIMAIAdvisor";
import ESIMSearchBar from "../components/esim/ESIMSearchBar";
import ESIMGrid from "../components/esim/ESIMGrid";
import ESIMTrustBadges from "../components/esim/ESIMTrustBadges";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { esimApi } from "../services/esimApi";
import StatusPopup from "../components/ui/StatusPopup";
import { trackBooking } from "../lib/bookingTracker";

export default function ESIMStore() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  // Status Popup State
  const [popup, setPopup] = useState({ isOpen: false, title: "", message: "", type: "info" });
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async (pkg) => {
    if (isBooking) return;

    setIsBooking(true);
    try {
      const result = await esimApi.createOrder(pkg.id, user?.id || "anonymous");
      if (result.success) {
        trackBooking({
          type: "esim",
          price: pkg.price,
          currency: "USD",
          details: {
            country: pkg.country,
            data: pkg.data,
            duration: pkg.duration,
            pkgType: pkg.type
          },
          user
        });
        setPopup({
          isOpen: true,
          title: t("esimShop.popup.success.title") || "Zahlung Erfolgreich",
          message: `${t("esimShop.popup.success.message") || "Dein eSIM Profil für"} ${pkg.country} ${t("esimShop.popup.success.ready") || "ist bereit. Scanne den QR-Code in deinem Profil."}`,
          type: "success"
        });
      }
    } catch (err) {
      setPopup({
        isOpen: true,
        title: "Fehler",
        message: "Etwas ist schiefgelaufen. Bitte versuche es später erneut.",
        type: "error"
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-2">
          <Lock size={32} className="text-zinc-400" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">
            {t("esimShop.auth.title")}
          </h3>
          <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            {t("esimShop.auth.description")}
          </p>
        </div>
        <Link href="/auth">
          <button
            className="h-12 px-8 rounded-xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 hover:opacity-90"
            style={{ backgroundColor: "var(--brand-color)" }}
          >
            {t("esimShop.auth.button")}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4">
      <ESIMHero />
      <ESIMAIAdvisor />
      <ESIMSearchBar value={searchTerm} onChange={setSearchTerm} />
      <ESIMGrid searchTerm={searchTerm} onBook={handleBook} isBookingGlobal={isBooking} />
      <ESIMTrustBadges />

      <StatusPopup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        title={popup.title}
        message={popup.message}
        type={popup.type}
      />
    </div>
  );
}