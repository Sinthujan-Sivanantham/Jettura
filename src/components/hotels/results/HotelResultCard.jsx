"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import { Hotel, Star, MapPin, ShieldCheck, Check, Navigation, Wifi, Coffee, Utensils, Waves, Dumbbell, Car, Heart, Share2, Loader2, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import StatusPopup from "../../ui/StatusPopup";
import { trackBooking } from "@/lib/bookingTracker";
import HotelShareModal from "./HotelShareModal";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/navigation";

const HotelResultCard = memo(({ hotel, isSavedView, savedId, onSaveChange }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    title: "",
    type: "info"
  });

  const mapContainer = useRef(null);
  const map = useRef(null);

  const showAlert = (message, title = "Info", type = "info") => {
    setAlertConfig({ isOpen: true, message, title, type });
  };

  // Check saved status
  useEffect(() => {
    async function checkSavedStatus() {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('saved_hotels')
          .select('id')
          .eq('user_id', user.id)
          .eq('hotel_id', hotel.hotelId || hotel.id)
          .single();
        if (data) setIsSaved(true);
      } catch (e) { /* ignore */ }
    }
    checkSavedStatus();
  }, [user, hotel.hotelId, hotel.id]);

  const toggleSave = async () => {
    if (!user) {
      showAlert(
        language === "de" ? "Bitte melde dich an, um Hotels zu speichern." : "Please log in to save hotels.",
        language === "de" ? "Anmeldung erforderlich" : "Login Required",
        "info"
      );
      return;
    }

    setSavingLoading(true);
    const hotelId = hotel.hotelId || hotel.id;

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_hotels')
          .delete()
          .eq('user_id', user.id)
          .eq('hotel_id', hotelId);
        if (error) throw error;
        setIsSaved(false);
        showAlert(
          t("common.hotelRemoved"),
          t("common.success"),
          "success"
        );
      } else {
        const { error } = await supabase
          .from('saved_hotels')
          .insert([{
            user_id: user.id,
            hotel_id: hotelId,
            hotel_data: hotel
          }]);
        if (error) throw error;
        setIsSaved(true);
        showAlert(
          t("common.hotelSaved"),
          t("common.success"),
          "success"
        );
      }
      if (onSaveChange) onSaveChange(hotelId, !isSaved);
    } catch (error) {
      console.error("Save error:", error);
      showAlert(
        language === "de" ? "Fehler beim Speichern des Hotels." : "Error saving the hotel.",
        "Error",
        "error"
      );
    } finally {
      setSavingLoading(false);
    }
  };

  const hotelId = hotel.hotelId || hotel.id;
  const hotelName = hotel.name || "Hotel";
  const rating = hotel.rating || 0;
  const street = hotel.address?.lines?.[0] || "";
  const city = hotel.address?.city || "";
  const postalCode = hotel.address?.postalCode || "";
  const country = hotel.address?.country || "";

  let fullCountry = country;
  try {
    const regionNames = new Intl.DisplayNames([language || 'en'], { type: 'region' });
    fullCountry = regionNames.of(country) || country;
  } catch (e) { }

  const addressLine2 = [postalCode, city].filter(Boolean).join(" ");
  const addressLine3 = fullCountry;
  const distance = hotel.distance?.value || null;
  const distanceUnit = hotel.distance?.unit || "KM";
  const price = hotel.price?.total;
  const currency = hotel.price?.currency || "EUR";
  const perNight = hotel.price?.perNight;
  const brandColor = "var(--brand-color)";
  const imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(city || "luxury hotel")},hotel,luxury`;
  const latitude = hotel.location?.latitude;
  const longitude = hotel.location?.longitude;
  const hasLocation = latitude && longitude;

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: "200px" });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !showMap || !hasLocation || !mapContainer.current) {
      if (map.current) { map.current.remove(); map.current = null; }
      return;
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude, latitude],
        zoom: 14,
        interactive: true,
        attributionControl: false,
        preserveDrawingBuffer: true
      });
      map.current.on('load', () => map.current.resize());
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="#EA4335" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`;
      new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map.current);
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }
    return () => { if (map.current) { map.current.remove(); map.current = null; } };
  }, [isVisible, showMap, hasLocation, latitude, longitude, hotelName]);

  return (
    <>
      <div ref={containerRef} className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-[2.8rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group relative">
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row p-4 sm:p-5 lg:p-6">
          <div className="w-full md:w-60 lg:w-full xl:w-72 h-64 md:h-80 lg:h-64 xl:h-80 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-[2.4rem] shrink-0">
            {!showMap ? (
              <>
                <img src={imageUrl} alt={hotelName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" onError={() => setShowMap(true)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </>
            ) : hasLocation ? (
              <div ref={mapContainer} className="absolute inset-0 w-full h-full bg-zinc-100 dark:bg-zinc-800" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900">
                <Hotel size={60} strokeWidth={1} className="text-zinc-400 opacity-30" />
              </div>
            )}

            {/* Top Actions: Save & Share (Icon-only for maximum Map visibility) */}
            <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); toggleSave(); }}
                disabled={savingLoading}
                aria-label={isSaved ? t("common.saved") : t("common.save")}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all border shadow-2xl ${isSaved
                  ? "bg-[var(--brand-color)] border-[var(--brand-color)] text-white"
                  : "bg-white/95 dark:bg-zinc-900/95 border-white/20 text-zinc-500 hover:text-[var(--brand-color)]"
                  }`}
              >
                {savingLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Heart size={18} fill={isSaved ? "currentColor" : "none"} style={{ color: isSaved ? "white" : "var(--brand-color)" }} />
                )}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
                aria-label={t("common.share")}
                className="flex items-center justify-center w-10 h-10 rounded-full transition-all bg-white/95 dark:bg-zinc-900/95 border-white/20 text-zinc-500 hover:text-[var(--brand-color)] shadow-2xl"
              >
                <Share2 size={18} style={{ color: "var(--brand-color)" }} />
              </button>
            </div>

            {rating > 0 && (
              <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] font-black italic text-zinc-900 dark:text-white">{rating}.0</span>
              </div>
            )}
            {distance && (
              <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10">
                <Navigation size={10} style={{ color: brandColor }} />
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-black italic uppercase tracking-wider text-zinc-900 dark:text-white">
                  {distance.toFixed(2)} {distanceUnit}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 md:p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-black uppercase italic tracking-[0.2em] text-zinc-400">
                  {t("search.intelligenceActive") || "Intelligence Engine Aktiv"}
                </span>
                <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg xl:text-2xl font-black italic uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-5 group-hover:translate-x-1 transition-transform">
                {hotelName}
              </h3>
              <div className="flex items-start gap-2 text-zinc-500 dark:text-zinc-400 mb-4">
                <MapPin size={13} style={{ color: brandColor }} className="mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] font-black uppercase italic tracking-tight text-zinc-700 dark:text-zinc-300">{street || city}</span>
                  <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-0.5">{addressLine2}</span>
                  <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">{addressLine3}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                {hotel.amenities?.slice(0, 5).map((amenity, idx) => {
                  const props = { size: 12 };
                  if (amenity.includes("WIFI")) return <div key={idx} className="flex items-center gap-1 text-zinc-400"><Wifi {...props} /><span className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold uppercase tracking-tight">{t("common.wifi") || "WiFi"}</span></div>;
                  if (amenity.includes("POOL")) return <div key={idx} className="flex items-center gap-1 text-zinc-400"><Waves {...props} /><span className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold uppercase tracking-tight">{t("common.pool") || "Pool"}</span></div>;
                  if (amenity.includes("RESTAURANT")) return <div key={idx} className="flex items-center gap-1 text-zinc-400"><Utensils {...props} /><span className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold uppercase tracking-tight">{t("common.dining") || "Dining"}</span></div>;
                  if (amenity.includes("GYM")) return <div key={idx} className="flex items-center gap-1 text-zinc-400"><Dumbbell {...props} /><span className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold uppercase tracking-tight">{t("common.gym") || "Gym"}</span></div>;
                  if (amenity.includes("PARKING")) return <div key={idx} className="flex items-center gap-1 text-zinc-400"><Car {...props} /><span className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold uppercase tracking-tight">{t("common.parking") || "Parking"}</span></div>;
                  if (amenity.includes("BREAKFAST")) return <div key={idx} className="flex items-center gap-1 text-zinc-400"><Coffee {...props} /><span className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold uppercase tracking-tight">{t("common.breakfast") || "Breakfast"}</span></div>;
                  return null;
                })}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[7px] sm:text-[8px] sm:text-[9px] font-black uppercase italic text-emerald-500"><Check size={11} strokeWidth={3} /><span>{t("common.available")}</span></div>
                <div className="flex items-center gap-1.5 text-[7px] sm:text-[8px] sm:text-[9px] font-black uppercase italic text-zinc-400"><ShieldCheck size={11} strokeWidth={3} /><span>{t("profile.hotels.details.customerService")}</span></div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-52 lg:w-full xl:w-64 p-6 xl:p-8 border-t md:border-t-0 md:border-l lg:border-l-0 lg:border-t xl:border-l xl:border-t-0 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex flex-col justify-center items-center text-center gap-4">
            {price ? (
              <div className="w-full">
                <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em] italic block mb-2">{t("common.totalPrice")}</span>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs uppercase opacity-40 font-bold not-italic">{t("common.from")}</span>
                  <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-white">{Math.round(price)}</span>
                  <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-black uppercase opacity-60">{currency}</span>
                </div>
                <button
                  onClick={() => isSavedView ? router.push(`/profile/saved-hotel/${savedId}`) : showAlert("Details", "Please save this hotel to view full Intelligence details.", "info")}
                  className="w-full h-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] tracking-[0.15em] border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Info size={14} strokeWidth={2.5} style={{ color: "var(--brand-color)" }} />
                  {t("common.learnMore") || "Mehr erfahren"}
                </button>
              </div>
            ) : (
              <div className="w-full space-y-3">
                <div className="w-full">
                  <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em] italic block mb-2">{t("common.totalPrice")}</span>
                  <div className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic tracking-tighter text-zinc-400 opacity-50">N/A</div>
                </div>
                <button
                  onClick={() => isSavedView ? router.push(`/profile/saved-hotel/${savedId}`) : showAlert("Details", "Please save this hotel to view full Intelligence details.", "info")}
                  className="w-full h-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] tracking-[0.15em] border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Info size={14} strokeWidth={2.5} style={{ color: "var(--brand-color)" }} />
                  {t("common.learnMore") || "Mehr erfahren"}
                </button>
              </div>
            )}
             <button
              onClick={() => {
                trackBooking({
                  type: "hotel",
                  price: hotel.price?.total || 120,
                  currency: hotel.price?.currency || "EUR",
                  details: {
                    hotelName,
                    city,
                    address: street || "Hauptstraße 45",
                    rating: hotel.rating || 4
                  },
                  user
                });
                window.open(`https://www.google.com/search?q=${encodeURIComponent(hotelName + " " + city + " booking")}`, '_blank');
              }}
              className="w-full h-12 rounded-2xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] tracking-[0.15em] shadow-xl hover:shadow-2xl active:scale-95 transition-all relative overflow-hidden group/btn"
              style={{ backgroundColor: brandColor }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">{t("profile.hotels.details.book")}</span>
            </button>
          </div>
        </div>
      </div>

      <HotelShareModal isOpen={showShare} onClose={() => setShowShare(false)} hotel={hotel} />
      <StatusPopup isOpen={alertConfig.isOpen} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} message={alertConfig.message} title={alertConfig.title} type={alertConfig.type} />
    </>
  );
});

export default HotelResultCard;
