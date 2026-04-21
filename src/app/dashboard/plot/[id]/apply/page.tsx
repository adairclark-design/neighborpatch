"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const plotId = params.id as string;

  const [plot, setPlot] = useState<any>(null);
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(false);
  const [surveyBlocked, setSurveyBlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Gate: Check if gardener has completed their reliability survey
      const { data: profile } = await supabase.from('profiles').select('survey_complete').eq('id', user.id).single();
      if (!profile?.survey_complete) {
        setSurveyBlocked(true);
        setChecking(false);
        return;
      }

      // Load the plot data
      const { data } = await supabase.from('plots').select('*, profiles:owner_id (full_name)').eq('id', plotId).single();
      if (data) setPlot(data);
      setChecking(false);
    };
    check();
  }, [plotId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Create the application (handshake)
    const { data: appData, error: appError } = await supabase.from('applications').insert({
      plot_id: plotId,
      applicant_id: user.id,
      status: 'pending' // initial status
    }).select().single();

    if (appError) {
      alert("Application failed: " + appError.message);
      setLoading(false);
      return;
    }

    // 2. Create the first introductory message
    const { error: msgError } = await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: plot.owner_id,
      plot_id: plotId,
      body: pitch
    });

    if (msgError) {
      alert("Message failed: " + msgError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/inbox");
  };

  if (checking) {
    return (
      <div className="page-shell"><Sidebar />
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="color-muted">Checking your profile...</div>
        </main>
      </div>
    );
  }

  if (surveyBlocked) {
    return (
      <div className="page-shell"><Sidebar />
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ maxWidth: 480, textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: "3rem" }}>🌱</div>
            <h2>Complete Your Gardener Profile First</h2>
            <p className="color-muted text-sm">
              Before applying to farm any land, homeowners need to understand who you are and how you garden. Your profile takes about 5 minutes and is required once.
            </p>
            <button className="btn btn-primary" onClick={() => router.push("/survey")}>
              Begin My Gardener Profile →
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
          <h2>Apply to Farm</h2>
          {plot && (
            <p className="color-muted" style={{ marginBottom: "24px" }}>
              Sending pitch to <strong>{plot.profiles?.full_name || "the owner"}</strong> regarding <strong>{plot.title}</strong>
            </p>
          )}

          <form onSubmit={handleSubmit} className="form-group">
            <label>Introduce yourself & your plan</label>
            <textarea 
              className="input" 
              rows={6}
              required
              placeholder="Hi! I'm a local gardener with 3 years of experience. I plan to grow tomatoes and squash..."
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
            <p className="form-help">This will start a secure conversation in your Inbox. Your exact contact information is kept private.</p>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "16px" }}>
              {loading ? "Sending..." : "Submit Application"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

