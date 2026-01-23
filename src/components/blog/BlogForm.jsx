import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabase";
import StatusPopup from "../ui/StatusPopup";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { z } from "zod";

export default function BlogForm({ onPostCreated }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({ title: "", content: "", location: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, message: "", title: "", type: "error" });

  const showAlert = (message, title = t("profile.post.alertTitle"), type = "error") => {
    setAlertConfig({ isOpen: true, message, title, type });
  };

  async function handlePost() {
    if (!user) return showAlert(t("profile.login.description"), t("profile.login.title"));

    // Validierung (Basic)
    if (!form.title || !form.content) {
      return showAlert(t("profile.post.fillAllFields"), t("profile.post.missingInput"));
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `blog/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('blog-images').upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('posts').insert([{
        author_id: user.id,
        title: form.title,
        content: form.content,
        location: form.location,
        image_url: imageUrl
      }]);

      if (error) throw error;

      setIsOpen(false);
      setForm({ title: "", content: "", location: "" });
      setImageFile(null);
      onPostCreated();

    } catch (error) {
      console.error("Post creation error:", error);
      showAlert(t("profile.post.createError"), t("profile.post.syncError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!user}
        className="mb-10 w-full max-w-sm h-16 sm:h-20 bg-[#ff7b1c] hover:bg-[#ff8c3a] text-white font-[1000] italic uppercase tracking-[0.1em] text-lg sm:text-xl rounded-[2.5rem] shadow-2xl shadow-[#ff7b1c]/30 transition-all active:scale-[0.98] group overflow-hidden relative border-none"
      >
        <span className="relative z-10 inline-flex items-center gap-3">
          {user ? t("profile.post.newStory") : t("profile.post.loginToPost")}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#09090b] w-full max-w-[500px] rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-0 border-none overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-12 pb-2 flex justify-between items-center">
                <h2 className="text-[2.2rem] font-[1000] italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                  {t("profile.post.newStory")}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-11 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <X className="text-zinc-400 text-lg" size={20} />
                </button>
              </div>

              {/* Formular */}
              <div className="space-y-6 px-12 pb-12 text-left">
                {/* Titel */}
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1 mb-2 block italic">
                    {t("profile.post.title")}
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-16 rounded-[1.5rem] focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-base shadow-sm px-6 outline-none"
                    placeholder={t("profile.post.titlePlaceholder")}
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                {/* Ort */}
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1 mb-2 block italic">
                    {t("profile.post.location")}
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-16 rounded-[1.5rem] focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-base shadow-sm px-6 outline-none"
                    placeholder={t("profile.post.locationPlaceholder")}
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                </div>

                {/* Geschichte */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1 block italic">
                      {t("profile.post.story")}
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!form.location) return showAlert(t("profile.post.locationRequired"), t("profile.post.missingInput"));

                        setLoading(true);
                        try {
                          // Simulated AI generation based on location
                          await new Promise(r => setTimeout(r, 1500));

                          const aiContent = language === "de"
                            ? `Mein Trip nach ${form.location} war einfach unvergesslich! Die Atmosphäre dort ist magisch. Besonders gefallen hat mir die lokale Kultur und die versteckten Ecken abseits der Touristenpfade. Ich kann jedem nur empfehlen, ${form.location} selbst zu erleben!`
                            : `My trip to ${form.location} was absolutely unforgettable! The atmosphere there is magical. I especially loved the local culture and the hidden spots off the beaten path. I highly recommend everyone to experience ${form.location} for themselves!`;

                          setForm(prev => ({
                            ...prev,
                            content: aiContent
                          }));

                        } catch (e) {
                          showAlert(t("profile.post.aiError"), "Error");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="text-[8px] font-black uppercase tracking-widest text-[#ff7b1c] hover:text-[#ff8c3a] transition-colors flex items-center gap-1"
                    >
                      {t("profile.post.generateAI")}
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 min-h-[160px] rounded-[1.5rem] focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-base shadow-sm p-6 outline-none resize-none relative z-10"
                    placeholder={t("profile.post.storyPlaceholder")}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                  />
                </div>

                {/* Bild Upload */}
                <label className={`
                  flex flex-col items-center justify-center gap-3 p-10 rounded-[2.5rem] border border-dashed 
                  cursor-pointer transition-all duration-300 min-h-[160px] group
                  ${imageFile
                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-400/50"
                    : "bg-zinc-50/50 dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}
                `}>
                  {imageFile ? (
                    <>
                      <div className="text-blue-600 dark:text-blue-400">
                        <ImageIcon size={48} strokeWidth={1} />
                      </div>
                      <span className="text-[10px] font-black uppercase italic tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        {imageFile.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="text-zinc-300 dark:text-zinc-600 transition-all group-hover:text-zinc-400 dark:group-hover:text-zinc-500">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                      <span className="text-[9px] font-black uppercase italic tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
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
                  className="w-full h-16 bg-[#ff7b1c] hover:bg-[#ff8c3a] text-white font-[1000] uppercase italic tracking-[0.1em] rounded-[2rem] shadow-2xl shadow-[#ff7b1c]/20 border-none text-base mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} className="relative -top-0.5 mr-1" />
                      {t("profile.post.postStory")}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <StatusPopup
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        message={alertConfig.message}
        title={alertConfig.title}
        type={alertConfig.type}
      />
    </>
  );
}
