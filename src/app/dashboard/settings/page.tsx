"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleProUpgrade = async () => {
    setLoading(true);
    // Development Bypass: Instantly toggle pro status without Stripe
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').update({ is_pro: !profile?.is_pro }).eq('id', user.id);
    setProfile({ ...profile, is_pro: !profile?.is_pro });
    setLoading(false);
  };

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
          <h2 style={{ marginBottom: "24px" }}>Account Settings</h2>
          
          <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>NeighborPatch Pro</h3>
            <p className="color-muted" style={{ fontSize: "0.9rem", marginBottom: "16px" }}>
              Unlock instant notifications and 24-hour early access to the best premium plots before free users see them on the map.
            </p>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-base)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div>
                <strong style={{ display: "block" }}>Pro Status</strong>
                <span style={{ fontSize: "0.85rem", color: profile?.is_pro ? "var(--brand-green)" : "var(--color-muted)" }}>
                  {profile?.is_pro ? "Active ($4.99/mo)" : "Inactive"}
                </span>
              </div>
              
              <button 
                onClick={handleProUpgrade} 
                className={`btn ${profile?.is_pro ? "btn-secondary" : "btn-primary"}`}
                disabled={loading}
              >
                {loading ? "Updating..." : (profile?.is_pro ? "Cancel Subscription" : "Upgrade Now")}
              </button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-muted)", marginTop: "12px", fontStyle: "italic" }}>
              * Development Bypass Mode: Clicking this button instantly toggles your Pro database status without requiring a credit card.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
