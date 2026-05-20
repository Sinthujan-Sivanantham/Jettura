import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export default function Hero({ children, title, subtitle, tag, isCompact }) {
  const { t } = useLanguage();

  // Defaults if no props provided
  const displayTitle = title || <>{t("hero.title")} <span style={{ color: "var(--brand-color)" }}>Jettura</span></>;
  const displaySubtitle = subtitle || t("hero.subtitle");
  const displayTag = tag || t("hero.tag");

  const backgroundImages = [
    "/a1.png", "/a2.png", "/a3.png", "/a4.png",
    "/n1.png", "/n2.png",
    "/se1.png", "/se2.png", "/se3.png", "/se4.png",
    "/Phoenix_10_I_need_background_images_like_Australia_and_more_fe_3.jpg"
  ];

  // Zufälliges Bild beim Rendern auswählen
  const randomImage = useRef(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }}
      className={`relative overflow-hidden bg-slate-950 rounded-2xl sm:rounded-[4rem] mx-2 sm:mx-6 mt-2 sm:mt-6 border-transparent shadow-none pt-8 min-[760px]:pt-16 pb-0 transition-all duration-700 ${isCompact ? 'min-h-[45vh] md:min-h-[50vh]' : 'min-h-[85vh] md:min-h-[90vh]'}`}
    >
      {/* Background Container with "Glow" and Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <motion.img
          key={randomImage.current}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.1, filter: "brightness(0.5) blur(10px)" }}
          animate={isLoaded ? {
            opacity: 1,
            scale: 1,
            filter: "brightness(0.8) saturate(1.2) contrast(1.1) blur(0px)",
          } : { opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          src={randomImage.current}
          alt="Travel Background"
          className="w-full h-full object-cover"
        />

        {/* Dynamic Glow Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--brand-color)]/5 to-slate-950 mix-blend-overlay opacity-80" />

        {/* Main Darkening Gradient for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/20 to-slate-950" />

        {/* Subtle Ambient Light Source */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-[var(--brand-color)]/10 blur-[150px] rounded-full"
        />
      </div>

      {/* Text content – full width, centered */}
      <div
        className="relative z-10 px-4 sm:px-6 mb-8 min-[760px]:mb-24"
        style={{ width: '100%', textAlign: 'center' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-blue-300 uppercase tracking-widest mb-3 sm:mb-4 fluid-xs"
        >
          <Sparkles size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
          <span>{displayTag}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="fluid-h1 font-black tracking-tight mb-3 sm:mb-4 drop-shadow-lg italic uppercase leading-tight text-white"
          style={{ textAlign: 'center' }}
        >
          {displayTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="fluid-p text-white/90 leading-relaxed font-medium drop-shadow-md italic"
          style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto' }}
        >
          {displaySubtitle}
        </motion.p>
      </div>

      {children && (
        <div className="relative z-20 w-full flex justify-center mt-auto">
          {children}
        </div>
      )}
    </section>
  );
}
