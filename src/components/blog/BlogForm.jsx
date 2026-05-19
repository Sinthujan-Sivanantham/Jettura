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
  const [imageFiles, setImageFiles] = useState([]);
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
      if (imageFiles.length > 0) {
        const uploadedUrls = [];
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const filePath = `blog/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('blog-images').upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
          uploadedUrls.push(data.publicUrl);
        }
        imageUrl = uploadedUrls.join(",");
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
      setImageFiles([]);
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
        className="mb-8 w-full max-w-[280px] sm:max-w-sm h-12 sm:h-16 bg-[#ff7b1c] hover:bg-[#ff8c3a] text-white font-[1000] italic uppercase tracking-[0.1em] text-xs sm:text-sm md:text-base rounded-[2rem] shadow-2xl shadow-[#ff7b1c]/30 transition-all active:scale-[0.98] group overflow-hidden relative border-none"
      >
        <span className="relative z-10 inline-flex items-center gap-3">
          {user ? t("profile.post.newStory") : t("profile.post.loginToPost")}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 py-24 sm:p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-[#09090b] w-[90%] sm:w-full max-w-[380px] sm:max-w-[480px] rounded-[2rem] sm:rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-0 border-none overflow-hidden relative"
              >
              {/* Header */}
              <div className="p-6 sm:p-12 sm:pb-2 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md z-20">
                <h2 className="text-[1.5rem] sm:text-[2.2rem] font-[1000] italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-none">
                  {t("profile.post.newStory")}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
                >
                  <X className="text-zinc-400 text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg" size={20} />
                </button>
              </div>

              {/* Formular */}
              <div className="space-y-4 sm:space-y-6 px-6 pb-6 sm:px-12 sm:pb-12 text-left">
                {/* Titel */}
                <div className="space-y-1">
                  <label className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1 mb-2 block italic">
                    {t("profile.post.title")}
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-12 md:h-14 rounded-xl md:rounded-[1.5rem] focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-xs sm:text-sm md:text-base shadow-sm px-6 outline-none"
                    placeholder={t("profile.post.titlePlaceholder")}
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                {/* Ort */}
                <div className="space-y-1">
                  <label className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1 mb-2 block italic">
                    {t("profile.post.location")}
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 h-12 md:h-14 rounded-xl md:rounded-[1.5rem] focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-xs sm:text-sm md:text-base shadow-sm px-6 outline-none"
                    placeholder={t("profile.post.locationPlaceholder")}
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                </div>

                {/* Geschichte */}
                <div className="space-y-1">
                  <div className="mb-2">
                    <label className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1 block italic">
                      {t("profile.post.story")}
                    </label>
                  </div>
                  <textarea
                    className="w-full bg-white dark:bg-[#18181b] border-2 border-zinc-50 dark:border-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 min-h-[160px] rounded-[1.5rem] focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600/30 transition-all font-bold text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base shadow-sm p-6 outline-none resize-none relative z-10"
                    placeholder={t("profile.post.storyPlaceholder")}
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                  />
                </div>

                {/* Bild Upload */}
                <label className={`
                  flex flex-col items-center justify-center gap-2 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-dashed 
                  cursor-pointer transition-all duration-300 min-h-[80px] sm:min-h-[100px] group
                  ${imageFiles.length > 0
                    ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-400/50"
                    : "bg-zinc-50/50 dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}
                `}>
                  {imageFiles.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-1">
                        <ImageIcon size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-black uppercase italic tracking-[0.1em] text-blue-600 dark:text-blue-400 text-center">
                        {imageFiles.length} {imageFiles.length === 1 ? 'Bild' : 'Bilder'} ausgewählt
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="text-zinc-300 dark:text-zinc-600 transition-all group-hover:text-zinc-400 dark:group-hover:text-zinc-500">
                        <ImageIcon size={32} strokeWidth={1.5} />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase italic tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                        {t("profile.post.uploadPhoto")}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      if (e.target.files) {
                        setImageFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                </label>

                {/* Submit Button */}
                <Button
                  onClick={handlePost}
                  disabled={loading}
                  className="w-full h-12 sm:h-14 md:h-16 bg-[#ff7b1c] hover:bg-[#ff8c3a] text-white font-[1000] uppercase italic tracking-[0.1em] rounded-[2rem] shadow-2xl shadow-[#ff7b1c]/20 border-none text-[10px] sm:text-xs md:text-base mt-2 flex items-center justify-center gap-2 transition-all active:scale-95"
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
