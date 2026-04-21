"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function HarvestLog() {
  const [entries, setEntries] = useState([
    { date: "Apr 18, 2026", emoji: "🍅", desc: "Harvested 3.2 lbs Roma Tomatoes + 1.5 lbs zucchini. Left basket at back gate.", weight: "4.7 lbs", shared: true },
    { date: "Apr 14, 2026", emoji: "🌿", desc: "Weeded back bed, applied compost from ChipDrop delivery. No harvest today.", weight: "—", shared: false },
    { date: "Apr 10, 2026", emoji: "🥬", desc: "First harvest of the season — 2 lbs baby spinach. Shared half with the Millers.", weight: "2 lbs", shared: true },
    { date: "Apr 5, 2026",  emoji: "🌱", desc: "Transplanted tomato seedlings and sowed carrot seeds in row 3.", weight: "—", shared: false },
  ]);
  const [desc, setDesc] = useState("");
  const [weight, setWeight] = useState("");
  const [shared, setShared] = useState(false);
  const totalHarvested = 6.7;

  const handlePost = () => {
    if (!desc.trim()) return;
    setEntries([{ date: "Today", emoji: "🧺", desc, weight: weight || "—", shared }, ...entries]);
    setDesc(""); setWeight(""); setShared(false);
  };

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">

        <div className="page-header fade-up">
          <div className="page-header-text">
            <h2>Harvest Log</h2>
            <p>A shared journal between you and the Miller household.</p>
          </div>
          <span className="badge badge-green" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            🧺 {totalHarvested} lbs total this season
          </span>
        </div>

        <div className="grid-2 fade-up fade-up-1">

          {/* Log entry form */}
          <div className="card" style={{ alignSelf: "start" }}>
            <h3 className="mb-16">Log Today's Activity</h3>
            <div className="field mb-16">
              <label>What did you do today?</label>
              <textarea className="input" placeholder="Harvested 2 lbs cherry tomatoes, pruned the back row..." value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="field mb-16">
              <label>Yield (optional)</label>
              <input className="input" placeholder="e.g. 3.5 lbs" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "20px", fontSize: "0.9rem", fontWeight: 500 }}>
              <input type="checkbox" checked={shared} onChange={e => setShared(e.target.checked)} style={{ width: 18, height: 18 }}/>
              I left a harvest share for the owner today 🧺
            </label>
            <button className="btn btn-primary btn-full" onClick={handlePost}>Post to Log</button>
            <p className="text-xs color-muted mt-8" style={{ textAlign: "center" }}>The Millers will be notified when you post.</p>
          </div>

          {/* Log feed */}
          <div className="card" style={{ alignSelf: "start" }}>
            <h3 className="mb-16">Activity Feed</h3>
            {entries.map((e, i) => (
              <div key={i} className="log-entry">
                <div style={{ fontSize: "1.3rem", flexShrink: 0 }}>{e.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="flex justify-between items-center">
                    <span className="log-date">{e.date}</span>
                    {e.shared && <span className="badge badge-earth" style={{ fontSize: "0.68rem" }}>🤝 Shared</span>}
                  </div>
                  <div className="log-desc color-secondary mt-4">{e.desc}</div>
                  {e.weight !== "—" && <div className="log-yield mt-4">{e.weight} harvested</div>}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Resources */}
        <div className="card mt-24 fade-up fade-up-2">
          <h3 className="mb-16">Local Resources</h3>
          <div className="grid-3">
            {[
              { icon: "🪵", title: "ChipDrop", desc: "Free wood chip mulch delivered to your yard. Great for soil health.", href: "https://getchipdrop.com" },
              { icon: "🧪", title: "Soil Testing", desc: "Know your soil before you amend it. $30 mail-in kit, results in 5 days." , href: "#" },
              { icon: "🌻", title: "Local Seed Swap", desc: "Connect with neighboring gardeners to trade heirloom seeds locally.", href: "#" },
            ].map((r) => (
              <a key={r.title} href={r.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <div className="card card-sm" style={{ height: "100%", transition: "all var(--transition)", cursor: "pointer" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{r.icon}</div>
                  <div className="font-semibold mb-8">{r.title}</div>
                  <p className="text-sm">{r.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
