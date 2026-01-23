export default function BlogPostContent({ content }) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      {content.split("\n").map((para, i) => (
        <p
          key={i}
          className="mb-6 text-xl md:text-2xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium opacity-90"
        >
          {para}
        </p>
      ))}
    </div>
  );
}
