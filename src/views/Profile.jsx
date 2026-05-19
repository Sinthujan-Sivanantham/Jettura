"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { Plus, Loader2, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Importiere die neuen Komponenten aus dem components Ordner
import ProfileHeader from "../components/profile/ProfileHeader";
import PostList from "../components/profile/PostList";
import SavedFlightsList from "../components/profile/SavedFlightsList";
import SavedHotelsList from "../components/profile/SavedHotelsList";
import CreatePostModal from "../components/profile/CreatePostModal";
import StatusPopup from "../components/ui/StatusPopup";
import { useLanguage } from "../context/LanguageContext";
import { Plane, BookOpen, Hotel } from "lucide-react";

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [savedFlights, setSavedFlights] = useState([]);
  const [savedHotels, setSavedHotels] = useState([]);
  const [activeTab, setActiveTab] = useState("stories");
  const [isPosting, setIsPosting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "", title: "", type: "error" });

  const showAlert = (message, title = t("profile.post.alertTitle"), type = "error") => {
    setAlertConfig({ isOpen: true, message, title, type });
  };

  const fetchProfileData = useCallback(async () => {
    if (!user) return;
    setFetching(true);

    // Fetch Profile
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    setProfile(prof);

    // Fetch Posts
    const { data: posts } = await supabase.from("posts").select("*").eq("author_id", user.id).order('created_at', { ascending: false });
    setMyPosts(posts || []);

    // Fetch Saved Flights
    const { data: flights } = await supabase.from("saved_flights").select("*").eq("user_id", user.id).order('created_at', { ascending: false });
    setSavedFlights(flights || []);

    // Fetch Saved Hotels
    const { data: hotels } = await supabase.from("saved_hotels").select("*").eq("user_id", user.id).order('created_at', { ascending: false });
    setSavedHotels(hotels || []);

    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchProfileData();
    else setFetching(false);
  }, [user, fetchProfileData]);

  async function handleAvatarUpload(event) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      await supabase.storage.from('avatars').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

      // Upsert ensures we create the profile if it doesn't exist (e.g. missing trigger)
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl });

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch {
      showAlert(t("profile.avatar.error"), t("profile.avatar.errorTitle"));
    } finally {
      setUploading(false);
    }
  }

  const handleDeletePost = async (postId) => {
    // Confirmation handled in UI component

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      setMyPosts(prev => prev.filter(p => p.id !== postId));
    } catch (e) {
      console.error("Delete error:", e);
      showAlert(e.message, "Error");
    }
  };

  if (fetching) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin" style={{ color: "var(--brand-color)" }} size={40} /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-2">
          <Lock size={32} className="text-zinc-400" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black italic uppercase tracking-tight text-zinc-900 dark:text-white">
            {t("profile.login.title")}
          </h3>
          <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            {t("profile.login.description")}
          </p>
        </div>
        <Link to="/auth">
          <button
            className="h-12 px-8 rounded-xl text-white font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 hover:opacity-90"
            style={{ backgroundColor: "var(--brand-color)" }}
          >
            {t("profile.login.button")}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-16">

      {/* HEADER KOMPONENTE */}
      <ProfileHeader
        profile={profile}
        user={user}
        uploading={uploading}
        onUpload={handleAvatarUpload}
      />

      {/* AKTIONSLEISTE & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 border-b border-zinc-100 dark:border-zinc-800 pb-6 sm:pb-8">
        {/* Tab Switcher */}
        {/* Tab Switcher */}
        <div className="flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-[1.2rem] sm:p-1.5 sm:rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm w-full md:w-auto">
          <button
            onClick={() => setActiveTab("stories")}
            className={`w-full md:w-auto flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 md:py-2 rounded-[1rem] sm:rounded-[1.2rem] text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] md:text-[10px] font-black uppercase italic tracking-widest transition-all ${activeTab === "stories"
              ? "bg-white dark:bg-zinc-800 text-[var(--brand-color)] shadow-sm"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
          >
            <BookOpen size={14} /> {t("profile.tabs.stories")}
          </button>
          <button
            onClick={() => setActiveTab("flights")}
            className={`w-full md:w-auto flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 md:py-2 rounded-[1rem] sm:rounded-[1.2rem] text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] md:text-[10px] font-black uppercase italic tracking-widest transition-all ${activeTab === "flights"
              ? "bg-white dark:bg-zinc-800 text-[var(--brand-color)] shadow-sm"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
          >
            <Plane size={14} /> {t("profile.tabs.savedFlights")}
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`w-full md:w-auto flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 md:py-2 rounded-[1rem] sm:rounded-[1.2rem] text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-[11px] md:text-[10px] font-black uppercase italic tracking-widest transition-all ${activeTab === "hotels"
              ? "bg-white dark:bg-zinc-800 text-[var(--brand-color)] shadow-sm"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
          >
            <Hotel size={14} /> {t("profile.hotels.savedCount") || "Hotels"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
          <Button
            onClick={() => setIsPosting(true)}
            className="w-full sm:w-auto hover:opacity-90 text-white rounded-xl sm:rounded-2xl px-6 sm:px-8 font-black italic uppercase text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] h-11 sm:h-12 shadow-xl gap-2 transition-all active:scale-95"
            style={{ backgroundColor: "var(--brand-color)" }}
          >
            <Plus size={14} /> {t("profile.post.newStory")}
          </Button>

          <button
            onClick={() => supabase.auth.signOut()}
            className="text-zinc-400 hover:text-red-500 font-black uppercase text-[7px] sm:text-[8px] sm:text-[9px] tracking-widest transition-all flex items-center gap-2 italic px-4 py-2"
          >
            <LogOut size={12} /> {t("nav.logout")}
          </button>
        </div>
      </div>

      {/* CONTENT BASED ON TAB */}
      <div className="min-h-[400px]">
        {activeTab === "stories" ? (
          <PostList posts={myPosts} onDelete={handleDeletePost} />
        ) : activeTab === "flights" ? (
          <SavedFlightsList
            flights={savedFlights}
            onUnsave={(flightId) => {
              setSavedFlights(prev => prev.filter(f => f.flight_id !== flightId));
            }}
          />
        ) : (
          <SavedHotelsList
            hotels={savedHotels}
            onUnsave={(hotelId) => {
              setSavedHotels(prev => prev.filter(h => h.id !== hotelId));
            }}
          />
        )}
      </div>

      {/* MODAL KOMPONENTE */}
      <AnimatePresence>
        {isPosting && (
          <CreatePostModal
            userId={user.id}
            onClose={() => setIsPosting(false)}
            onSuccess={() => { setIsPosting(false); fetchProfileData(); }}
          />
        )}
      </AnimatePresence>

      <StatusPopup
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        message={alertConfig.message}
        title={alertConfig.title}
        type={alertConfig.type}
      />
    </div>
  );
}