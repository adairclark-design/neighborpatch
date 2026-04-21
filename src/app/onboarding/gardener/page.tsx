"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const STEPS = [
  { q: "Have you ever maintained a garden before?", key: "experience",
    options: [
      { label: "No — this would be my first time growing anything.", value: 1 },
      { label: "Yes — I've grown things in pots or small raised beds.", value: 2 },
      { label: "Yes — I've run a full garden or market garden before.", value: 3 },
    ],
  },
  { q: "Honestly, how many hours a week can you consistently show up?",
    key: "time",
    options: [
      { label: "Maybe an hour or two on weekends if I'm free.", value: 1 },
      { label: "Around 5 hours per week. I'm serious about this.", value: 2 },
      { label: "10+ hours. Gardening is my primary hobby or work.", value: 3 },
    ],
  },
  { q: "What's your realistic monthly budget for soil, seeds, amendments?",
    key: "budget",
    options: [
      { label: "I really have very little to spare right now.", value: 1 },
      { label: "I can manage around $20–$50 per month.", value: 2 },
      { label: "I have a real budget for this — I'm committed.", value: 3 },
    ],
  },
];

export default function GardenerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [verdict, setVerdict] = useState<"ready" | "notReady" | null>(null);

  const current = STEPS[step];
  const selectedValue = answers[current?.key] ?? null;

  const handleSelect = (val: number) => {
    setAnswers({ ...answers, [current.key]: val });
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Evaluate
      const score = Object.values(answers).reduce((a, b) => a + b, 0);
      setVerdict(score >= 6 ? "ready" : "notReady");
      setDone(true);
    }
  };

  const progress = ((step) / STEPS.length) * 100;

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 580, width: "100%" }}>

          {!done ? (
            <div className="card fade-up">
              {/* Progress */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm color-muted font-semibold">Question {step + 1} of {STEPS.length}</span>
                <span className="text-sm color-green font-semibold">{Math.round(((step + 1) / STEPS.length) * 100)}% complete</span>
              </div>
              <div className="progress-bar mb-24"><div className="progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>

              <h2 className="mb-24" style={{ fontSize: "1.2rem" }}>{current.q}</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                {current.options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "var(--radius-md)",
                      border: `2px solid ${selectedValue === opt.value ? "var(--brand-green)" : "var(--border)"}`,
                      background: selectedValue === opt.value ? "var(--brand-green-pale)" : "var(--bg-surface)",
                      cursor: "pointer",
                      transition: "all var(--transition)",
                      fontWeight: selectedValue === opt.value ? 600 : 400,
                      color: selectedValue === opt.value ? "var(--brand-green)" : "var(--text-primary)",
                      fontSize: "0.93rem",
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                {step > 0
                  ? <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>← Back</button>
                  : <div />
                }
                <button
                  className="btn btn-primary"
                  disabled={selectedValue === null}
                  onClick={handleNext}
                  style={{ opacity: selectedValue === null ? 0.5 : 1 }}
                >
                  {step < STEPS.length - 1 ? "Next →" : "See My Result"}
                </button>
              </div>
            </div>

          ) : verdict === "ready" ? (
            <div className="card fade-up" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🌱</div>
              <h2 className="mb-8">You're Ready to Garden!</h2>
              <p className="mb-24" style={{ maxWidth: 420, margin: "0 auto 24px" }}>
                Based on your responses, you have the experience, time, and commitment to be a great NeighborPatch gardener. Let's find you the perfect local plot.
              </p>
              <div className="flex gap-12 justify-center" style={{ flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => router.push("/")}>Browse Plots Near Me →</button>
                <button className="btn btn-secondary" onClick={() => { setDone(false); setStep(0); setAnswers({}); }}>Retake</button>
              </div>
            </div>

          ) : (
            <div className="card fade-up" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🌿</div>
              <h2 className="mb-8">Not Quite Yet — And That's Okay.</h2>
              <p style={{ maxWidth: 440, margin: "0 auto 16px", lineHeight: 1.8 }}>
                Based on what you've shared, jumping into a full yard plot right now might set you up for a hard experience. You don't become a welder in one day. And that's ok.
              </p>
              <p style={{ maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.8 }}>
                Grow a few radishes on your deck. Learn about plant families. Come back next season — we'll be here, and so will the plots.
              </p>
              <div style={{ background: "var(--bg-muted)", padding: "24px", borderRadius: "var(--radius-md)", marginBottom: "24px" }}>
                <h3 className="mb-8">Start in the Academy</h3>
                <p className="text-sm mb-16">A short, practical course on container gardening, soil basics, and how to be a great neighbor-gardener.</p>
                <button className="btn btn-primary" onClick={() => router.push("/academy")}>Enroll in Academy →</button>
              </div>
              <button className="btn btn-ghost" onClick={() => { setDone(false); setStep(0); setAnswers({}); }}>Retake Assessment</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
