import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfDay } from "date-fns";
import { de } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

export default function CalendarView({
    date, handleDateSelect, brandColor, priceData, minDate
}) {
    const [numMonths, setNumMonths] = useState(typeof window !== 'undefined' && window.innerWidth < 1024 ? 1 : 2);

    useEffect(() => {
        const handleResize = () => {
            setNumMonths(window.innerWidth < 1024 ? 1 : 2);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const disabledDays = minDate ? { before: startOfDay(new Date(minDate)) } : { before: startOfDay(new Date()) };

    return (
        <motion.div key="cal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <style>{`
        .rdp { --rdp-accent-color: ${brandColor}; margin: 0; width: 100%; }
        .rdp-months { display: flex !important; flex-direction: row !important; gap: 20px !important; justify-content: center; }
        
        /* Desktop Default */
        .rdp-caption_label { font-size: 0.85rem !important; font-weight: 950 !important; font-style: italic !important; color: ${brandColor} !important; text-transform: uppercase; margin-bottom: 10px; display: block; text-align: center; }
        .rdp-head_cell { font-size: 8px; font-weight: 900; text-transform: uppercase; color: #94a3b8; padding-bottom: 5px; width: 30px; }
        .rdp-day { font-weight: 700; width: 30px; height: 30px; border-radius: 50% !important; transition: all 0.2s; position: relative; font-size: 0.75rem; }

        /* Mobile Adjustments (< 1024px) */
        @media (max-width: 1024px) {
            .rdp-caption_label { font-size: 0.7rem !important; margin-bottom: 2px; }
            .rdp-head_cell { width: 22px; font-size: 6px; padding-bottom: 2px; }
            .rdp-day { width: 22px; height: 22px; font-size: 0.6rem; }
            .rdp-months { gap: 0 !important; }
            .rdp { transform: scale(0.8); margin-left: -20px; } 
        }

        .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) { background-color: ${brandColor} !important; color: white !important; opacity: 0.3; }
        
        .rdp-day_selected, .rdp-day_selected:focus, .rdp-day_selected:active, .rdp-day_selected:hover { 
          background-color: ${brandColor} !important; color: white !important; opacity: 1 !important; border-radius: 50% !important; border: none !important;
        }

        .rdp-day_today { color: ${brandColor} !important; font-weight: 900 !important; border: 2px solid ${brandColor} !important; }
        
        /* NAVIGATION BUTTONS & CHEVRONS */
        .rdp-nav_button { color: ${brandColor} !important; background: transparent !important; width: 24px !important; height: 24px !important; display: flex !important; align-items: center !important; justify-content: center !important; border-radius: 50% !important; border: none !important; }
        .rdp-nav_button svg, .rdp-nav_button svg *, .rdp-nav_button svg path { stroke: ${brandColor} !important; color: ${brandColor} !important; fill: none !important; width: 14px !important; height: 14px !important; stroke-width: 4px !important; }
        .rdp-nav_button:hover { transform: scale(1.1); background-color: color-mix(in srgb, ${brandColor}, transparent 95%) !important; }
        .rdp-button:focus:not([disabled]), .rdp-button:active:not([disabled]) { border: none !important; outline: none !important; box-shadow: none !important; }
        
        .price-cheap:not(.rdp-day_selected) { color: #10b981 !important; font-weight: 900; } 
        .price-high:not(.rdp-day_selected) { color: #ef4444 !important; font-weight: 900; }
      `}</style>
            <DayPicker
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={de}
                numberOfMonths={numMonths}
                disabled={disabledDays}
                components={{
                    IconLeft: () => <ChevronLeft size={16} style={{ color: brandColor, stroke: brandColor }} />,
                    IconRight: () => <ChevronRight size={16} style={{ color: brandColor, stroke: brandColor }} />
                }}
                modifiers={{
                    cheap: (d) => priceData[format(d, "yyyy-MM-dd")] === "cheap",
                    high: (d) => priceData[format(d, "yyyy-MM-dd")] === "high"
                }}
                modifiersClassNames={{
                    cheap: "price-cheap",
                    high: "price-high"
                }}
            />
        </motion.div>
    );
}
