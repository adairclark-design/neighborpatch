"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// In a real app, this goes in .env.local
// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
mapboxgl.accessToken = "pk.eyJ1IjoiYWRhaXciLCJhIjoiY2x0ZHpsZ29hMGswYTJpcGN2Zml2eWZ2ZiJ9.TEST_TOKEN"; 

interface Plot {
  id: string;
  title: string;
  fuzzed_lat: number;
  fuzzed_lng: number;
  monthly_fee: number;
  is_verified: boolean;
}

export default function FuzzedMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Dummy Seed Data localized to Austin, TX as per assumption
  const [plots] = useState<Plot[]>([
    { id: "1", title: "0.2 Acres - East Austin", fuzzed_lat: 30.2672, fuzzed_lng: -97.7431, monthly_fee: 25, is_verified: true },
    { id: "2", title: "Large Backyard Patch", fuzzed_lat: 30.2849, fuzzed_lng: -97.7341, monthly_fee: 0, is_verified: false },
    { id: "3", title: "Sunny Front Yard", fuzzed_lat: 30.2415, fuzzed_lng: -97.7687, monthly_fee: 15, is_verified: true }
  ]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize to Austin, TX
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-97.7431, 30.2672],
      zoom: 12
    });

    map.current.on("load", () => {
      // Add fuzzing radius circles instead of exact markers
      plots.forEach((plot) => {
        // Add a GeoJSON source consisting of the fuzzed point
        const sourceId = `plot-${plot.id}`;
        map.current?.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [plot.fuzzed_lng, plot.fuzzed_lat]
            },
            properties: { title: plot.title, fee: plot.monthly_fee }
          }
        });

        // Add the circle layer representing the 0.5 mile radius
        map.current?.addLayer({
          id: `circle-${plot.id}`,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 50, // pixel radius, ideally use meters in real impl
            "circle-color": "#2F855A", // var(--primary-color)
            "circle-opacity": 0.3,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#2F855A"
          }
        });

        // Add a click handler to the circle to act as a marker
        map.current?.on('click', `circle-${plot.id}`, (e) => {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${plot.title}</strong><br/>${plot.monthly_fee === 0 ? "Crop Share" : "$" + plot.monthly_fee + "/mo"}`)
            .addTo(map.current!);
        });
        
        map.current?.on('mouseenter', `circle-${plot.id}`, () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current?.on('mouseleave', `circle-${plot.id}`, () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      });
    });
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: 10, left: 10, background: "white", padding: "8px 12px", borderRadius: "100px", fontSize: "0.8rem", boxShadow: "var(--shadow-md)" }}>
        📍 Showing 3 available plots near Austin, TX
      </div>
    </div>
  );
}
