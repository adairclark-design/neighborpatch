"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function ListYardPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [sqft, setSqft] = useState("");
  const [model, setModel] = useState<"crop_share" | "flat_fee">("crop_share");
  const [interaction, setInteraction] = useState<"collaborative" | "silent">("collaborative");
  const [rules, setRules] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!address || !title) return;
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to list a yard.");

      // 1. Geocode via Mapbox
      const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const geoUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
      
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      
      if (!geoData.features || geoData.features.length === 0) {
        throw new Error("Could not map this address. Please ensure it is valid.");
      }
      
      // Coordinates are [longitude, latitude]
      const [lng, lat] = geoData.features[0].center;

      // 2. Mathematically Fuzz the location by approx 0.5 miles (0.007 degrees)
      const offsetLng = (Math.random() - 0.5) * 0.014;
      const offsetLat = (Math.random() - 0.5) * 0.014;
      const fuzzed_lng = lng + offsetLng;
      const fuzzed_lat = lat + offsetLat;

      // Format as Well-Known Text (WKT) for PostGIS
      const exact_wkt = `POINT(${lng} ${lat})`;
      const fuzzed_wkt = `POINT(${fuzzed_lng} ${fuzzed_lat})`;

      const { error: insertError } = await supabase.from("plots").insert({
        owner_id: user.id,
        title,
        description: rules,
        compensation_model: model,
        interaction_preference: interaction,
        status: "available",
        exact_location: exact_wkt,
        fuzzed_location: fuzzed_wkt
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Sidebar role="owner" />
      <main className="main-content">

        {!submitted ? (
          <>
            <div className="page-header fade-up">
              <div className="page-header-text">
                <h2>List Your Yard</h2>
                <p>Your exact address stays private. Only verified, ID-checked gardeners who you personally approve will ever see it.</p>
              </div>
            </div>

            {error && (
              <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#ef4444", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="grid-2 fade-up fade-up-1" style={{ alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Privacy reassurance */}
                <div className="card card-sm" style={{ background: "var(--brand-green-pale)", border: "1px solid hsla(148,54%,32%,0.2)" }}>
                  <div className="flex gap-12">
                    <span style={{ fontSize: "1.4rem" }}>🔒</span>
                    <div>
                      <div className="font-semibold color-green mb-4">Your Address is Safe</div>
                      <p className="text-sm">We display only a 0.5-mile radius circle on the public map. Your street address is revealed only after you personally click "Approve" on a specific gardener's application.</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="card">
                  <h3 className="mb-20">Plot Details</h3>

                  <div className="field mb-16">
                    <label>Your Exact Address (Private)</label>
                    <input className="input" placeholder="123 Oak Lane, Austin TX 78701" value={address} onChange={e => setAddress(e.target.value)} />
                    <span className="text-xs color-green" style={{ marginTop: 4 }}>🔒 Only shared with approved gardeners.</span>
                  </div>

                  <div className="field mb-16">
                    <label>Listing Title</label>
                    <input className="input" placeholder="e.g. Sunny Backyard — East Austin" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>

                  <div className="field mb-20">
                    <label>Plot Size (approx. sq ft)</label>
                    <input className="input" placeholder="e.g. 200" value={sqft} onChange={e => setSqft(e.target.value)} />
                  </div>

                  <div className="field mb-20">
                    <label>Compensation Model</label>
                    <div className="grid-2" style={{ gap: "12px", marginTop: "6px" }}>
                      <div
                        onClick={() => setModel("crop_share")}
                        style={{ padding: "16px", borderRadius: "var(--radius-md)", border: `2px solid ${model === "crop_share" ? "var(--brand-green)" : "var(--border)"}`, background: model === "crop_share" ? "var(--brand-green-pale)" : "white", cursor: "pointer", transition: "all var(--transition)" }}
                      >
                        <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>🧺</div>
                        <div className="font-semibold" style={{ fontSize: "0.88rem", color: model === "crop_share" ? "var(--brand-green)" : "var(--text-primary)" }}>Crop Share</div>
                        <p className="text-xs mt-4">A weekly basket of fresh produce left at your door.</p>
                      </div>
                      <div
                        onClick={() => setModel("flat_fee")}
                        style={{ padding: "16px", borderRadius: "var(--radius-md)", border: `2px solid ${model === "flat_fee" ? "var(--brand-green)" : "var(--border)"}`, background: model === "flat_fee" ? "var(--brand-green-pale)" : "white", cursor: "pointer", transition: "all var(--transition)" }}
                      >
                        <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>💧</div>
                        <div className="font-semibold" style={{ fontSize: "0.88rem", color: model === "flat_fee" ? "var(--brand-green)" : "var(--text-primary)" }}>Flat Utility Fee</div>
                        <p className="text-xs mt-4">Gardener pays $25/month to cover your water bill.</p>
                      </div>
                    </div>
                  </div>

                  <div className="field mb-20">
                    <label>Social Preference</label>
                    <div className="grid-2" style={{ gap: "12px", marginTop: "6px" }}>
                      <div
                        onClick={() => setInteraction("collaborative")}
                        style={{ padding: "16px", borderRadius: "var(--radius-md)", border: `2px solid ${interaction === "collaborative" ? "var(--brand-green)" : "var(--border)"}`, background: interaction === "collaborative" ? "var(--brand-green-pale)" : "white", cursor: "pointer", transition: "all var(--transition)" }}
                      >
                        <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>🤝</div>
                        <div className="font-semibold" style={{ fontSize: "0.88rem", color: interaction === "collaborative" ? "var(--brand-green)" : "var(--text-primary)" }}>Collaborative</div>
                        <p className="text-xs mt-4">I'm happy to chat and meet the gardener.</p>
                      </div>
                      <div
                        onClick={() => setInteraction("silent")}
                        style={{ padding: "16px", borderRadius: "var(--radius-md)", border: `2px solid ${interaction === "silent" ? "var(--brand-green)" : "var(--border)"}`, background: interaction === "silent" ? "var(--brand-green-pale)" : "white", cursor: "pointer", transition: "all var(--transition)" }}
                      >
                        <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>🤫</div>
                        <div className="font-semibold" style={{ fontSize: "0.88rem", color: interaction === "silent" ? "var(--brand-green)" : "var(--text-primary)" }}>Silent Partner</div>
                        <p className="text-xs mt-4">Do not knock. Just farm the yard and leave.</p>
                      </div>
                    </div>
                  </div>

                  <div className="field mb-24">
                    <label>Ground Rules (Optional)</label>
                    <textarea className="input" placeholder="No synthetic pesticides, lock the side gate when leaving, organic fertilizers only..." value={rules} onChange={e => setRules(e.target.value)} />
                  </div>

                  <button className="btn btn-primary btn-full" disabled={!address || !title || loading} onClick={handleSubmit} style={{ opacity: !address || !title ? 0.5 : 1 }}>
                    {loading ? "Listing your yard..." : "List My Yard Securely 🌱"}
                  </button>
                </div>
              </div>

              {/* Right column - What happens next */}
              <div className="card" style={{ alignSelf: "start" }}>
                <h3 className="mb-16">What happens after you list?</h3>
                {[
                  { icon: "🗺️", title: "You appear on the map", desc: "Only as a blurred neighborhood circle — never your street." },
                  { icon: "✉️", title: "Verified gardeners apply", desc: "All applicants are ID-verified before they can even message you." },
                  { icon: "💬", title: "You chat & decide", desc: "Read their profile, see their trust score, and chat freely with no commitment." },
                  { icon: "🔓", title: "You choose to reveal", desc: "Tap one button when you feel ready. Only that specific gardener sees your address." },
                  { icon: "📄", title: "Sign digitally", desc: "A Revocable License (not a lease). No tenant rights. Both parties protected." },
                ].map((s, i) => (
                  <div key={i} className="step-row">
                    <div className="step-num" style={{ background: "var(--brand-green-pale)", color: "var(--brand-green)", fontSize: "1rem" }}>{s.icon}</div>
                    <div className="step-content">
                      <h4>{s.title}</h4>
                      <p className="text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <div className="card fade-up" style={{ maxWidth: 480, textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
              <h2 className="mb-8">Your Yard is Listed!</h2>
              <p className="mb-8">"{title}" is now visible on the NeighborPatch map as a blurred neighborhood circle.</p>
              <p className="text-sm color-muted mb-24">We'll notify you when verified gardeners apply. You'll always be in control of who sees your address.</p>
              <div className="flex gap-12 justify-center" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => router.push("/dashboard/inbox")}>Go to inbox</button>
                <button className="btn btn-secondary" onClick={() => router.push("/")}>Back to Dashboard</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
