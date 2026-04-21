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

  useEffect(() => {
    // Load the plot data to confirm who we are messaging
    const fetchPlot = async () => {
      const { data } = await supabase.from('plots').select('*, profiles:owner_id (full_name)').eq('id', plotId).single();
      if (data) setPlot(data);
    };
    fetchPlot();
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
