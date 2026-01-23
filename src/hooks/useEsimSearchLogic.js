import { useState, useEffect } from "react";

export function useEsimSearchLogic(onSearchSuccess) {
    const [destination, setDestination] = useState("");
    const [dataVolume, setDataVolume] = useState("5gb");
    const [duration, setDuration] = useState("30");
    const [searching, setSearching] = useState(false);

    const [errors, setErrors] = useState({ destination: false });
    const [shakeKey, setShakeKey] = useState(0);

    const [isLoaded, setIsLoaded] = useState(false);

    // PERSISTENCE
    useEffect(() => {
        const saved = localStorage.getItem("jettura_esim_prefs");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.destination) setDestination(data.destination);
                if (data.dataVolume) setDataVolume(data.dataVolume);
                if (data.duration) setDuration(data.duration);
            } catch (e) { console.error(e); }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("jettura_esim_prefs", JSON.stringify({ destination, dataVolume, duration }));
    }, [destination, dataVolume, duration, isLoaded]);

    const handleSearch = () => {
        const newErrors = { destination: !destination };
        setErrors(newErrors);

        if (newErrors.destination) {
            setShakeKey(prev => prev + 1);
            if (navigator.vibrate) navigator.vibrate(200);
            return;
        }
        setSearching(true);
        setTimeout(() => {
            setSearching(false);
            onSearchSuccess?.({
                type: 'esim',
                data: {
                    destination,
                    dataVolume,
                    duration
                }
            });
        }, 1200);
    };

    return {
        destination, setDestination,
        dataVolume, setDataVolume,
        duration, setDuration,
        searching,
        errors, setErrors,
        shakeKey,
        handleSearch
    };
}
