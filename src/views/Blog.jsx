import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/home/hero/Hero";
import BlogForm from "../components/blog/BlogForm";
import BlogEmptyState from "../components/blog/BlogEmptyState";
import BlogCard from "../components/blog/BlogCard";

/**
 * HAUPT-KOMPONENTE: Blog
 */
export default function Blog() {
  const { language: lang, t } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Supabase Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    // Confirmation handled in UI component

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (e) {
      console.error("Delete error:", e);
      alert("Error deleting post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 pb-20">
      <Hero
        title={<span style={{ color: "var(--brand-color)" }}>{t("blog.title")}</span>}
        subtitle={t("blog.description")}
        tag={t("blog.tag")}
        isCompact={true}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full flex justify-center"
        >
          <BlogForm onPostCreated={fetchPosts} />
        </motion.div>
      </Hero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Content Bereich */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin" style={{ color: "var(--brand-color)" }} />
            <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              {t("blog.loading")}
            </p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {posts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                lang={lang}
                index={index}
                currentUser={user}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        ) : (
          <BlogEmptyState lang={lang} />
        )}
      </div>
    </div>
  );
}
