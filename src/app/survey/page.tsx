"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

const TOTAL_PAGES = 4;

const CROP_OPTIONS = ["Storage Crops", "Salad Mixes / Greens", "Flowers", "Vegetables for Breeding", "Cannabis / Hemp", "Fruit Trees", "Berries", "Cane Fruit", "Herbs & Medicinals", "Microgreens", "A Little of Everything"];
const MOTIVATION_OPTIONS = ["Fun", "Feed myself", "Feed my family", "Side hustle", "Want to turn urban farming into a full-time career", "Nervous about food insecurity — growing just in case", "Want to learn a new skill", "Want to learn and teach my kid(s)", "Want to help my community", "Want to grow food to donate to a food shelter", "Want to create something beautiful", "Want to breed a unique vegetable variety", "Grief / healing — gardening as therapy"];
const TECHNIQUE_OPTIONS = ["KNF / JADAM", "Regenerative No-Till", "Market Farming", "Animal Husbandry (mainly chickens)", "Bokashi", "Permaculture", "Hugelkultur", "Keyline Design", "Biodynamic", "Organic Certification Awareness", "Basic Gardening"];
const COMPOST_OPTIONS = ["Hot Composting", "Cold Composting", "Compost Teas", "Vermicompost", "Compost Extracts", "Ferments", "Biodynamic Preparations", "Wood Chip / Biochar Applications", "Cover Cropping"];
const TOOL_OPTIONS = ["Hoe", "Shovels", "Spading Fork", "Broadfork", "Landscape Rake", "Trowel", "Wheelbarrow", "Stirrup Hoe", "Watering Hoses", "Watering Cans", "Remay / Row Cover", "Greenhouse Plastic", "T-Posts for Trellising", "Tomato Cages", "Irrigation Timer / Drip Emitters", "pH / EC Meter"];
const DECK_OPTIONS = ["Never", "1 season", "2–3 seasons", "4+ seasons"];
const YEARS_OPTIONS = ["< 1 year", "1–2 years", "3–5 years", "5–10 years", "10+ years"];

function MultiSelect({ options, selected, onChange }: { options: string[], selected: string[], onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          style={{
            padding: "6px 14px",
            borderRadius: "100px",
            border: selected.includes(opt) ? "2px solid var(--brand-green)" : "2px solid var(--border)",
            background: selected.includes(opt) ? "var(--brand-green-pale)" : "white",
            color: selected.includes(opt) ? "var(--brand-green)" : "var(--text-secondary)",
            fontWeight: selected.includes(opt) ? 600 : 400,
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.15s"
          }}
        >
          {selected.includes(opt) ? "✓ " : ""}{opt}
        </button>
      ))}
    </div>
  );
}

function SingleSelect({ options, selected, onChange }: { options: string[], selected: string, onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            padding: "6px 14px",
            borderRadius: "100px",
            border: selected === opt ? "2px solid var(--brand-green)" : "2px solid var(--border)",
            background: selected === opt ? "var(--brand-green-pale)" : "white",
            color: selected === opt ? "var(--brand-green)" : "var(--text-secondary)",
            fontWeight: selected === opt ? 600 : 400,
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.15s"
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function SurveyPage() {
  const router = useRouter();
  const [page, setPage] = useState(0); // 0 = pledge gate
  const [submitting, setSubmitting] = useState(false);

  // Page 0: Pledge
  const [hotokuPledge, setHotokuPledge] = useState(false);

  // Page 1: Philosophy & Motivation
  const [motivations, setMotivations] = useState<string[]>([]);
  const [personalStatement, setPersonalStatement] = useState("");

  // Page 2: Grow Intent & Experience
  const [cropsToGrow, setCropsToGrow] = useState<string[]>([]);
  const [deckExperience, setDeckExperience] = useState("");
  const [gardeningYears, setGardeningYears] = useState("");
  const [seriousYears, setSeriousYears] = useState("");

  // Page 3: Techniques & Soil Knowledge
  const [techniques, setTechniques] = useState<string[]>([]);
  const [compostingPractices, setCompostingPractices] = useState<string[]>([]);

  // Page 4: Tools & Community
  const [toolsOwned, setToolsOwned] = useState<string[]>([]);
  const [willingChickenCare, setWillingChickenCare] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('gardener_surveys').insert({
      gardener_id: user.id,
      hotoku_pledge: hotokuPledge,
      motivations,
      personal_statement: personalStatement,
      crops_to_grow: cropsToGrow,
      deck_experience: deckExperience,
      gardening_years: gardeningYears,
      serious_gardening_years: seriousYears,
      techniques,
      composting_practices: compostingPractices,
      tools_owned: toolsOwned,
      willing_chicken_care: willingChickenCare,
    });

    if (!error) {
      await supabase.from('profiles').update({ survey_complete: true }).eq('id', user.id);
      router.push("/?survey=complete");
    } else {
      alert("Failed to save survey: " + error.message);
      setSubmitting(false);
    }
  };

  const progress = ((page) / (TOTAL_PAGES)) * 100;

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: 680, margin: "32px auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ marginBottom: "4px" }}>Gardener Profile Survey</h2>
            <p className="color-muted text-sm">This helps homeowners understand who they are opening their land to. Be honest — the right match is everything.</p>
          </div>

          {/* Progress Bar */}
          {page > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--color-muted)", marginBottom: "6px" }}>
                <span>Page {page} of {TOTAL_PAGES}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div style={{ height: 6, background: "var(--bg-muted)", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "var(--brand-green)", borderRadius: "100px", transition: "width 0.4s ease" }} />
              </div>
            </div>
          )}

          {/* PAGE 0: Hotoku Pledge */}
          {page === 0 && (
            <div className="card" style={{ borderLeft: "4px solid var(--brand-green)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "12px" }}>🌿</div>
              <h3 style={{ marginBottom: "12px" }}>Hotoku — Repaying Virtue</h3>
              <p style={{ lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "20px" }}>
                Ninomiya Kinjiro believed that individuals should work hard not only to improve their own circumstances but also to contribute to the well-being of their communities. NeighborPatch is built on this philosophy.
              </p>
              <p style={{ lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "24px" }}>
                When you farm someone's land, you are not just growing food — you are tending a community resource, a family's home, and a piece of the neighborhood ecosystem. This is a sacred responsibility.
              </p>
              <label style={{ display: "flex", gap: "12px", alignItems: "flex-start", cursor: "pointer", background: "var(--brand-green-pale)", padding: "16px", borderRadius: "8px", border: "1px solid var(--brand-green)" }}>
                <input
                  type="checkbox"
                  checked={hotokuPledge}
                  onChange={e => setHotokuPledge(e.target.checked)}
                  style={{ width: 18, height: 18, marginTop: 2, accentColor: "var(--brand-green)", flexShrink: 0 }}
                />
                <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                  I understand that I am a steward of someone else's land. I commit to treating it with care, honesty, and respect for the community around me.
                </span>
              </label>
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "24px" }}
                disabled={!hotokuPledge}
                onClick={() => setPage(1)}
              >
                I Understand — Begin Profile →
              </button>
            </div>
          )}

          {/* PAGE 1: Motivation & Statement */}
          {page === 1 && (
            <div className="form-group">
              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">Why do you want to do this?</h3>
                <p className="text-sm color-muted mb-16">Select all that apply.</p>
                <MultiSelect options={MOTIVATION_OPTIONS} selected={motivations} onChange={setMotivations} />
              </div>

              <div className="card">
                <h3 className="mb-8">Tell us about yourself</h3>
                <p className="text-sm color-muted" style={{ marginBottom: "12px" }}>
                  Tell us who you are, why you're drawn to this, and what you hope to build. Be as real as you can — this is how trust begins.
                </p>
                <textarea
                  className="input"
                  rows={6}
                  minLength={200}
                  placeholder="I've always wanted to grow my own food, but living in an apartment for the past few years has made that impossible. I care deeply about where my food comes from..."
                  value={personalStatement}
                  onChange={e => setPersonalStatement(e.target.value)}
                />
                <div style={{ fontSize: "0.75rem", color: personalStatement.length < 200 ? "#ef4444" : "var(--brand-green)", marginTop: "6px", textAlign: "right" }}>
                  {personalStatement.length} / 200 min characters
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPage(0)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2 }} disabled={motivations.length === 0 || personalStatement.length < 200} onClick={() => setPage(2)}>
                  Next: Your Growing Intent →
                </button>
              </div>
            </div>
          )}

          {/* PAGE 2: Crops & Experience */}
          {page === 2 && (
            <div className="form-group">
              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">What do you want to grow the most?</h3>
                <p className="text-sm color-muted mb-16">Select all that apply.</p>
                <MultiSelect options={CROP_OPTIONS} selected={cropsToGrow} onChange={setCropsToGrow} />
              </div>

              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">Have you grown plants on a balcony, deck, or patio before?</h3>
                <SingleSelect options={DECK_OPTIONS} selected={deckExperience} onChange={setDeckExperience} />
              </div>

              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">How long have you been gardening?</h3>
                <SingleSelect options={YEARS_OPTIONS} selected={gardeningYears} onChange={setGardeningYears} />
              </div>

              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">How long have you been <em>seriously</em> gardening?</h3>
                <p className="text-sm color-muted mb-16">Casually growing a tomato plant doesn't count. We mean consistent, intentional growing seasons.</p>
                <SingleSelect options={YEARS_OPTIONS} selected={seriousYears} onChange={setSeriousYears} />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPage(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2 }} disabled={cropsToGrow.length === 0 || !gardeningYears || !seriousYears} onClick={() => setPage(3)}>
                  Next: Techniques & Soil →
                </button>
              </div>
            </div>
          )}

          {/* PAGE 3: Techniques & Composting */}
          {page === 3 && (
            <div className="form-group">
              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">Forms and techniques you are comfortable with</h3>
                <p className="text-sm color-muted mb-16">Please be honest. Select all that apply.</p>
                <MultiSelect options={TECHNIQUE_OPTIONS} selected={techniques} onChange={setTechniques} />
              </div>

              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">Have you used or tried any of these soil practices?</h3>
                <MultiSelect options={COMPOST_OPTIONS} selected={compostingPractices} onChange={setCompostingPractices} />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPage(2)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2 }} disabled={techniques.length === 0} onClick={() => setPage(4)}>
                  Next: Tools & Community →
                </button>
              </div>
            </div>
          )}

          {/* PAGE 4: Tools & Community */}
          {page === 4 && (
            <div className="form-group">
              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">What tools or equipment do you already own?</h3>
                <p className="text-sm color-muted mb-16">Select what you are willing to supply yourself.</p>
                <MultiSelect options={TOOL_OPTIONS} selected={toolsOwned} onChange={setToolsOwned} />
              </div>

              <div className="card" style={{ marginBottom: "20px" }}>
                <h3 className="mb-16">If the land owner has chickens or quail, are you willing to help take care of them?</h3>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  {["Yes, I'd love to help!", "Yes, if needed", "Probably not", "No"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWillingChickenCare(opt.startsWith("Yes"))}
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: (willingChickenCare && opt.startsWith("Yes")) || (!willingChickenCare && !opt.startsWith("Yes") && opt === "No") ? "2px solid var(--brand-green)" : "2px solid var(--border)",
                        background: "white",
                        fontSize: "0.82rem",
                        cursor: "pointer"
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card" style={{ background: "var(--brand-green-pale)", border: "1px solid var(--brand-green)", marginBottom: "20px" }}>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                  🌱 <strong>Almost done.</strong> Your survey answers help homeowners choose someone they trust. Once submitted, your Gardener Profile will be visible when you apply to any listing.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPage(3)}>← Back</button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={submitting || toolsOwned.length === 0}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting Profile..." : "Submit My Gardener Profile →"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
