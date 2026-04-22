"use client";

import FuzzedMap from "@/components/Map/FuzzedMap";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const router = useRouter();

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "var(--bg-base)" }}>
      {/* Glassmorphism Header */}
      <header style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100, 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "16px 24px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 32, height: 32, background: "var(--brand-green)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem" }}>
            🌱
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>NeighborPatch</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            className="btn btn-secondary" 
            style={{ background: "rgba(255,255,255,0.9)", border: "none", color: "var(--text-primary)" }}
            onClick={() => router.push("/list-yard")}
          >
            List Your Yard
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => router.push("/login")}
          >
            Log In
          </button>
        </div>
      </header>

      {/* The Fuzzed Map */}
      <FuzzedMap height="100vh" borderRadius="0" />
      
      {/* FOMO Overlay / Floating CTA */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
        <div className="card fade-up" style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 20, boxShadow: "var(--shadow-lg)" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>Ready to start farming?</div>
            <div className="text-sm color-secondary">Create a free profile to contact homeowners.</div>
          </div>
          <button className="btn btn-primary" onClick={() => router.push("/onboarding/gardener")}>
            Join as Gardener
          </button>
        </div>
      </div>
    </div>
  );
}
