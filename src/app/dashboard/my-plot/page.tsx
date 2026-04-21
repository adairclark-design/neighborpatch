"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function MyPlotPage() {
  const router = useRouter();

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">

        <div className="page-header fade-up">
          <div className="page-header-text">
            <h2>Sunny Backyard — East Austin</h2>
            <p>Your active plot managed by Sarah & Tom Miller.</p>
          </div>
          <span className="badge badge-green" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            ✓ Active Season (Spring 2026)
          </span>
        </div>

        <div className="grid-2 fade-up fade-up-1" style={{ alignItems: "start" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Plot quick actions */}
            <div className="card">
              <h3 className="mb-16">Quick Actions</h3>
              <div className="grid-2">
                <button 
                  className="btn btn-primary btn-full"
                  onClick={() => router.push("/dashboard/plot/123/log")}
                >
                  📝 Log Harvest
                </button>
                <button 
                  className="btn btn-secondary btn-full"
                  onClick={() => router.push("/dashboard/inbox")}
                >
                  💬 Message Owner
                </button>
              </div>
            </div>

            {/* Plot Details */}
            <div className="card">
              <h3 className="mb-16">Plot Details</h3>
              
              <div className="flex justify-between items-center mb-16" style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <span className="color-muted text-sm">Location</span>
                <span className="font-semibold text-sm">123 Live Oak Lane, Austin TX</span>
              </div>
              <div className="flex justify-between items-center mb-16" style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <span className="color-muted text-sm">Size</span>
                <span className="font-semibold text-sm">320 sq ft</span>
              </div>
              <div className="flex justify-between items-center mb-16" style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <span className="color-muted text-sm">Sun Exposure</span>
                <span className="font-semibold text-sm">Full Sun</span>
              </div>
              <div className="flex justify-between items-center mb-16" style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <span className="color-muted text-sm">Water Access</span>
                <span className="font-semibold text-sm">Drip Irrigation Provided</span>
              </div>

              <div className="mt-24">
                <h4 className="mb-8 text-sm">Ground Rules:</h4>
                <ul style={{ paddingLeft: 20, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <li className="mb-4">No synthetic pesticides or herbicides.</li>
                  <li className="mb-4">Please ensure the side gate is locked when leaving.</li>
                  <li className="mb-4">Compost bin is available by the back shed.</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Agreement Summary */}
            <div className="card">
              <div className="flex justify-between items-center mb-16">
                <h3>Agreement</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => router.push("/dashboard/contracts/sign")}>View Full</button>
              </div>
              <div style={{ background: "var(--bg-muted)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
                <div className="font-semibold text-sm mb-4">Crop Share Model 🧺</div>
                <p className="text-xs color-secondary">You agreed to share a weekly basket of fresh produce with the homeowners.</p>
              </div>
              <div className="text-sm color-secondary">Signed digitally on Apr 1, 2026. This revocable license remains active until Sep 30, 2026.</div>
            </div>
            
            {/* Season Progress */}
            <div className="card">
              <h3 className="mb-16">Season Progress</h3>
              <div className="flex justify-between text-sm mb-8">
                <span className="color-secondary">Spring 2026</span>
                <span className="font-semibold">Week 3 of 24</span>
              </div>
              <div className="progress-bar mb-16"><div className="progress-fill" style={{ width: "12%" }} /></div>
              <p className="text-xs color-muted">This season ends on September 30, 2026. You will have 30 days to clear the plot if not renewing.</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
