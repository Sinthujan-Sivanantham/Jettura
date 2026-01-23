import { useEffect, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "@/context/ThemeContext";
import RouteLayer from "./map/RouteLayer";
import StepMarkers from "./map/StepMarkers";

export default function MapContainer({ route, selectedStep, originStep }) {
  const { theme } = useTheme();
  const [routeData, setRouteData] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 52.52, longitude: 13.40, zoom: 12
  });

  const mapToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // ROUTE BERECHNEN (Directions API)
  useEffect(() => {
    if (selectedStep && route) {

      // Nutze originStep als Startpunkt, oder fallback auf Destination Center (route.lat/lng)
      const startLat = originStep ? originStep.lat : route.lat;
      const startLng = originStep ? originStep.lng : route.lng;
      const endLat = selectedStep.lat;
      const endLng = selectedStep.lng;

      const getRoute = async () => {
        try {
          const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/walking/${startLng},${startLat};${endLng},${endLat}?steps=true&geometries=geojson&access_token=${mapToken}`
          );
          const json = await query.json();
          if (json.routes && json.routes.length > 0) {
            setRouteData({
              type: "Feature",
              properties: {},
              geometry: json.routes[0].geometry
            });
          }
        } catch (e) {
          console.error("Mapbox Route Error:", e);
        }
      };

      // Nur routen wenn Koordinaten unterschiedlich sind
      if (startLat !== endLat || startLng !== endLng) {
        getRoute();
      } else {
        setRouteData(null);
      }

      // Karte zum Ziel bewegen
      setViewState({
        latitude: selectedStep.lat,
        longitude: selectedStep.lng,
        zoom: 15,
        transitionDuration: 1500
      });
    }
  }, [selectedStep, route, originStep]);

  // Fallback wenn Mapbox Token fehlt oder ungültig ist
  const useMapboxFallback = !mapToken || mapToken.length < 20;

  return (
    <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 relative">
      {useMapboxFallback ? (
        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
          <div className="text-center p-8">
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-2">
              Mapbox Token fehlt oder ist ungültig
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Bitte füge einen gültigen Mapbox Token in der .env Datei hinzu
            </p>
          </div>
        </div>
      ) : (
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={theme === "dark" ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12"}
          mapboxAccessToken={mapToken}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" />

          <RouteLayer routeData={routeData} />
          <StepMarkers steps={route?.steps} selectedStep={selectedStep} startRoute={route} />

        </Map>
      )}
    </div>
  );
}