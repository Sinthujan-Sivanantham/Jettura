import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Mail, MessageCircle, Share2, Facebook, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FlightShareModal({ isOpen, onClose, flight, dictionaries }) {
    const { t, language } = useLanguage();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const firstLeg = flight.itineraries[0].segments[0];
    const lastLeg = flight.itineraries[0].segments.at(-1);
    const price = flight.price.total;
    const currency = flight.price.currency;

    const origin = firstLeg.departure.iataCode;
    const destination = lastLeg.arrival.iataCode;

    // Formatting date
    const date = new Date(firstLeg.departure.at).toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
        day: "numeric",
        month: "numeric"
    });

    const shareUrl = window.location.href;
    const shareTextTemplate = t("search.flight.share.flightOffer") || "Check out this flight from {origin} to {destination} for only {price} {currency}!";
    const shareText = shareTextTemplate
        .replace("{origin}", origin)
        .replace("{destination}", destination)
        .replace("{price}", price)
        .replace("{currency}", currency);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: t("search.flight.share.copyLink") || "Copy Link",
            icon: <Copy size={24} />,
            action: handleCopyLink,
            color: "bg-zinc-100 dark:bg-zinc-800"
        },
        {
            name: "E-Mail",
            icon: <Mail size={24} />,
            action: () => window.open(`mailto:?subject=Flight Deal&body=${shareText}%20${shareUrl}`),
            color: "bg-zinc-100 dark:bg-zinc-800"
        },
        {
            name: t("search.flight.share.messages") || "Messages",
            icon: <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg"><Send size={24} /></div>,
            action: () => window.open(`sms:?&body=${encodeURIComponent(shareText + " " + shareUrl)}`),
            color: "bg-transparent",
            isSpecial: true
        },
        {
            name: "WhatsApp",
            icon: <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg"><MessageCircle size={24} /></div>,
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`),
            color: "bg-transparent",
            isSpecial: true
        },
        {
            name: "Facebook",
            icon: <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-lg"><Facebook size={24} /></div>,
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`),
            color: "bg-transparent",
            isSpecial: true
        },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-[#0c0c0e] w-full max-w-2xl rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl relative overflow-hidden p-6 sm:p-14 border border-white/20 dark:border-white/5"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 sm:top-10 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm z-10"
                    >
                        <X size={18} className="text-zinc-500" />
                    </button>

                    <h2 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl md:text-3xl sm:text-5xl font-[1000] italic uppercase tracking-tight mb-6 sm:mb-8 leading-[0.9] pr-12 sm:pr-0">
                        {t("search.flight.share.title") || "Share this flight"}
                    </h2>

                    {/* Flight Summary Box */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 mb-6 sm:mb-10 flex items-center gap-4 sm:gap-6 border border-zinc-100 dark:border-zinc-800 shadow-sm group/card">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-zinc-800 rounded-xl sm:rounded-2xl flex items-center justify-center p-2 sm:p-3 shadow-md border border-zinc-100 dark:border-zinc-700 transition-transform group-hover/card:scale-105">
                            <img
                                src={`https://images.kiwi.com/airlines/64/${firstLeg.carrierCode}.png`}
                                alt="Airline"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-lg font-black italic uppercase tracking-normal">
                                    {origin} - {destination}
                                </h3>
                                <div className="text-right">
                                    <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-lg font-black italic tracking-normal leading-none">
                                        {price} <span className="text-[7px] sm:text-[8px] sm:text-[10px] not-italic font-bold opacity-60 uppercase">{currency}</span>
                                    </p>
                                    <p className="text-[7px] sm:text-[9px] font-bold text-zinc-500 uppercase mt-1 tracking-widest leading-none">{t("search.flight.share.perPerson") || "per person"}</p>
                                </div>
                            </div>
                            <p className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 italic">
                                {t("search.flight.share.multipleAirlines") || "Multiple Airlines"} • Di {date}
                            </p>
                        </div>
                    </div>

                    {/* Share Options Grid */}
                    <div className="grid grid-cols-5 gap-2 sm:gap-4">
                        {shareOptions.map((option, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 sm:gap-3">
                                <button
                                    onClick={option.action}
                                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl ${option.color} ${!option.isSpecial ? "text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800" : ""}`}
                                >
                                    {React.cloneElement(option.icon, { size: window.innerWidth < 640 ? 18 : 24 })}
                                </button>
                                <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-widest text-zinc-400 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                                    {option.name === (t("search.flight.share.copyLink")) && copied ? (t("search.flight.share.copied") || "Copied!") : option.name}
                                    {option.name === (t("search.flight.share.copyLink")) && copied && (
                                        <span className="text-green-500 ml-0.5 inline-block">✓</span>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
