import React, { useState, useEffect } from "react";
import { Map, Marker, NavigationControl } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ResultMapPreview({ route }) {
    const { theme } = useTheme();
    const [viewport, setViewport] = useState({
        latitude: route.lat || 0, longitude: route.lng || 0, zoom: 11
    });

    useEffect(() => {
        if (route.lat && route.lng) {
            setViewport(prev => ({ ...prev, latitude: route.lat, longitude: route.lng, transitionDuration: 2000 }));
        }
    }, [route.lat, route.lng]);

    return (
        <div className="h-[500px] lg:h-full min-h-[500px]">
            <Map
                {...viewport}
                onMove={evt => setViewport(evt.viewState)}
                mapStyle={theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12"}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
            >
                <NavigationControl position="top-right" />
                <Marker latitude={route.lat} longitude={route.lng} anchor="bottom">
                    <div className="bg-[#3b60ff] p-3 rounded-full shadow-2xl border-4 border-white">
                        <MapPin className="text-white" size={30} />
                    </div>
                </Marker>
            </Map>
        </div>
    );
}
