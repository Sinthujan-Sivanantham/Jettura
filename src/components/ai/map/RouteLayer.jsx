import React from "react";
import { Source, Layer } from "react-map-gl/mapbox";

export default function RouteLayer({ routeData }) {
    const layerStyle = {
        id: "route",
        type: "line",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
            "line-color": "#3b60ff",
            "line-width": 6,
            "line-opacity": 0.75
        }
    };

    if (!routeData) return null;

    return (
        <Source id="my-data" type="geojson" data={routeData}>
            <Layer {...layerStyle} />
        </Source>
    );
}
