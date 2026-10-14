"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
/** Base map style is configurable. Check your tile provider's usage policy before production
 *  (openstreetmap.org's public tiles are not for heavy use). Attribution comes from the style. */
export default function ScenarioMap({ lat, lon }: { lat: number; lon: number }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!el.current) return;
    const map = new maplibregl.Map({
      container: el.current, center: [lon, lat], zoom: 13,
      style: process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "https://demotiles.maplibre.org/style.json",
    });
    map.addControl(new maplibregl.NavigationControl());
    new maplibregl.Marker().setLngLat([lon, lat]).addTo(map);
    return () => map.remove();
  }, [lat, lon]);
  return <div ref={el} className="h-80 w-full rounded-xl" role="region" aria-label="Study area map (base map only, no simulated overlay)" />;
}
