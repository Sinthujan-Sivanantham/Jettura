import React, { createContext, useState, useContext } from "react";
import { translations } from "../lib/translations";

const LanguageContext = createContext({
    language: "de",
    switchLanguage: () => { },
    t: (path) => path
});

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem("jettura-lang");
        return (savedLang && (savedLang === "de" || savedLang === "en")) ? savedLang : "de";
    });

    const switchLanguage = (lang) => {
        if (lang === "de" || lang === "en") {
            setLanguage(lang);
            localStorage.setItem("jettura-lang", lang);
        }
    };

    const t = (path, defaultValue = "") => {
        if (!path) return defaultValue || "";
        const keys = path.split(".");
        let current = translations[language];

        if (!current) return defaultValue || path;

        for (let key of keys) {
            if (current === null || typeof current !== 'object' || current[key] === undefined) {
                return defaultValue || path;
            }
            current = current[key];
        }

        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
