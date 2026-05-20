import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger as TabsTriggerBase, TabsContent } from "@/components/ui/tabs";
import FlightResultCard from "../../flights/results/FlightResultCard";
import HotelResultCard from "../../hotels/results/HotelResultCard";
import BlogCard from "../../blog/BlogCard";
import { useLanguage } from "../../../context/LanguageContext";

// --- MOCK DATA FOR SHOWCASE ---

const mockDictionaries = {
  locations: {
    BER: { code: "BER", cityCode: "BER", countryCode: "DE" },
    HND: { code: "HND", cityCode: "TYO", countryCode: "JP" },
    JFK: { code: "JFK", cityCode: "NYC", countryCode: "US" },
    LHR: { code: "LHR", cityCode: "LON", countryCode: "GB" }
  },
  carriers: {
    LH: "Lufthansa",
    JL: "Japan Airlines",
    UA: "United Airlines",
    BA: "British Airways",
    SQ: "Singapore Airlines"
  },
  aircraft: {
    "359": "Airbus A350-900",
    "789": "Boeing 787-9 Dreamliner",
    "388": "Airbus A380-800"
  },
  currencies: {
    EUR: "€",
    USD: "$"
  }
};

const mockFlight = {
  id: "showcase-flight-1",
  type: "flight-offer",
  price: { total: "1280.00", currency: "EUR" },
  itineraries: [
    {
      duration: "PT13H30M",
      segments: [
        {
          departure: { iataCode: "BER", at: "2024-06-15T10:30:00" },
          arrival: { iataCode: "HND", at: "2024-06-16T06:00:00" },
          carrierCode: "JL",
          number: "408",
          aircraft: { code: "359" },
          duration: "PT13H30M"
        }
      ]
    },
    {
      duration: "PT14H15M",
      segments: [
        {
          departure: { iataCode: "HND", at: "2024-06-25T22:30:00" },
          arrival: { iataCode: "BER", at: "2024-06-26T06:45:00" },
          carrierCode: "JL",
          number: "407",
          aircraft: { code: "359" },
          duration: "PT14H15M"
        }
      ]
    }
  ],
  validatingAirlineCodes: ["JL"]
};

const mockHotel = {
  id: "showcase-hotel-1",
  name: "Aman Tokyo",
  rating: 5,
  address: {
    lines: ["The Otemachi Tower"],
    city: "Tokyo",
    postalCode: "100-0004",
    country: "Japan"
  },
  price: { total: "850.00", currency: "EUR", perNight: "850.00" },
  amenities: ["WIFI", "POOL", "RESTAURANT", "GYM", "SPA"],
  description: "An urban sanctuary high above the atmospheric whirl of tradition and modernity.",
  distance: { value: 0.5, unit: "KM" }
};

const mockPost = {
  id: "showcase-blog-1",
  title: "Tokyo: A Cyberpunk Dream",
  content: "From the neon lights of Shinjuku to the quiet temples of Asakusa, Tokyo is a city of contrasts. My journey started with...",
  image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop",
  created_at: "2024-05-12T10:00:00Z",
  author_id: "demo"
};

export default function Features() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("flights");

  // Fix for translation loading
  const tSafe = (key, fallback) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  return (
    <section className="w-full relative pt-6 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(59,96,255,0.03)_0%,rgba(0,0,0,0)_50%)] pointer-events-none" />

      <div className="text-center space-y-6 mb-16 relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
        >
          <span className="search-label-text font-black uppercase tracking-[0.2em] text-[var(--brand-color)]">
            {tSafe("features.badge", "Premium Experience")}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="fluid-h1 font-[1000] italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-[0.9] text-center"
        >
          {tSafe("features.headline", "One App Everything.")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 dark:text-zinc-400 fluid-p max-w-2xl mx-auto font-medium text-center"
        >
          {tSafe("features.subheadline", "From AI-powered flight search to curated hotels and community stories. Experience the future of travel planning.")}
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <Tabs defaultValue="flights" onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 h-auto gap-2">
              {["flights", "hotels", "blog"].map((tab) => (
                <TabsTriggerBase
                  key={tab}
                  value={tab}
                  className="rounded-full px-6 py-2.5 search-input-text font-black uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-[var(--brand-color)] data-[state=active]:shadow-lg transition-all"
                >
                  {tab === "flights" && (t("common.flights") || "Flights")}
                  {tab === "hotels" && (t("common.hotels") || "Hotels")}
                  {tab === "blog" && (t("common.blog") || "Stories")}
                </TabsTriggerBase>
              ))}
            </TabsList>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                {activeTab === "flights" && (
                  <div className="transform scale-[0.85] sm:scale-100 origin-top transition-all duration-500 hover:scale-[0.87] sm:hover:scale-[1.02]">
                    {/* Wrap in div to handle scaling if needed */}
                    <FlightResultCard
                      flight={mockFlight}
                      dictionaries={mockDictionaries}
                      isSavedView={false}
                    />
                  </div>
                )}
                {activeTab === "hotels" && (
                  <div className="transform scale-[0.85] sm:scale-100 origin-top max-w-2xl mx-auto transition-all duration-500 hover:scale-[0.87] sm:hover:scale-[1.02]">
                    <HotelResultCard
                      hotel={mockHotel}
                      isSavedView={false}
                    />
                  </div>
                )}
                {activeTab === "blog" && (
                  <div className="max-w-xl mx-auto transform scale-[0.9] sm:scale-100 origin-top transition-all duration-500 hover:scale-[0.92] sm:hover:scale-[1.02]">
                    <div className="bg-transparent"> {/* Wrapper to isolate styles */}
                      <BlogCard
                        post={mockPost}
                        index={0}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] pointer-events-none" />
    </section>
  );
}
