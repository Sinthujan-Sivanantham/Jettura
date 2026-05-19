"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ChevronDown, ChevronUp, X, Shield, BarChart2, Target, Wrench, Globe } from "lucide-react";

const STORAGE_KEY = "jettura_cookie_consent";

const translations = {
  de: {
    title: "Datenschutz & Cookies",
    subtitle: "Wir respektieren deine Privatsphäre",
    description:
      "Als Reisevermittler gemäß §13 TMG und DSGVO Art. 7 sind wir verpflichtet, deine ausdrückliche Einwilligung für nicht notwendige Cookies einzuholen. Bitte wähle, welche Cookies du erlaubst.",
    acceptAll: "Alle akzeptieren",
    rejectAll: "Alle ablehnen",
    saveSelection: "Auswahl speichern",
    customize: "Einstellungen anpassen",
    close: "Schließen",
    required: "Erforderlich",
    alwaysOn: "Immer aktiv",
    legalNote:
      "Gemäß DSGVO, TTDSG und der ePrivacy-Richtlinie hast du das Recht, nicht notwendige Cookies abzulehnen. Deine Einwilligung kannst du jederzeit in den Datenschutzeinstellungen widerrufen.",
    privacyLink: "Datenschutzerklärung",
    imprintLink: "Impressum",
    categories: {
      necessary: {
        label: "Notwendige Cookies",
        description:
          "Unverzichtbar für den Betrieb der Website. Ermöglichen grundlegende Funktionen wie Seitensicherheit, Netzwerkverwaltung und Erreichbarkeit. Diese können nicht deaktiviert werden.",
        examples: "Session-ID, CSRF-Schutz, Auth-Token, Spracheinstellung",
      },
      functional: {
        label: "Funktionale Cookies",
        description:
          "Ermöglichen erweiterte Funktionalität und Personalisierung, z. B. Reisepräferenzen, Währungsauswahl, gespeicherte Suchen und Buchungsfortschritte.",
        examples: "Suchwerlauf, Reisepräferenzen, Theme-Einstellung",
      },
      analytics: {
        label: "Analyse & Statistik",
        description:
          "Helfen uns zu verstehen, wie Besucher mit der Website interagieren. Alle Daten werden anonymisiert und ohne Personenbezug ausgewertet.",
        examples: "Seitenaufrufe, Verweildauer, Absprungrate (anonymisiert)",
      },
      marketing: {
        label: "Marketing & Werbung",
        description:
          "Werden verwendet, um Werbeanzeigen relevanter für dich zu gestalten. Sie verfolgen Besucher über Websites hinweg und speichern Interessen.",
        examples: "Retargeting, Google Ads, Facebook Pixel",
      },
      thirdParty: {
        label: "Drittanbieter (Karten & Zahlungen)",
        description:
          "Notwendig für die Nutzung von Mapbox (interaktive Karten), Stripe/PayPal (Zahlungsabwicklung) und Amadeus (Flug-/Hoteldaten). Diese Partner verarbeiten ggf. Daten außerhalb der EU.",
        examples: "Mapbox GL, Amadeus API, Stripe Payment",
      },
    },
  },
  en: {
    title: "Privacy & Cookies",
    subtitle: "We respect your privacy",
    description:
      "As a travel agency under German TMG §13 and GDPR Art. 7, we are required to obtain your explicit consent for non-essential cookies. Please choose which cookies you allow.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    saveSelection: "Save selection",
    customize: "Customize settings",
    close: "Close",
    required: "Required",
    alwaysOn: "Always on",
    legalNote:
      "Under GDPR, TTDSG and the ePrivacy Directive, you have the right to reject non-essential cookies. You can withdraw your consent at any time in the privacy settings.",
    privacyLink: "Privacy Policy",
    imprintLink: "Legal Notice",
    categories: {
      necessary: {
        label: "Necessary Cookies",
        description:
          "Essential for the website to function. They enable basic features like page security, network management and accessibility. These cannot be disabled.",
        examples: "Session ID, CSRF protection, Auth token, Language preference",
      },
      functional: {
        label: "Functional Cookies",
        description:
          "Enable enhanced functionality and personalisation, such as travel preferences, currency selection, saved searches and booking progress.",
        examples: "Search history, travel preferences, theme setting",
      },
      analytics: {
        label: "Analytics & Statistics",
        description:
          "Help us understand how visitors interact with the website. All data is anonymised and analysed without personal reference.",
        examples: "Page views, time on site, bounce rate (anonymised)",
      },
      marketing: {
        label: "Marketing & Advertising",
        description:
          "Used to make advertisements more relevant to you. They track visitors across websites and store interests.",
        examples: "Retargeting, Google Ads, Facebook Pixel",
      },
      thirdParty: {
        label: "Third-Party (Maps & Payments)",
        description:
          "Required for Mapbox (interactive maps), Stripe/PayPal (payment processing) and Amadeus (flight/hotel data). These partners may process data outside the EU.",
        examples: "Mapbox GL, Amadeus API, Stripe Payment",
      },
    },
  },
};

const categoryIcons = {
  necessary: Shield,
  functional: Wrench,
  analytics: BarChart2,
  marketing: Target,
  thirdParty: Globe,
};

const categoryColors = {
  necessary: "text-emerald-500 bg-emerald-500/10",
  functional: "text-blue-500 bg-blue-500/10",
  analytics: "text-purple-500 bg-purple-500/10",
  marketing: "text-orange-500 bg-orange-500/10",
  thirdParty: "text-cyan-500 bg-cyan-500/10",
};

const defaultConsent = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  thirdParty: false,
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lang, setLang] = useState("de");
  const [consent, setConsent] = useState(defaultConsent);
  const [openCategory, setOpenCategory] = useState(null);

  const t = translations[lang];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Show banner after short delay for UX
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const saveConsent = (consentObj) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...consentObj,
          timestamp: new Date().toISOString(),
          version: "1.0",
        })
      );
    } catch (e) {}
    setVisible(false);
  };

  const handleAcceptAll = () => {
    const all = { necessary: true, functional: true, analytics: true, marketing: true, thirdParty: true };
    setConsent(all);
    saveConsent(all);
  };

  const handleRejectAll = () => {
    const minimal = { ...defaultConsent };
    setConsent(minimal);
    saveConsent(minimal);
  };

  const handleSaveSelection = () => {
    saveConsent(consent);
  };

  const toggleCategory = (key) => {
    if (key === "necessary") return;
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]"
        >
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#3b60ff] via-purple-500 to-cyan-500 flex-shrink-0" />

          {/* Sticky Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-850 flex-shrink-0 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#3b60ff]/10 flex items-center justify-center text-[#3b60ff] flex-shrink-0">
                <Cookie size={20} />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg font-black italic uppercase tracking-tight text-zinc-900 dark:text-white leading-none">
                  {t.title}
                </h2>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#3b60ff] mt-0.5">{t.subtitle}</p>
              </div>
            </div>

            {/* Language toggle */}
            <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-0.5 sm:p-1 flex-shrink-0">
              {["de", "en"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[11px] font-black uppercase transition-all ${
                    lang === l
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  {l === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t.description}
            </p>

            {/* Customize toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-[11px] sm:text-[12px] font-black uppercase italic tracking-wider text-[#3b60ff] hover:opacity-80 transition-opacity"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {t.customize}
            </button>

            {/* Cookie Categories */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2 overflow-hidden"
                >
                  {Object.keys(defaultConsent).map((key) => {
                    const Icon = categoryIcons[key];
                    const colorClass = categoryColors[key];
                    const catT = t.categories[key];
                    const isNecessary = key === "necessary";
                    const isOpen = openCategory === key;

                    return (
                      <div
                        key={key}
                        className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-3 sm:p-4 gap-3">
                          <button
                            onClick={() => setOpenCategory(isOpen ? null : key)}
                            className="flex items-center gap-2 sm:gap-3 flex-1 text-left"
                          >
                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                              <Icon size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] sm:text-xs font-black uppercase italic tracking-wide text-zinc-800 dark:text-zinc-200">
                                  {catT.label}
                                </span>
                                {isNecessary && (
                                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    {t.alwaysOn}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isOpen ? (
                              <ChevronUp size={14} className="text-zinc-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown size={14} className="text-zinc-400 flex-shrink-0" />
                            )}
                          </button>

                          {/* Toggle */}
                          <button
                            onClick={() => toggleCategory(key)}
                            disabled={isNecessary}
                            className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${
                              consent[key]
                                ? "bg-[#3b60ff]"
                                : "bg-zinc-300 dark:bg-zinc-700"
                            } ${isNecessary ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
                            aria-label={catT.label}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                consent[key] ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Expanded detail */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/30"
                            >
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                                {catT.description}
                              </p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                {lang === "de" ? "Beispiele:" : "Examples:"}{" "}
                                <span className="font-normal normal-case tracking-normal text-zinc-500">{catT.examples}</span>
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legal note */}
            <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
              {t.legalNote}
            </p>
          </div>

          {/* Sticky Footer */}
          <div className="p-4 sm:p-6 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/80 flex-shrink-0 flex flex-col gap-3">
            {/* Action buttons */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <button
                onClick={handleRejectAll}
                className="flex-1 order-3 md:order-1 py-2.5 sm:py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] sm:text-xs font-black uppercase italic tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                {t.rejectAll}
              </button>

              {expanded && (
                <button
                  onClick={handleSaveSelection}
                  className="flex-1 order-2 md:order-2 py-2.5 sm:py-3 px-4 rounded-xl border border-[#3b60ff] text-[#3b60ff] text-[11px] sm:text-xs font-black uppercase italic tracking-wider hover:bg-[#3b60ff]/5 transition-all"
                >
                  {t.saveSelection}
                </button>
              )}

              <button
                onClick={handleAcceptAll}
                className="flex-1 order-1 md:order-3 py-2.5 sm:py-3 px-4 text-white text-[11px] sm:text-xs font-black uppercase italic tracking-wider shadow-lg shadow-[#3b60ff]/25 hover:opacity-90 transition-all"
                style={{ backgroundColor: "#3b60ff" }}
              >
                {t.acceptAll}
              </button>
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 justify-center">
              <a href="/datenschutz" className="text-[9px] sm:text-[10px] text-zinc-400 hover:text-[#3b60ff] transition-colors underline underline-offset-2">
                {t.privacyLink}
              </a>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <a href="/impressum" className="text-[9px] sm:text-[10px] text-zinc-400 hover:text-[#3b60ff] transition-colors underline underline-offset-2">
                {t.imprintLink}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Hook to read current consent anywhere in the app
export function useCookieConsent() {
  const [consent, setConsent] = useState(defaultConsent);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setConsent(JSON.parse(saved));
    } catch (e) {}
  }, []);

  return consent;
}

// Button to re-open cookie settings (for footer/privacy page)
export function CookieSettingsButton({ label }) {
  return (
    <button
      onClick={() => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }}
      className="text-xs text-zinc-400 hover:text-[#3b60ff] transition-colors flex items-center gap-1.5"
    >
      <Cookie size={12} />
      {label || "Cookie-Einstellungen"}
    </button>
  );
}
