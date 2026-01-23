import { useState } from "react";
import { motion } from "framer-motion";
import { X, Image as ImageIcon, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabase";
import StatusPopup from "../ui/StatusPopup";
import { useLanguage } from "@/context/LanguageContext";

export default function CreatePostModal({ onClose, onSuccess, userId }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ title: "", content: "", location: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    title: "",
    type: "error"
  });

  const showAlert = (message, title = t("profile.post.alertTitle"), type = "error") => {
    setAlertConfig({ isOpen: true, message, title, type });
  };

  async function handlePost() {
    // Validierung
    if (!form.title || !imageFile || !form.content) {
      return showAlert(
        t("profile.post.fillAllFields"),
        t("profile.post.missingInput")
      );
    }

    setLoading(true);

    try {
      // Bild hochladen
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      await supabase.storage
        .from('post-images')
        .upload(filePath, imageFile);

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      // Post erstellen
      await supabase.from('posts').insert([{
        author_id: userId,
        title: form.title,
        content: form.content,
        location: form.location,
        image_url: publicUrl
      }]);

      onSuccess();
    } catch (error) {
      console.error("Post creation error:", error);
      showAlert(
        t("profile.post.createError"),
        t("profile.post.syncError")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-[#09090b] w-full max-w-[500px] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-0 border-none overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 sm:p-10 pb-4 flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-[1000] italic uppercase tracking-tight text-zinc-900 dark:text-white leading-none">
            {t("profile.post.newStory")}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
          >
            <div className="text-zinc-400 text-sm sm:text-base">✕</div>
          </button>
        </div>

        {/* Formular */}
        <div className="space-y-4 sm:space-y-5 px-6 sm:px-10 pb-8 sm:pb-10 text-left overflow-y-auto max-h-[80vh]">
          {/* Titel */}
          <div className="space-y-1">
            <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 ml-1 mb-1 sm:mb-2 block italic">
              {t("profile.post.title")}
            </label>
            <input
              className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-12 sm:h-14 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-xs sm:text-sm shadow-sm px-4 sm:px-6 outline-none"
              placeholder={t("profile.post.titlePlaceholder")}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Ort */}
          <div className="space-y-1">
            <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 ml-1 mb-1 sm:mb-2 block italic">
              {t("profile.post.location")}
            </label>
            <input
              className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-12 sm:h-14 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-xs sm:text-sm shadow-sm px-4 sm:px-6 outline-none"
              placeholder={t("profile.post.locationPlaceholder")}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* Geschichte */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1 mb-1 sm:mb-2">
              <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 block italic">
                {t("profile.post.story")}
              </label>
              <button
                onClick={async () => {
                  if (!form.location) return showAlert(t("profile.post.locationRequired"), t("profile.post.missingInput"));
                  setLoading(true);
                  try {
                    // Simuliere KI-Generierung basierend auf Ort
                    // In einer echten App würde hier ein API-Call zu OpenAI/Gemini erfolgen
                    const aiContent = language === "de"
                      ? `Mein Trip nach ${form.location} war einfach unvergesslich! Die Atmosphäre dort ist magisch. Besonders gefallen hat mir die lokale Kultur und die versteckten Ecken abseits der Touristenpfade. Ich kann jedem nur empfehlen, ${form.location} selbst zu erleben!`
                      : `My trip to ${form.location} was absolutely unforgettable! The atmosphere there is magical. I especially loved the local culture and the hidden spots off the beaten path. I highly recommend everyone to experience ${form.location} for themselves!`;

                    setForm(prev => ({ ...prev, content: aiContent }));
                  } catch (err) {
                    showAlert(t("profile.post.aiError"), "AI Error");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="text-[8px] sm:text-[9px] font-black text-[var(--brand-color)] uppercase italic tracking-wider hover:opacity-70 transition-all flex items-center gap-1"
              >
                {t("profile.post.generateAI") || "✨ KI GENERIEREN"}
              </button>
            </div>
            <textarea
              className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 min-h-[100px] sm:min-h-[140px] rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-xs sm:text-sm shadow-sm p-4 sm:p-6 outline-none resize-none"
              placeholder={t("profile.post.storyPlaceholder")}
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
            />
          </div>

          {/* Bild Upload */}
          <label className={`
            flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-dashed 
            cursor-pointer transition-all duration-300 min-h-[100px] sm:min-h-[140px] group
            ${imageFile
              ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-400/50"
              : "bg-zinc-50/50 dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}
          `}>
            {imageFile ? (
              <>
                <div className="text-blue-600 dark:text-blue-400">
                  <ImageIcon size={30} sm:size={40} strokeWidth={1} />
                </div>
                <span className="text-[8px] sm:text-[10px] font-black uppercase italic tracking-[0.2em] text-blue-600 dark:text-blue-400 max-w-full truncate px-2 text-center">
                  {imageFile.name}
                </span>
              </>
            ) : (
              <>
                <div className="text-zinc-300 dark:text-zinc-600 transition-all group-hover:text-zinc-400 dark:group-hover:text-zinc-500">
                  <svg width="30" height="30" sm:width="40" sm:height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase italic tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
                  {t("profile.post.uploadPhoto")}
                </span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
            />
          </label>

          {/* Submit Button */}
          <Button
            onClick={handlePost}
            disabled={loading}
            className="w-full h-12 sm:h-14 bg-[#ff7b1c] hover:bg-[#ff8c3a] text-white font-[1000] uppercase italic tracking-widest rounded-xl sm:rounded-2xl shadow-2xl shadow-[#ff7b1c]/20 border-none text-[10px] sm:text-sm mt-2 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <Send size={14} sm:size={16} className="relative -top-0.5" />
                {t("profile.post.postStory")}
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Status Popup */}
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