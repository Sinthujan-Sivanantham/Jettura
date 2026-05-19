"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { translations } from "../lib/translations";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { MapPin, Navigation } from "lucide-react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostContent from "@/components/blog/BlogPostContent";
import BlogPostCTA from "@/components/blog/BlogPostCTA";

export default function BlogPost() {
  const { language: lang } = useLanguage();
  const { theme } = useTheme();
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);
  // Fallback if lang is not yet loaded, though useLanguage should handle it.
  const t = translations[lang] || translations.de;
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setPost(data);

        // Geocoding the location
        if (data.location && mapToken) {
          const fetchCoords = async () => {
            try {
              const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(data.location)}.json?access_token=${mapToken}&limit=1`);
              const json = await res.json();
              if (json.features && json.features.length > 0) {
                const [lng, lat] = json.features[0].center;
                setCoords({ lat, lng });
              }
            } catch (err) {
              console.error("Geocoding error:", err);
            }
          };
          fetchCoords();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, mapToken]);

  if (loading)
    return (
      <div className="text-center py-32 font-black uppercase tracking-widest" style={{ color: "var(--brand-color)" }}>
        {t.blog.post.loading}
      </div>
    );
  if (!post)
    return (
      <div className="text-center py-32 font-black uppercase tracking-widest text-zinc-500">
        {t.blog.post.notFound}
      </div>
    );

  const images = post.image_url ? post.image_url.split(',') : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12"
    >
      <BlogPostHeader
        title={post.title}
        date={post.created_at}
        onBack={() => router.back()}
        lang={lang}
      />

      {images.length > 0 && (
        <div className="relative w-full overflow-x-auto snap-x snap-mandatory flex gap-4 sm:gap-6 pb-4 -mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((imgUrl, index) => (
            <div key={index} className="relative group overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl aspect-[4/5] min-[560px]:aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 flex-none w-full max-w-[100%] snap-center">
              <img
                src={imgUrl}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Location Overlay */}
              {index === 0 && post.location && (
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2 shadow-xl border border-white/20"
                  >
                    <div className="bg-[#3b60ff] p-1 rounded sm:p-1.5 sm:rounded-lg text-white shadow-lg">
                      <MapPin size={12} strokeWidth={3} />
                    </div>
                    <span className="font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-sm tracking-widest dark:text-white">
                      {post.location}
                    </span>
                  </motion.div>
                </div>
              )}

              {/* Small Map View Overlay */}
              {index === 0 && coords && mapToken && (
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
          ))}
        </div>
      )}

      <BlogPostContent content={post.content} />

      <BlogPostCTA onNavigate={() => router.push(`/ai-planner?destination=${encodeURIComponent(post.location || post.title)}`)} lang={lang} />
    </motion.div>
  );
}
