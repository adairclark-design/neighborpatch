"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function MyPlotPage() {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [isRevoked, setIsRevoked] = useState(false);
  const [activePlot, setActivePlot] = useState<any>(null);
  const [harvestLogs, setHarvestLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const roleIsOwner = profile?.role === 'owner';
        setIsOwner(roleIsOwner);

        let plotIdToFetch = null;

        if (roleIsOwner) {
          // Owner: Get an occupied plot they own
          const { data } = await supabase.from('plots').select('*').eq('owner_id', user.id).eq('status', 'occupied').limit(1).single();
          if (data) {
            plotIdToFetch = data.id;
            setActivePlot(data);
          }
        } else {
          // Gardener: Get the plot attached to their approved application
          const { data } = await supabase.from('applications').select('plot_id').eq('applicant_id', user.id).eq('status', 'approved').limit(1).single();
          if (data?.plot_id) {
            plotIdToFetch = data.plot_id;
            const { data: plotData } = await supabase.from('plots').select('*').eq('id', plotIdToFetch).single();
            setActivePlot(plotData);
          }
        }

        if (plotIdToFetch) {
          // Fetch the photographic proof of work
          const { data: logs } = await supabase.from('harvest_logs').select('*').eq('plot_id', plotIdToFetch).order('created_at', { ascending: false });
          setHarvestLogs(logs || []);
        }
        setLoading(false);
      }
    });

    // Listen to real-time harvest proofs
    const channel = supabase.channel('harvests_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'harvest_logs' }, (payload) => {
        setHarvestLogs(prev => [payload.new as any, ...prev]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <Sidebar />
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>Loading Dashboard...</div>
        </main>
      </div>
    );
  }

  if (!activePlot) {
    return (
      <div className="page-shell">
        <Sidebar />
        <main className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "var(--color-muted)" }}>
            <h2>No Active Plot</h2>
            <p>You currently do not have an active farming contract bound to a plot.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">

        <div className="page-header fade-up">
          <div className="page-header-text">
            <h2>{activePlot.title || "Your Farm"}</h2>
            <p>Your officially contracted farming operation.</p>
          </div>
          <span className="badge badge-green" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
            ✓ Contract Active
          </span>
        </div>

        <div className="grid-2 fade-up fade-up-1" style={{ alignItems: "start" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Plot quick actions */}
            <div className="card">
              <h3 className="mb-16">Quick Actions</h3>
              <div className="grid-2">
                {!isOwner ? (
                  <button 
                    className="btn btn-primary btn-full"
                    onClick={() => router.push(`/dashboard/plot/${activePlot.id}/log`)}
                  >
                    📝 Log Harvest
                  </button>
                ) : (
                  <button 
                    className="btn btn-full"
                    style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fca5a5" }}
                    onClick={() => {
                        setIsRevoked(true);
                        alert("Gate access revoked. The gardener has been notified.");
                    }}
                  >
                    🛑 Revoke Gate Access
                  </button>
                )}
                <button 
                  className="btn btn-secondary btn-full"
                  onClick={() => router.push("/dashboard/inbox")}
                >
                  💬 Open Inbox
                </button>
              </div>
            </div>

            {/* Plot Details */}
            <div className="card">
              <h3 className="mb-16">Plot Details</h3>
              <div className="flex justify-between items-center mb-16" style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <span className="color-muted text-sm">Monthly Utility Fee</span>
                <span className="font-semibold text-sm">{activePlot.utility_fee_monthly === 0 ? "Crop Share" : `$${activePlot.utility_fee_monthly}`}</span>
              </div>
              <div className="flex justify-between items-center mb-16" style={{ paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <span className="color-muted text-sm">Property Guarantee</span>
                <span className="font-semibold text-sm" style={{ color: "var(--brand-green)" }}>Secured by NeighborPatch</span>
              </div>
              <div className="mt-24">
                <h4 className="mb-8 text-sm">Ground Rules:</h4>
                <ul style={{ paddingLeft: 20, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <li className="mb-4">Organic guidelines heavily enforced.</li>
                  <li className="mb-4">Please ensure the side gate is locked when leaving.</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Harvest Photographs (The Feed) */}
            <div className="card" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
              <h3 className="mb-16" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Harvest Logs & Proof</span>
                <span className="badge" style={{ background: "var(--bg-muted)", color: "var(--color-muted)", fontSize: "0.75rem" }}>
                  {harvestLogs.length} Yields
                </span>
              </h3>
              
              {harvestLogs.length === 0 ? (
                <div style={{ background: "var(--bg-muted)", borderRadius: "var(--radius-md)", padding: "40px 24px", textAlign: "center", color: "var(--color-muted)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌱</div>
                  <p className="text-sm">No harvests logged yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {harvestLogs.map((log) => (
                    <div key={log.id} style={{ background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                      <img src={log.photo_url} alt="Harvest yield" style={{ width: "100%", height: "240px", objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontWeight: 600, color: "var(--brand-green)" }}>{log.weight_lbs} lbs Harvested</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>{new Date(log.created_at).toLocaleDateString()}</span>
                        </div>
                        {log.notes && (
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>"{log.notes}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
