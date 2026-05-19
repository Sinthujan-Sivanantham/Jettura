"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { MapPin, ArrowLeft, Star, Info, ShieldCheck, Check, Wifi, Coffee, Utensils, Waves, Dumbbell, Car, Globe, Hotel, Landmark } from "lucide-react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const genericHotelImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop";

export default function SavedHotelPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [savedHotel, setSavedHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const mapToken = import.meta.env.VITE_MAPBOX_TOKEN;

    useEffect(() => {
        async function fetchSavedHotel() {
            try {
                const { data, error } = await supabase
                    .from("saved_hotels")
                    .select("*")
                    .eq("id", id)
                    .single();
                if (error) throw error;
                setSavedHotel(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedHotel();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Globe className="text-zinc-300" size={40} />
            </motion.div>
        </div>
    );

    if (!savedHotel) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-wide text-zinc-400">{t("profile.hotels.details.notFound")}</div>;

    const hotel = savedHotel.hotel_data;
    const hotelName = hotel.name || "Hotel";
    const city = hotel.address?.city || "";
    const street = hotel.address?.lines?.[0] || "";
    const country = hotel.address?.country || "";
    const rating = hotel.rating || 0;
    const price = hotel.price?.total;
    const currency = hotel.price?.currency || "EUR";
    const heroImage = `https://images.unsplash.com/photo-1551882547-ff43c69e5cf2?auto=format&fit=crop&q=80&w=2070`;

    const latitude = hotel.location?.latitude;
    const longitude = hotel.location?.longitude;
    const hasLocation = latitude && longitude;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12"
        >
            {/* Header */}
            <div className="flex flex-col gap-6 sm:gap-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black tracking-[0.2em]"
                >
                    <ArrowLeft size={14} /> {t("profile.hotels.details.back")}
                </button>

                <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl min-[360px]:text-3xl sm:text-4xl font-[1000] italic uppercase tracking-tighter leading-[0.9] sm:leading-[0.85] text-zinc-900 dark:text-white break-words hyphens-auto">
                        {hotelName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[7px] sm:text-[8px] sm:text-[9px] min-[360px]:text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {new Date(savedHotel.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2 italic">
                            {t("profile.hotels.details.explorer")}
                        </span>
                        {rating > 0 && (
                            <span className="flex items-center gap-1 text-amber-500">
                                <Star size={10} fill="currentColor" />
                                {rating}.0
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative group overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl aspect-[4/5] min-[560px]:aspect-[16/9] bg-zinc-100 dark:bg-zinc-900">
                <img
                    src={heroImage}
                    alt={hotelName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => e.target.src = genericHotelImage}
                />

                {/* Location Badge */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl px-4 py-2 sm:px-6 sm:py-3 rounded-[1.2rem] sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-2xl border border-white/20">
                        <div className="bg-[var(--brand-color)] p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-lg">
                            <MapPin size={14} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-sm tracking-widest text-zinc-900 dark:text-white leading-tight">
                                {street}
                            </span>
                            <span className="font-bold uppercase text-[7px] sm:text-[9px] tracking-widest text-zinc-400">
                                {city}, {country}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mini Map (Exactly like Flight Detail) */}
                {hasLocation && mapToken && (
                    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-[50px] h-[50px] min-[600px]:w-24 sm:w-36 sm:h-36 rounded-[1.2rem] min-[600px]:rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 sm:border-4 border-white dark:border-zinc-800 shadow-2xl z-10 block transition-all hover:scale-110 hover:rotate-2">
                        <Map
                            mapboxAccessToken={mapToken}
                            initialViewState={{
                                longitude: longitude,
                                latitude: latitude,
                                zoom: 15
                            }}
                            style={{ width: "100%", height: "100%" }}
                            mapStyle={theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12"}
                            attributionControl={false}
                            scrollZoom={false}
                            dragPan={false}
                        >
                            <Marker longitude={longitude} latitude={latitude} anchor="bottom">
                                <MapPin size={24} className="text-red-600 drop-shadow-xl" fill="currentColor" stroke="white" strokeWidth={1.5} />
                            </Marker>
                        </Map>
                        <div className="absolute inset-0 bg-[var(--brand-color)]/5 pointer-events-none" />
                    </div>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 pt-4 sm:pt-8 items-start">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-8 sm:space-y-12">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-[var(--brand-color)]" />
                            <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black italic uppercase tracking-widest text-zinc-900 dark:text-white">
                                {t("common.accommodation") || "Die Unterkunft"}
                            </h2>
                        </div>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                            {t("profile.hotels.details.journeyContent") || "Entdecke diesen exklusiven Aufenthalt. Die Unterkunft bietet erstklassigen Komfort und eine unschlagbare Lage für deine Reiseerlebnisse."}
                        </p>
                    </div>

                    {/* Amenities Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                        {hotel.amenities?.map((amenity, idx) => {
                            const props = { size: 18, className: "text-[var(--brand-color)]" };
                            let icon = <Info {...props} />;
                            let label = amenity.replace(/_/g, " ");

                            if (amenity.includes("WIFI")) { icon = <Wifi {...props} />; label = t("common.wifi") || "WiFi"; }
                            else if (amenity.includes("POOL")) { icon = <Waves {...props} />; label = t("common.pool") || "Pool"; }
                            else if (amenity.includes("RESTAURANT")) { icon = <Utensils {...props} />; label = t("common.dining") || "Dining"; }
                            else if (amenity.includes("GYM")) { icon = <Dumbbell {...props} />; label = t("common.gym") || "Gym"; }
                            else if (amenity.includes("PARKING")) { icon = <Car {...props} />; label = t("common.parking") || "Parking"; }
                            else if (amenity.includes("BREAKFAST")) { icon = <Coffee {...props} />; label = t("common.breakfast") || "Breakfast"; }

                            return (
                                <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-4 sm:p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 transition-all hover:translate-y-[-2px] hover:shadow-md">
                                    <div className="shrink-0">{icon}</div>
                                    <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs font-black uppercase italic tracking-tight text-zinc-700 dark:text-zinc-300 truncate">
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <ShieldCheck className="text-emerald-500" size={20} />
                            <div>
                                <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase text-emerald-500 italic">
                                    {t("profile.hotels.details.verified") || "Verifiziert"}
                                </p>
                                <p className="text-[7px] sm:text-[8px] sm:text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {t("profile.hotels.details.gdsSync") || "GDS SYNC AKTIV"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase text-zinc-400 italic">{t("common.totalPrice")}</span>
                            <div className="flex items-baseline gap-1">
                                {price ? (
                                    <>
                                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic">{Math.round(price)}</span>
                                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold uppercase opacity-60">{currency}</span>
                                    </>
                                ) : (
                                    <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic text-zinc-500">N/A</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                className="w-full h-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] tracking-[0.15em] border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Info size={14} strokeWidth={2.5} style={{ color: "var(--brand-color)" }} />
                                <span>MEHR ERFAHREN</span>
                            </button>

                            <button
                                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(hotelName + " " + city + " booking")}`, '_blank')}
                                className="w-full h-12 rounded-2xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] tracking-[0.15em] shadow-xl hover:shadow-2xl active:scale-95 transition-all relative overflow-hidden group/btn bg-[var(--brand-color)]"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10">JETZT BUCHEN</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) - Exactly like Flight Detail */}
                <div className="space-y-6 sm:space-y-8">
                    <div className="bg-zinc-900 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-4 sm:space-y-6">
                            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic uppercase leading-tight tracking-tight">
                                {t("profile.flights.details.interested") || "Interessiert an diesem Aufenthalt?"}
                            </h3>
                            <p className="text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-medium leading-relaxed">
                                {t("profile.flights.details.aiPromo") || "Nutze unseren AI-Planner, um deine individuelle Route für dieses Ziel zu erstellen."}
                            </p>
                            <button
                                onClick={() => router.push(`/ai-planner?destination=${encodeURIComponent(city)}`)}
                                className="w-full bg-[var(--brand-color)] hover:brightness-110 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-[0.2em] transition-all shadow-lg active:scale-95"
                            >
                                {t("profile.flights.details.planNow")}
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                            <Hotel size={100} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-4 sm:space-y-6">
                        <h4 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">
                            {t("profile.flights.details.quickInfo") || "Quick Info"}
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { icon: <Landmark size={16} />, label: t("profile.flights.details.landmarks") || "Sehenswürdigkeiten", value: "8 UNESCO" },
                                { icon: <Utensils size={16} />, label: t("profile.flights.details.food") || "Lokales Essen", value: "Spicy & Fresh" },
                                { icon: <Globe size={16} />, label: t("profile.flights.details.language") || "Sprache", value: "English & Local" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800 pb-3 sm:pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="text-[var(--brand-color)]">{item.icon}</div>
                                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[11px] font-bold text-zinc-500 uppercase">{item.label}</span>
                                    </div>
                                    <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[11px] font-black text-zinc-900 dark:text-white uppercase italic">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
