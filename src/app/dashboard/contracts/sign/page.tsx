"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function SignAgreement() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSign = () => { setSigned(true); };

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">

        <div className="page-header fade-up">
          <div className="page-header-text">
            <h2>Land Use Agreement</h2>
            <p>Between John Doe (Gardener) and Sarah & Tom Miller (Homeowners).</p>
          </div>
          {signed
            ? <span className="badge badge-green" style={{ padding: "10px 18px", fontSize: "0.88rem" }}>✓ Signed Apr 1, 2026</span>
            : <span className="badge badge-earth" style={{ padding: "10px 18px", fontSize: "0.88rem" }}>⏳ Awaiting Signature</span>
          }
        </div>

        {signed && (
          <div className="card mb-24 fade-up" style={{ background: "var(--brand-green-pale)", border: "1px solid hsla(148,54%,32%,0.2)" }}>
            <div className="flex items-center gap-12">
              <div style={{ fontSize: "2rem" }}>✅</div>
              <div>
                <div className="font-semibold color-green">Agreement Signed Successfully</div>
                <p className="text-sm">Both parties have signed. Your plot access is active. The $25/month utility fee will be charged automatically.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid-2 fade-up fade-up-1" style={{ alignItems: "start" }}>

          {/* The Agreement Document */}
          <div className="card" style={{ fontFamily: "inherit" }}>
            <h3 className="mb-16">📄 Revocable License to Use Land</h3>
            <div style={{ lineHeight: 1.8, color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              <section style={{ marginBottom: "18px" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: 4 }}>I. PARTIES</strong>
                This License to Use Land ("License") is entered into between <strong>Sarah & Tom Miller</strong> ("Homeowners/Licensors"), residing at [Address upon approval], and <strong>John Doe</strong> ("Gardener/Licensee").
              </section>
              <section style={{ marginBottom: "18px" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: 4 }}>II. GRANT OF LICENSE (NOT A LEASE)</strong>
                The Homeowners grant the Gardener a revocable, non-exclusive license to access and use the designated plot area (approx. 320 sq ft) for non-commercial growing only. <strong>This document does not establish tenancy, rental, or any residential rights whatsoever.</strong>
              </section>
              <section style={{ marginBottom: "18px" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: 4 }}>III. COMPENSATION MODEL</strong>
                The parties have selected: <span className="badge badge-earth" style={{ verticalAlign: "middle" }}>Flat Utility Fee — $25/month</span>. Charged on the 1st of each month via the platform.
              </section>
              <section style={{ marginBottom: "18px" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: 4 }}>IV. THE HARVEST SHARE COVENANT</strong>
                The Gardener agrees to leave a weekly basket of fresh produce for the Homeowners as a good-faith gesture of community and abundance. All harvest activity will be logged to the shared Harvest Log within 24 hours.
              </section>
              <section style={{ marginBottom: "18px" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: 4 }}>V. THE NEIGHBORPATCH GUARANTEE</strong>
                NeighborPatch sets aside 10% of all utility fees into a shared <strong>Property Damage Protection Pool</strong>. In the rare event of minor landscaping damage directly caused by the Gardener, the Homeowners may file a claim up to $500 for repair reimbursement. Note: This does not replace traditional home insurance.
              </section>
              <section style={{ marginBottom: "18px" }}>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: 4 }}>VI. HOMEOWNER OBLIGATIONS</strong>
                The Homeowners agree to honor this License for the duration of one full growing season. If the property is sold, the new owner is notified of this License at closing. The Homeowners must provide 30 days written notice via the platform before early termination.
              </section>
              <section>
                <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: 4 }}>VII. GARDENER OBLIGATIONS & EXIT</strong>
                The Gardener agrees to either (A) find a qualified replacement gardener before the end of the season, or (B) return the plot to a clear, grass-seeded state within 30 days. Soil amendments made cooperatively are not subject to reimbursement.
              </section>
            </div>
          </div>

          {/* Signing Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Details summary */}
            <div className="card card-sm">
              <h3 className="mb-16">Agreement Summary</h3>
              {[
                { label: "Plot Address", value: "123 Live Oak Lane, Austin TX (Revealed)" },
                { label: "Plot Size",    value: "320 sq ft" },
                { label: "Model",        value: "$25 / month Utility Fee" },
                { label: "Season",       value: "Spring 2026 (Mar → Sept)" },
                { label: "Owner",        value: "Sarah & Tom Miller ✓ Verified" },
                { label: "Gardener",     value: "John Doe ✓ ID Verified" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "0.87rem" }}>
                  <span className="color-muted">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>

            {!signed ? (
              <div className="card card-sm">
                <h3 className="mb-16">Sign Agreement</h3>
                <label className="flex items-center gap-12" style={{ cursor: "pointer", marginBottom: "20px", fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 20, height: 20 }}/>
                  <span>I have read and agree to all terms. I understand this is a <strong>Revocable License</strong>, not a lease, and no tenant rights are granted.</span>
                </label>
                <button
                  className="btn btn-primary btn-full"
                  disabled={!agreed}
                  onClick={handleSign}
                  style={{ background: agreed ? "var(--brand-green)" : "var(--border)", cursor: agreed ? "pointer" : "not-allowed" }}
                >
                  Sign Digitally & Authorize $25/mo
                </button>
                <p className="text-xs color-muted mt-8" style={{ textAlign: "center" }}>Secured by NeighborPatch. Both parties receive a signed copy via email.</p>
              </div>
            ) : (
              <div className="card card-sm" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🎉</div>
                <h3 className="mb-8">You're All Set!</h3>
                <p className="text-sm mb-16">Your first growing season has officially started. Open the Harvest Log to begin recording your journeys in the garden.</p>
                <button className="btn btn-primary btn-full" onClick={() => router.push("/dashboard/plot/123/log")}>Open Harvest Log →</button>
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}
