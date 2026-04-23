"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { supabase } from "@/lib/supabase";

// In a real app, this goes in .env.local
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN; 

interface Plot {
  id: string;
  title: string;
  fuzzed_lat: number;
  fuzzed_lng: number;
  monthly_fee: number;
  is_verified: boolean;
  water_provided: boolean;
  organic_strict: boolean;
  has_chickens: boolean;
}

interface FuzzedMapProps {
  height?: string;
  borderRadius?: string;
}

export default function FuzzedMap({ height = "400px", borderRadius = "var(--radius-md)" }: FuzzedMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  const [plots, setPlots] = useState<Plot[]>([]);

  useEffect(() => {
    // Fetch live fuzzed plots from DB
    const fetchPlots = async () => {
      // 1. Get user Pro status
      const { data: { user } } = await supabase.auth.getUser();
      let isPro = false;
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('is_pro').eq('id', user.id).single();
        isPro = profile?.is_pro || false;
      }

      // 2. Fetch plots
      const { data, error } = await supabase.from('plots').select('id, title, utility_fee_monthly, status, fuzzed_location, created_at, water_provided, organic_strict, has_chickens').in('status', ['available']);
      if (error || !data) return;

      const now = new Date().getTime();
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;

      const livePlots: Plot[] = data.map((plot) => {
        const coords = (plot.fuzzed_location as any)?.coordinates;
        return {
          id: plot.id,
          title: plot.title,
          fuzzed_lng: coords ? coords[0] : 0,
          fuzzed_lat: coords ? coords[1] : 0,
          monthly_fee: plot.utility_fee_monthly || 0,
          is_verified: true, 
          created_at: new Date(plot.created_at).getTime(),
          water_provided: plot.water_provided || false,
          organic_strict: plot.organic_strict || false,
          has_chickens: plot.has_chickens || false
        };
      }).filter(p => p.fuzzed_lng !== 0).filter(p => {
        // Scarcity Logic: If the plot is less than 24 hours old, only Pro users can see it
        const age = now - p.created_at;
        if (age < ONE_DAY_MS && !isPro) return false;
        return true;
      });
      
      setPlots(livePlots);
    };
    fetchPlots();
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    if (plots.length === 0) return; // Wait until we have plots to render them

    // Initialize to Austin, TX (or the first plot)
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [plots[0]?.fuzzed_lng || -97.7431, plots[0]?.fuzzed_lat || 30.2672],
      zoom: 11
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
          
          let badgesHTML = "";
          if (plot.organic_strict) badgesHTML += `<span style="display:inline-block;padding:2px 6px;background:#dcfce7;color:#166534;border-radius:4px;font-size:0.7rem;margin-right:4px;font-weight:600;">🌿 100% Organic</span>`;
          if (plot.water_provided) badgesHTML += `<span style="display:inline-block;padding:2px 6px;background:#dbeafe;color:#1e40af;border-radius:4px;font-size:0.7rem;margin-right:4px;font-weight:600;">💧 Water Provided</span>`;
          if (plot.has_chickens) badgesHTML += `<span style="display:inline-block;padding:2px 6px;background:#fef3c7;color:#92400e;border-radius:4px;font-size:0.7rem;margin-right:4px;font-weight:600;">🐔 Poultry On-Site</span>`;

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family: inherit;">
                <strong style="display:block;margin-bottom:4px;font-size:1rem;">${plot.title}</strong>
                <span style="color:#64748b;font-size:0.9rem;">${plot.monthly_fee === 0 ? "Crop Share" : "$" + plot.monthly_fee + "/mo"}</span>
                <div style="margin-top:8px;margin-bottom:4px;">${badgesHTML}</div>
                <a href="/dashboard/plot/${plot.id}/apply" style="display:block;margin-top:12px;padding:6px 12px;background:var(--brand-green);color:white;text-decoration:none;border-radius:6px;text-align:center;font-weight:600;font-size:0.9rem;">Apply to Farm</a>
              </div>
            `)
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
    <div style={{ position: "relative", width: "100%", height, borderRadius, overflow: "hidden" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: 10, left: 10, background: "white", padding: "8px 12px", borderRadius: "100px", fontSize: "0.8rem", boxShadow: "var(--shadow-md)" }}>
        📍 Showing {plots.length} available plot{plots.length === 1 ? "" : "s"} near {plots.length > 0 ? "your area" : "you"}
      </div>
    </div>
  );
}
