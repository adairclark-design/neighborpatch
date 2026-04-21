"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const MOCK_PLOTS = [
  {
    id: 1, emoji: "🥕", title: "Sunny Backyard — East Austin",
    neighborhood: "East Austin", distance: "0.4 mi",
    model: "Crop Share", price: null,
    sqft: 320, verified: true, tags: ["Full Sun", "Raised Beds", "Water Included"],
  },
  {
    id: 2, emoji: "🍅", title: "Large Side Yard — Mueller",
    neighborhood: "Mueller", distance: "1.1 mi",
    model: "Flat Fee", price: 25,
    sqft: 480, verified: true, tags: ["Part Shade", "Drip Irrigation", "Tool Shed"],
  },
  {
    id: 3, emoji: "🌽", title: "Shaded Corner Lot — Hyde Park",
    neighborhood: "Hyde Park", distance: "2.3 mi",
    model: "Crop Share", price: null,
    sqft: 200, verified: false, tags: ["Partial Shade", "Composting Available"],
  },
  {
    id: 4, emoji: "🥬", title: "Front Yard Patch — Bouldin Creek",
    neighborhood: "Bouldin Creek", distance: "1.8 mi",
    model: "Flat Fee", price: 15,
    sqft: 140, verified: true, tags: ["Full Sun", "Beginner Friendly"],
  },
];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"browse" | "overview">("overview");

  return (
    <div className="page-shell">
      <Sidebar />

      <main className="main-content">

        {/* === OVERVIEW TAB === */}
        {activeTab === "overview" && (
          <>
            {/* Hero */}
            <div className="hero-gradient fade-up mb-24">
              <p className="text-sm font-semibold mb-8" style={{ opacity: 0.75, letterSpacing: "0.05em", textTransform: "uppercase" }}>Austin, TX · Spring 2026</p>
              <h1>Welcome back, John. 👋</h1>
              <p style={{ marginTop: 8, maxWidth: 480, fontSize: "1.05rem" }}>
                Your tomatoes are hitting week 3. The Millers left you a harvest log note — and 2 new plots opened up near you.
              </p>
              <div className="flex gap-12 mt-16" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => setActiveTab("browse")}>Browse New Plots</button>
                <button
                  className="btn"
                  style={{ background: "hsla(0,0%,100%,0.15)", color: "white", backdropFilter: "blur(4px)" }}
                  onClick={() => router.push("/dashboard/plot/123/log")}
                >
                  Open Harvest Log
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid-4 fade-up fade-up-1 mb-24">
              <div className="stat-card green">
                <div className="stat-icon">🌱</div>
                <div className="stat-value">1</div>
                <div className="stat-label">Active Plot</div>
                <div className="stat-delta">↑ Season 2</div>
              </div>
              <div className="stat-card earth">
                <div className="stat-icon">🧺</div>
                <div className="stat-value">47 lbs</div>
                <div className="stat-label">Harvested This Year</div>
                <div className="stat-delta">↑ 12 lbs this month</div>
              </div>
              <div className="stat-card sky">
                <div className="stat-icon">💬</div>
                <div className="stat-value">2</div>
                <div className="stat-label">New Messages</div>
                <div className="stat-delta">From: The Millers</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">4.9</div>
                <div className="stat-label">Trust Rating</div>
                <div className="stat-delta">Verified Gardener</div>
              </div>
            </div>

            {/* Two column: My Plot + Activity */}
            <div className="grid-2 fade-up fade-up-2">

              {/* My Plot Status */}
              <div className="card">
                <div className="flex items-center justify-between mb-16">
                  <h3>My Active Plot</h3>
                  <span className="badge badge-green">✓ Agreement Signed</span>
                </div>
                <div style={{ background: "var(--bg-muted)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "16px" }}>
                  <div className="flex items-center gap-12">
                    <div style={{ fontSize: "2rem" }}>🍅</div>
                    <div>
                      <div className="font-semibold" style={{ fontSize: "0.95rem" }}>Sunny Backyard — East Austin</div>
                      <div className="text-sm color-muted">0.4 mi · Crop Share Model · 320 sq ft</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <div className="flex justify-between text-sm mb-8">
                    <span className="color-secondary">Season Progress</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: "68%" }} /></div>
                </div>
                <div className="flex gap-8 mt-16">
                  <button className="btn btn-secondary btn-sm" onClick={() => router.push("/dashboard/plot/123/log")}>Harvest Log</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => router.push("/dashboard/inbox")}>Message Owner</button>
                </div>
              </div>

              {/* Harvest Activity */}
              <div className="card">
                <div className="flex items-center justify-between mb-16">
                  <h3>Recent Harvest Activity</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => router.push("/dashboard/plot/123/log")}>View All</button>
                </div>
                {[
                  { date: "Apr 18", desc: "Harvested 3.2 lbs Roma Tomatoes + 1.5 lbs zucchini", yield: "4.7 lbs" },
                  { date: "Apr 14", desc: "Weeded back bed, applied compost from ChipDrop delivery", yield: "0 lbs" },
                  { date: "Apr 10", desc: "First harvest of the season! 2 lbs of baby spinach", yield: "2 lbs" },
                ].map((entry, i) => (
                  <div key={i} className="log-entry">
                    <div className="log-dot" />
                    <div>
                      <div className="log-date">{entry.date}</div>
                      <div className="log-desc color-secondary">{entry.desc}</div>
                      {entry.yield !== "0 lbs" && <div className="log-yield">{entry.yield} harvested</div>}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* How it works — for new users */}
            <div className="card mt-24 fade-up fade-up-3">
              <h3 className="mb-16">How NeighborPatch Works</h3>
              <div className="step-row">
                <div className="step-num">1</div>
                <div className="step-content">
                  <h4>Take the Readiness Assessment</h4>
                  <p className="text-sm">We ask honest questions about your experience and time. No point matching you with a plot you're not ready for.</p>
                </div>
              </div>
              <div className="step-row">
                <div className="step-num">2</div>
                <div className="step-content">
                  <h4>Verify Your Identity</h4>
                  <p className="text-sm">A quick government ID check. Homeowners see your "Verified ✓" badge and feel safe opening their yard to you.</p>
                </div>
              </div>
              <div className="step-row">
                <div className="step-num">3</div>
                <div className="step-content">
                  <h4>Apply & Meet</h4>
                  <p className="text-sm">Chat with the homeowner. They choose to reveal their exact address. You meet. If it feels right — sign the agreement digitally.</p>
                </div>
              </div>
              <div className="step-row">
                <div className="step-num">4</div>
                <div className="step-content">
                  <h4>Grow & Share</h4>
                  <p className="text-sm">Log your harvests, keep the owner in the loop, and share a basket of what you grow. That's the whole deal.</p>
                </div>
              </div>
              <button className="btn btn-primary mt-16" onClick={() => router.push("/onboarding/gardener")}>
                Start Your Assessment →
              </button>
            </div>
          </>
        )}

        {/* === BROWSE TAB === */}
        {activeTab === "browse" && (
          <>
            <div className="page-header fade-up">
              <div className="page-header-text">
                <h2>Available Plots Near You</h2>
                <p>4 plots within 3 miles of Austin, TX. All owners are background-checked.</p>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveTab("overview")}>← Back to Overview</button>
            </div>

            <div className="grid-2 fade-up fade-up-1">
              {MOCK_PLOTS.map((plot) => (
                <div key={plot.id} className="plot-card" onClick={() => router.push("/onboarding/gardener")}>
                  <div className="plot-card-img">
                    <span>{plot.emoji}</span>
                    <span className="plot-distance">{plot.distance}</span>
                  </div>
                  <div className="plot-card-body">
                    <div className="plot-card-title">{plot.title}</div>
                    <div className="plot-card-meta">
                      {plot.verified && <span className="badge badge-green">✓ Verified Owner</span>}
                      <span className="badge badge-neutral">{plot.sqft} sq ft</span>
                      {plot.tags.slice(0,1).map(t => <span key={t} className="badge badge-earth">{t}</span>)}
                    </div>
                    <div className="text-sm color-secondary" style={{ marginBottom: 4 }}>
                      {plot.tags.slice(1).join(" · ")}
                    </div>
                    <div className="plot-card-footer">
                      <div className="plot-price">
                        {plot.price ? <>$<span style={{ fontSize: "1rem", fontWeight: 800 }}>{plot.price}</span><span>/mo</span></> : <span style={{ color: "var(--brand-earth)", fontWeight: 700 }}>🧺 Crop Share</span>}
                      </div>
                      <button className="btn btn-primary btn-sm">Apply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card mt-24 fade-up fade-up-2" style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🏡</div>
              <h3 className="mb-8">Have a yard you're not using?</h3>
              <p className="text-sm" style={{ maxWidth: 380, margin: "0 auto 20px" }}>Turn that unused patch of grass into a local food source — and get fresh produce on your doorstep every week.</p>
              <button className="btn btn-secondary" onClick={() => router.push("/list-yard")}>List My Yard for Free</button>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
