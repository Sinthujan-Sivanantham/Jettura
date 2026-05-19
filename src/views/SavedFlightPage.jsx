"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { MapPin, Plane, ArrowLeft, Info, Landmark, Utensils, Globe, ShieldCheck } from "lucide-react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { getLocationWithCountry, formatFlightTime, formatFlightDate, formatISO8601Duration } from "@/utils/flightUtils";

// Mock cultural data for demonstration
const countryCultures = {
    "IS": {
        de: "Island ist ein Land der extremen Kontraste und dramatischen Landschaften. Bekannt als das 'Land von Feuer und Eis', beherbergt es einige der größten Gletscher Europas und einige der aktivsten Vulkane der Welt. Die isländische Kultur ist tief in nordischen Traditionen verwurzelt, mit einer reichen Geschichte an Sagas und Literatur.",
        en: "Iceland is a land of extreme contrasts and dramatic landscapes. Known as the 'Land of Fire and Ice', it is home to some of the largest glaciers in Europe and some of the world's most active volcanoes. Icelandic culture is deeply rooted in Nordic traditions, with a rich history of sagas and literature."
    },
    "US": {
        de: "Die Vereinigten Staaten sind ein kultureller Schmelztiegel mit Einflüssen aus der ganzen Welt. Von der pulsierenden Energie von New York City bis zu den weiten Landschaften der Nationalparks bietet das Land eine unglaubliche Vielfalt. Die amerikanische Kultur ist geprägt von Individualismus, Innovation und einer tiefen Liebe zur Unterhaltung.",
        en: "The United States is a cultural melting pot with influences from all over the world. From the vibrant energy of New York City to the vast landscapes of national parks, the country offers incredible diversity. American culture is characterized by individualism, innovation, and a deep love for entertainment."
    },
    "LK": {
        de: "Sri Lanka ist eine Inselnation im Indischen Ozean, bekannt für ihre üppigen Teeplantagen, goldenen Strände und eine reiche buddhistische Geschichte. Die Kultur ist geprägt von herzlicher Gastfreundschaft, würzigem Essen und farbenfrohen Festivals wie Esala Perahera. Das Land beherbergt acht UNESCO-Welterbestätten.",
        en: "Sri Lanka is an island nation in the Indian Ocean, known for its lush tea plantations, golden beaches, and a rich Buddhist history. The culture is marked by warm hospitality, spicy food, and colorful festivals like Esala Perahera. The country is home to eight UNESCO World Heritage Sites."
    },
    "JP": {
        de: "Japan verbindet nahtlos uralte Traditionen mit futuristischer Technologie. Von den ruhigen Zen-Gärten in Kyoto bis zu den neonbeleuchteten Straßen von Tokio bietet Japan ein einzigartiges kulturelles Erlebnis. Die japanische Kultur betont Harmonie, Respekt und eine akribische Aufmerksamkeit für Details.",
        en: "Japan seamlessly blends ancient traditions with futuristic technology. From the tranquil Zen gardens of Kyoto to the neon-lit streets of Tokyo, Japan offers a unique cultural experience. Japanese culture emphasizes harmony, respect, and meticulous attention to detail."
    },
    "TH": {
        de: "Thailand, bekannt als das 'Land des Lächelns', ist berühmt für seine reich verzierten Tempel, tropischen Strände und seine weltbekannte Küche. Die thailändische Kultur ist tief vom Buddhismus geprägt, was sich in der Architektur, den täglichen Ritualen und der freundlichen Mentalität der Menschen widerspiegelt.",
        en: "Thailand, known as the 'Land of Smiles', is famous for its ornate temples, tropical beaches, and world-renowned cuisine. Thai culture is deeply influenced by Buddhism, which is reflected in the architecture, daily rituals, and the friendly mentality of the people."
    }
};

const defaultCulture = {
    de: "Entdecke die faszinierende Kultur und Geschichte dieses einzigartigen Reiseziels. Von lokalen Traditionen bis hin zu kulinarischen Highlights gibt es viel zu erleben.",
    en: "Discover the fascinating culture and history of this unique destination. From local traditions to culinary highlights, there is much to experience."
};

const cityImages = {
    "NYC": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    "JFK": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    "KEF": "https://images.unsplash.com/photo-1521024221340-efe7d7fa239b?q=80&w=2070&auto=format&fit=crop",
    "TYO": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop",
    "HND": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop",
    "NRT": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop",
    "BKK": "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2070&auto=format&fit=crop",
    "DPS": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070&auto=format&fit=crop",
    "SIN": "https://images.unsplash.com/photo-1525625232717-1c28c5bb06ef?q=80&w=2024&auto=format&fit=crop",
    "CMB": "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=2073&auto=format&fit=crop",
    "BER": "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=2070&auto=format&fit=crop",
    "FRA": "https://images.unsplash.com/photo-1542344807-157f76301e8a?q=80&w=2070&auto=format&fit=crop",
};

const genericTravelImage = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";

export default function SavedFlightPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [savedFlight, setSavedFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coords, setCoords] = useState(null);
    const mapToken = import.meta.env.VITE_MAPBOX_TOKEN;

    useEffect(() => {
        async function fetchSavedFlight() {
            try {
                const { data, error } = await supabase
                    .from("saved_flights")
                    .select("*")
                    .eq("id", id)
                    .single();
                if (error) throw error;
                setSavedFlight(data);

                // Geocode the destination
                const flight = data.flight_data;
                const lastLeg = flight.itineraries[0].segments.at(-1);
                const destCode = lastLeg.arrival.iataCode;
                const destName = getLocationWithCountry(destCode, null, language);

                if (destName && mapToken) {
                    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destName)}.json?access_token=${mapToken}&limit=1`);
                    const json = await res.json();
                    if (json.features && json.features.length > 0) {
                        const [lng, lat] = json.features[0].center;
                        setCoords({ lat, lng });
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedFlight();
    }, [id, mapToken, language]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Plane className="text-zinc-300" size={40} />
            </motion.div>
        </div>
    );

    if (!savedFlight) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-zinc-400">{t("profile.flights.details.notFound")}</div>;

    const flight = savedFlight.flight_data;
    const firstLeg = flight.itineraries[0].segments[0];
    const lastLeg = flight.itineraries[0].segments.at(-1);
    const destCode = lastLeg.arrival.iataCode;
    const destName = getLocationWithCountry(destCode, null, language);
    const countryCode = destCode.slice(0, 2);
    const heroImage = cityImages[destCode] || cityImages[flight.itineraries[0].segments.at(-1).arrival.iataCode] || genericTravelImage;

    const culture = countryCultures[countryCode] || defaultCulture;

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
                    <ArrowLeft size={14} /> {t("profile.flights.details.back")}
                </button>

                <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl min-[360px]:text-3xl sm:text-4xl font-[1000] italic uppercase tracking-tighter leading-[0.9] sm:leading-[0.85] text-zinc-900 dark:text-white break-words hyphens-auto">
                        {destName.split(',')[0]}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[7px] sm:text-[8px] sm:text-[9px] min-[360px]:text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {new Date(savedFlight.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                            {t("profile.flights.details.explorer")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative group overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl aspect-[4/5] min-[560px]:aspect-[16/9] bg-zinc-100 dark:bg-zinc-900">
                <img
                    src={heroImage}
                    alt={destName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Location Badge */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
                    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl px-4 py-2 sm:px-6 sm:py-3 rounded-[1.2rem] sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-2xl border border-white/20">
                        <div className="bg-[var(--brand-color)] p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-white shadow-lg">
                            <MapPin size={14} strokeWidth={3} />
                        </div>
                        <span className="font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-sm tracking-widest text-zinc-900 dark:text-white">
                            {destName}
                        </span>
                    </div>
                </div>

                {/* Mini Map */}
                {coords && mapToken && (
                    <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-[50px] h-[50px] min-[600px]:w-24 sm:w-36 sm:h-36 rounded-[1.2rem] min-[600px]:rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 sm:border-4 border-white dark:border-zinc-800 shadow-2xl z-10 block transition-all hover:scale-110 hover:rotate-2">
                        <Map
                            mapboxAccessToken={mapToken}
                            initialViewState={{
                                longitude: coords.lng,
                                latitude: coords.lat,
                                zoom: 11
                            }}
                            style={{ width: "100%", height: "100%" }}
                            mapStyle={theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12"}
                            attributionControl={false}
                            scrollZoom={false}
                            dragPan={false}
                        >
                            <Marker longitude={coords.lng} latitude={coords.lat} anchor="bottom">
                                <MapPin size={24} className="text-red-600 drop-shadow-xl" fill="currentColor" stroke="white" strokeWidth={1.5} />
                            </Marker>
                        </Map>
                        <div className="absolute inset-0 bg-[var(--brand-color)]/5 pointer-events-none" />
                    </div>
                )}
            </div>

            {/* Flight Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 pt-4 sm:pt-8">
                <div className="lg:col-span-2 space-y-8 sm:space-y-12">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-[var(--brand-color)]" />
                            <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black italic uppercase tracking-widest text-zinc-900 dark:text-white">
                                {t("profile.flights.details.journey")}
                            </h2>
                        </div>
                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                            {culture[language]}
                        </p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {flight.itineraries.map((itinerary, idx) => (
                            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand-color)] mb-4 sm:mb-6 block italic">
                                    {idx === 0 ? t("profile.flights.details.outbound") : t("profile.flights.details.inbound")}
                                </span>
                                <div className="space-y-8 sm:space-y-10">
                                    {itinerary.segments.map((seg, sIdx) => (
                                        <div key={sIdx} className="flex gap-4 sm:gap-8 relative">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[var(--brand-color)]" />
                                                <div className="w-[1.5px] sm:w-[2px] flex-1 bg-zinc-200 dark:bg-zinc-800 my-1 sm:my-2" />
                                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" />
                                            </div>
                                            <div className="flex-1 space-y-3 sm:space-y-4">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-3xl font-black italic uppercase tracking-tighter">
                                                            {formatFlightTime(seg.departure.at, language)}
                                                        </p>
                                                        <p className="text-[7px] sm:text-[8px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5 sm:mt-1">
                                                            {seg.departure.iataCode} • {formatFlightDate(seg.departure.at, language)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-3xl font-black italic uppercase tracking-tighter">
                                                            {formatFlightTime(seg.arrival.at, language)}
                                                        </p>
                                                        <p className="text-[7px] sm:text-[8px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mt-0.5 sm:mt-1">
                                                            {seg.arrival.iataCode} • {formatFlightDate(seg.arrival.at, language)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-zinc-800/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800/50 shadow-sm">
                                                    <img
                                                        src={`https://images.kiwi.com/airlines/64/${seg.carrierCode}.png`}
                                                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                                        alt="Airline"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-[7px] sm:text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                                                            {seg.carrierCode} {seg.number}
                                                        </p>
                                                        <p className="text-[7px] sm:text-[9px] font-bold text-zinc-400 uppercase mt-0.5">
                                                            {formatISO8601Duration(seg.duration, language)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    <div className="bg-zinc-900 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 space-y-4 sm:space-y-6">
                            <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic uppercase leading-tight tracking-tighter">
                                {t("profile.flights.details.interested")}
                            </h3>
                            <p className="text-zinc-400 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm font-medium leading-relaxed">
                                {t("profile.flights.details.aiPromo")}
                            </p>
                            <button
                                onClick={() => router.push(`/ai-planner?destination=${encodeURIComponent(destName)}`)}
                                className="w-full bg-[var(--brand-color)] hover:brightness-110 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-[0.2em] transition-all shadow-lg active:scale-95"
                            >
                                {t("profile.flights.details.planNow")}
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                            <Plane size={100} />
                        </div>
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
                            <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase text-zinc-400 italic">{t("common.totalPrice") || "GESAMTPREIS"}</span>
                            <div className="flex items-baseline gap-1">
                                {savedFlight.price ? (
                                    <>
                                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl font-black italic">{Math.round(savedFlight.price.total)}</span>
                                        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-bold uppercase opacity-60">{savedFlight.price.currency}</span>
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
                                onClick={() => window.open(`https://www.google.com/travel/flights?q=flights+to+${destName}`, '_blank')}
                                className="w-full h-12 rounded-2xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] tracking-[0.15em] shadow-xl hover:shadow-2xl active:scale-95 transition-all relative overflow-hidden group/btn bg-[var(--brand-color)]"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10">JETZT BUCHEN</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-4 sm:space-y-6">
                        <h4 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">
                            {t("profile.flights.details.quickInfo")}
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { icon: <Landmark size={16} />, label: t("profile.flights.details.landmarks"), value: "8 UNESCO" },
                                { icon: <Utensils size={16} />, label: t("profile.flights.details.food"), value: "Spicy & Fresh" },
                                { icon: <Globe size={16} />, label: t("profile.flights.details.language"), value: "English & Local" }
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
