import React, { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, Snowflake } from "lucide-react";

const WeatherIcon = ({ main }) => {
  if (main === "Clear") return <Sun size={10} className="text-yellow-500" />;
  if (main === "Clouds") return <Cloud size={10} className="text-zinc-400" />;
  if (main === "Rain" || main === "Drizzle") return <CloudRain size={10} className="text-blue-400" />;
  if (main === "Snow") return <Snowflake size={10} className="text-blue-200" />;
  return <Sun size={10} className="text-yellow-500" />;
};

const weatherCache = {};

// ERWEITERTE MAP: IATA-Codes zu echten Stadtnamen
const IATA_MAP = {
  // Europa
  BER: "Berlin", FRA: "Frankfurt", MUC: "Munich", HAM: "Hamburg", DUS: "Dusseldorf",
  CPH: "Copenhagen", AMS: "Amsterdam", LHR: "London", LGW: "London", STN: "London",
  CDG: "Paris", ORY: "Paris", MAD: "Madrid", BCN: "Barcelona", IST: "Istanbul",
  VIE: "Vienna", ZRH: "Zurich", FCO: "Rome", OSL: "Oslo", ARN: "Stockholm",
  HEL: "Helsinki", BRU: "Brussels", DUB: "Dublin", LIS: "Lisbon",
  // USA / Amerika
  JFK: "New York", EWR: "New York", LGA: "New York", LAX: "Los Angeles",
  SFO: "San Francisco", MIA: "Miami", ORD: "Chicago", YYZ: "Toronto",
  // Asien / Middle East
  DXB: "Dubai", AUH: "Abu Dhabi", SIN: "Singapore", BKK: "Bangkok",
  HND: "Tokyo", NRT: "Tokyo", HKG: "Hong Kong", ICN: "Seoul",
  MAA: "Chennai", DEL: "Delhi", BOM: "Mumbai", PEK: "Beijing",
  // Australien
  SYD: "Sydney", MEL: "Melbourne"
};

export default function WeatherBadge({ cityCode }) {
  const [data, setData] = useState(weatherCache[cityCode] && weatherCache[cityCode] !== "NOT_FOUND" ? weatherCache[cityCode] : null);
  const [error, setError] = useState(weatherCache[cityCode] === "NOT_FOUND");
  const API_KEY = "dc01e4f17995b65c002dc31f17a5b2c6";

  useEffect(() => {
    if (!cityCode || weatherCache[cityCode]) return;

    const fetchWeather = async () => {
      try {
        // Übersetze Code in Namen (z.B. CPH -> Copenhagen)
        const cityName = IATA_MAP[cityCode] || cityCode;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`
        );

        if (!res.ok) {
          weatherCache[cityCode] = "NOT_FOUND";
          setError(true);
          return;
        }

        const result = await res.json();
        weatherCache[cityCode] = result;
        setData(result);
        setError(false);
      } catch {
        setError(true);
      }
    };

    const timer = setTimeout(fetchWeather, 300);
    return () => clearTimeout(timer);
  }, [cityCode]);

  // WICHTIG: Wenn die Stadt nicht gefunden wird, geben wir NULL zurück.
  // Das entfernt den schwarzen Balken aus deinem Modal!
  if (error) return null;

  // Ladezustand
  if (!data) return <div className="w-10 h-3 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-full" />;

  const main = data.weather[0].main;
  const temp = Math.round(data.main.temp);

  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shrink-0">
      <WeatherIcon main={main} />
      <span className="text-[7px] sm:text-[8px] sm:text-[9px] font-black italic text-zinc-800 dark:text-zinc-200">{temp}°C</span>
    </div>
  );
}