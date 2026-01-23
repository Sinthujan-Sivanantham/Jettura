export const getLocationName = (code, dictionaries, language = "en") => {
    const cityMap = {
        "BER": "Berlin", "TXL": "Berlin", "SXF": "Berlin",

        // Germany
        "MUC": { de: "München", en: "Munich" },
        "FRA": "Frankfurt",
        "HAM": "Hamburg",
        "DUS": "Düsseldorf",
        "STR": "Stuttgart",
        "CGN": { de: "Köln", en: "Cologne" },
        "HAJ": "Hannover",
        "BRE": "Bremen",
        "NUE": { de: "Nürnberg", en: "Nuremberg" },
        "LEJ": "Leipzig",
        "DRS": "Dresden",
        "DTM": "Dortmund",

        // US
        "JFK": "New York", "EWR": "New York", "LGA": "New York", "NYC": "New York",
        "LAX": "Los Angeles", "SFO": "San Francisco", "MIA": "Miami", "ORD": "Chicago", "LAS": "Las Vegas",

        // UK
        "LHR": "London", "LGW": "London", "STN": "London", "LCY": "London", "LTN": "London", "LON": "London",
        "MAN": "Manchester", "EDI": "Edinburgh",

        // Europe
        "CDG": "Paris", "ORY": "Paris", "BVA": "Paris", "PAR": "Paris",
        "AMS": "Amsterdam",
        "MAD": "Madrid",
        "BCN": "Barcelona", "PMI": "Palma de Mallorca",
        "FCO": { de: "Rom", en: "Rome" }, "CIA": { de: "Rom", en: "Rome" },
        "IST": "Istanbul", "SAW": "Istanbul",
        "CPH": { de: "Kopenhagen", en: "Copenhagen" },
        "VIE": { de: "Wien", en: "Vienna" },
        "ZRH": { de: "Zürich", en: "Zurich" },
        "LIS": { de: "Lissabon", en: "Lisbon" },
        "PRG": { de: "Prag", en: "Prague" },
        "WAW": { de: "Warschau", en: "Warsaw" },
        "ATH": { de: "Athen", en: "Athens" },
        "DUB": "Dublin",

        // Asia / Middle East
        "DXB": "Dubai",
        "BKK": "Bangkok",
        "HKG": "Hong Kong",
        "SIN": { de: "Singapur", en: "Singapore" },
        "TYO": { de: "Tokio", en: "Tokyo" }, "HND": { de: "Tokio", en: "Tokyo" }, "NRT": { de: "Tokio", en: "Tokyo" },
        "DPS": "Bali", "MLE": "Malé",
        "DOH": "Doha",

        // Australia / Oceania
        "SYD": "Sydney", "MEL": "Melbourne", "BNE": "Brisbane"
    };

    // Helper to get name based on language
    const getName = (entry) => {
        if (typeof entry === 'object') return entry[language] || entry['en'];
        return entry;
    };

    // 1. Try Dictionaries
    const loc = dictionaries?.locations?.[code];
    if (loc) {
        const cityName = loc.cityName || code;
        const countryCode = loc.countryCode || "";
        let countryName = "";

        try {
            if (countryCode) {
                const displayNames = new Intl.DisplayNames([language === 'de' ? 'de-DE' : 'en-US'], { type: 'region' });
                countryName = displayNames.of(countryCode);
            }
        } catch (e) {
            console.error("Country name resolution failed", e);
        }

        // Resolve city name from map if possible (e.g. if dictionary returns 'BER')
        const mappedCity = cityMap[cityName] ? getName(cityMap[cityName]) : cityName;

        if (mappedCity && countryName) {
            if (mappedCity === code) return `${mappedCity} (${countryName})`; // Fallback if city is same as code
            return `${mappedCity}, ${countryName}`;
        }
        return mappedCity || countryName || code;
    }

    // 2. Try Static Map
    if (cityMap[code]) {
        return getName(cityMap[code]);
    }

    return code;
};

/**
 * Get location name with country - ensures country is always displayed
 */
export const getLocationWithCountry = (code, dictionaries, language = "en") => {
    const countryMap = {
        // Germany
        "BER": "DE", "TXL": "DE", "SXF": "DE", "MUC": "DE", "FRA": "DE", "HAM": "DE",
        "DUS": "DE", "STR": "DE", "CGN": "DE", "HAJ": "DE", "BRE": "DE", "NUE": "DE",
        "LEJ": "DE", "DRS": "DE", "DTM": "DE",

        // US
        "JFK": "US", "EWR": "US", "LGA": "US", "NYC": "US", "LAX": "US", "SFO": "US",
        "MIA": "US", "ORD": "US", "LAS": "US",

        // UK
        "LHR": "GB", "LGW": "GB", "STN": "GB", "LCY": "GB", "LTN": "GB", "LON": "GB",
        "MAN": "GB", "EDI": "GB",

        // Europe
        "CDG": "FR", "ORY": "FR", "BVA": "FR", "PAR": "FR",
        "AMS": "NL",
        "MAD": "ES", "BCN": "ES", "PMI": "ES",
        "FCO": "IT", "CIA": "IT",
        "IST": "TR", "SAW": "TR",
        "CPH": "DK",
        "VIE": "AT",
        "ZRH": "CH",
        "LIS": "PT",
        "PRG": "CZ",
        "WAW": "PL",
        "ATH": "GR",
        "DUB": "IE",

        // Asia / Middle East
        "DXB": "AE",
        "BKK": "TH",
        "HKG": "HK",
        "SIN": "SG",
        "TYO": "JP", "HND": "JP", "NRT": "JP",
        "DPS": "ID", "MLE": "MV",
        "DOH": "QA",

        // Australia / Oceania
        "SYD": "AU", "MEL": "AU", "BNE": "AU"
    };

    // Get city name
    const cityName = getLocationName(code, dictionaries, language);

    // Try to get country from dictionaries first
    let countryCode = dictionaries?.locations?.[code]?.countryCode;

    // Fallback to static map
    if (!countryCode) {
        countryCode = countryMap[code];
    }

    // Get country name
    let countryName = "";
    if (countryCode) {
        try {
            const displayNames = new Intl.DisplayNames([language === 'de' ? 'de-DE' : 'en-US'], { type: 'region' });
            countryName = displayNames.of(countryCode);
        } catch (e) {
            countryName = countryCode;
        }
    }

    // Return formatted string
    if (countryName && !cityName.includes(countryName)) {
        return `${cityName}, ${countryName}`;
    }

    return cityName;
};

export const formatFlightTime = (at, language = "en") => {
    const localeStr = language === "de" ? "de-DE" : "en-GB";
    return new Date(at).toLocaleTimeString(localeStr, {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatFlightDate = (at, language = "en") => {
    const localeStr = language === "de" ? "de-DE" : "en-GB";
    return new Date(at).toLocaleDateString(localeStr, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric' // Added year as in modal
    }).toUpperCase();
};

export const formatFlightDateShort = (at, language = "en") => {
    const localeStr = language === "de" ? "de-DE" : "en-GB";
    return new Date(at).toLocaleDateString(localeStr, {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }).toUpperCase();
};

export const calculateWaitTime = (arrivalAt, departureAt) => {
    const diff = new Date(departureAt) - new Date(arrivalAt);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return { h, m, text: `${h}h ${m}m` };
};

export const formatISO8601Duration = (duration, language = "en") => {
    if (!duration) return "";
    const hMatch = duration.match(/(\d+)H/);
    const mMatch = duration.match(/(\d+)M/);
    const hours = hMatch ? hMatch[1] : 0;
    const minutes = mMatch ? mMatch[1] : 0;

    const unitH = language === "de" ? "h" : "h"; // In aviation 'h' is standard, but 'Std' could be used
    const unitM = "m";

    let result = "";
    if (hours > 0) result += `${hours}${unitH} `;
    if (minutes > 0) result += `${minutes}${unitM}`;
    return result.trim();
};
