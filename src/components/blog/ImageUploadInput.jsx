import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";

export default function ImageUploadInput({ onFileSelect, label, lang = "de" }) {
  const [fileName, setFileName] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setFileName(null);
    onFileSelect(null);
  };

  return (
    <div className="relative group mt-2">
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <label
        htmlFor="image-upload"
        className={`
          flex flex-col items-center justify-center gap-3 p-10 rounded-[3rem] border border-dashed 
          cursor-pointer transition-all duration-300 min-h-[160px]
          ${fileName
            ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-400/50"
            : "bg-zinc-50/50 dark:bg-[#09090b] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}
        `}
      >
        <div className={`
          transition-all
          ${fileName ? "text-blue-600 dark:text-blue-400" : "text-zinc-200 dark:text-zinc-700"}
        `}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>

        <div className="text-center">
          <p className={`text-[7px] sm:text-[8px] sm:text-[9px] font-black uppercase italic tracking-[0.25em] ${fileName ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"}`}>
            {lang === "de" ? "BILD AUSWÄHLEN" : "UPLOAD PHOTO"}
          </p>
          {fileName && (
            <button
              onClick={handleRemove}
              className="mt-2 text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] font-black uppercase italic text-red-500 hover:text-red-400 transition-colors"
            >
              ENTFERNEN
            </button>
          )}
        </div>
      </label>
    </div>
  );
}