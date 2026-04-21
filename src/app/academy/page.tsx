"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AcademyPage() {
  const router = useRouter();

  const modules = [
    { icon: "🌱", title: "Module 1: What Plants Actually Need", desc: "Sun, water, soil — the honest basics most beginners skip.", duration: "25 min", free: true },
    { icon: "🪱", title: "Module 2: Soil Is Alive", desc: "Understanding the biology under your feet. Compost, amendments, and why it matters.", duration: "30 min", free: true },
    { icon: "📅", title: "Module 3: Planning a Growing Season", desc: "Succession planting, hardiness zones, and realistic harvest timelines.", duration: "40 min", free: false },
    { icon: "🐛", title: "Module 4: Pest & Disease Management", desc: "Identifying common problems and treating them without nuking beneficial insects.", duration: "35 min", free: false },
    { icon: "🤝", title: "Module 5: Being a Great Neighbor-Gardener", desc: "Communication, harvest logging, and how to honor the spirit of a shared space.", duration: "20 min", free: false },
  ];

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">

        {/* Hero */}
        <div className="hero-gradient fade-up mb-24">
          <h1>NeighborPatch Academy</h1>
          <p style={{ marginTop: 8, maxWidth: 500 }}>
            Not quite ready for a plot yet? That's the right call. Start here, build confidence, and come back when you're ready to garden well.
          </p>
          <button className="btn mt-16" style={{ background: "hsla(0,0%,100%,0.2)", color: "white" }}>
            🎓 Enroll — $39 One Time
          </button>
        </div>

        <div className="grid-2 fade-up fade-up-1" style={{ alignItems: "start" }}>

          {/* Module list */}
          <div>
            <h3 className="mb-16">Course Curriculum</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {modules.map((m, i) => (
                <div key={i} className="card card-sm" style={{ opacity: m.free ? 1 : 0.85 }}>
                  <div className="flex items-center gap-12">
                    <div style={{ fontSize: "1.8rem" }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold" style={{ fontSize: "0.92rem" }}>{m.title}</span>
                        {m.free ? <span className="badge badge-green">Free Preview</span> : <span className="badge badge-neutral">🔒 Enrolled</span>}
                      </div>
                      <p className="text-sm mt-4">{m.desc}</p>
                      <div className="text-xs color-muted mt-4">⏱ {m.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enroll CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="card">
              <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🌿</div>
                <h3 className="mb-8">Full Academy Access</h3>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brand-green)", marginBottom: "4px" }}>$39</div>
                <p className="text-sm color-muted mb-16">One-time payment. Lifetime access. No subscriptions.</p>
              </div>
              {[
                "5 practical modules (2.5 hrs total)",
                "Printable planting season calendar",
                "\"Am I Ready?\" assessment retakes",
                "Access to the NeighborPatch Discord",
                "Certificate of completion for your profile",
              ].map((f) => (
                <div key={f} className="flex items-center gap-8 mb-8" style={{ fontSize: "0.87rem" }}>
                  <span className="color-green font-bold">✓</span>
                  <span>{f}</span>
                </div>
              ))}
              <button className="btn btn-primary btn-full mt-16">Enroll Now — $39</button>
              <p className="text-xs color-muted mt-8" style={{ textAlign: "center" }}>
                Completing the Academy automatically re-qualifies you for the NeighborPatch assessment.
              </p>
            </div>

            <div className="card card-sm" style={{ background: "var(--brand-green-pale)", border: "1px solid hsla(148,54%,32%,0.15)" }}>
              <p className="text-sm" style={{ lineHeight: 1.8 }}>
                <strong>"You don't become a marathon athlete in one day. You become one by showing up every day for a long time."</strong>
                <span className="color-muted"> — NeighborPatch Philosophy</span>
              </p>
            </div>

            <button className="btn btn-ghost" onClick={() => router.push("/onboarding/gardener")}>
              ← Retake the Assessment
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
