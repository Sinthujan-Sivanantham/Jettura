export default function BlogPostContent({ content }) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      {content.split("\n").map((para, i) => (
        <p
          key={i}
          className="mb-6 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium opacity-90"
        >
          {para}
        </p>
      ))}
    </div>
  );
}
