import PostCard from "./PostCard";
import { useLanguage } from "@/context/LanguageContext";

export default function PostList({ posts, onDelete }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl font-black uppercase italic tracking-tighter dark:text-white">
          {t("profile.post.yourStories")}
        </h2>
        <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
        <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase">
          {posts.length} {t("profile.post.posts")}
        </span>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={onDelete} />
          ))
        ) : (
          <div className="col-span-full py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem] text-center">
            <p className="text-zinc-300 font-black uppercase italic text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs tracking-[0.2em]">
              {t("profile.post.noStories")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}