"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email to confirm registration!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)", minHeight: "100vh" }}>
      <div className="card" style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>🌿</div>
          <h2 style={{ fontSize: "1.4rem" }}>NeighborPatch</h2>
          <p className="text-sm color-muted">Log in to manage your marketplace.</p>
        </div>

        {error && (
          <div style={{ padding: "10px", background: "#fee2e2", color: "#ef4444", borderRadius: 6, fontSize: "0.85rem", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="field mb-16">
          <label>Email Address</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        
        <div className="field mb-24">
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary btn-full mb-16" onClick={handleAuth} disabled={loading || !email || !password}>
          {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
        </button>

        <div style={{ textAlign: "center" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
