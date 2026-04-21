"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function HarvestLogPage() {
  const router = useRouter();
  const params = useParams();
  const plotId = params.id as string;

  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("A photo of the harvest is required for the Homeowner Guarantee.");
    
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Upload the image directly to Supabase Storage (harvests bucket)
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('harvests')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      alert("Photo upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    // 2. Get the public URL for the image
    const { data: publicUrlData } = supabase.storage.from('harvests').getPublicUrl(fileName);
    const photoUrl = publicUrlData.publicUrl;

    // 3. Write securely to the harvest_logs table
    const { error: dbError } = await supabase.from('harvests').insert({
      plot_id: plotId,
      gardener_id: user.id,
      weight_lbs: parseFloat(weight) || 0,
      photo_url: photoUrl,
      notes: notes
    });
    // Wait, the table we created in Phase 3 is `harvest_logs`, let's check! 
    // Yes, Phase 3.1 created `harvest_logs`
    const { error: logError } = await supabase.from('harvest_logs').insert({
      plot_id: plotId,
      gardener_id: user.id,
      weight_lbs: parseFloat(weight) || 0,
      photo_url: photoUrl,
      notes: notes
    });

    if (logError) {
      alert("Failed to save log: " + logError.message);
      setLoading(false);
      return;
    }

    alert("Harvest Logged Successfully!");
    router.push("/dashboard/my-plot");
  };

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
          <h2>Log Harvest</h2>
          <p className="color-muted" style={{ marginBottom: "24px" }}>
            Take a photo of your yield to provide visual proof for the homeowner and build your Gardener Resume.
          </p>

          <form onSubmit={handleSubmit} className="form-group">
            <label>Proof of Harvest</label>
            <div 
              style={{ 
                border: "2px dashed var(--border)", 
                borderRadius: "var(--radius-md)", 
                padding: preview ? "0" : "40px", 
                textAlign: "center",
                background: "var(--bg-base)",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {preview ? (
                <img src={preview} alt="Harvest Preview" style={{ width: "100%", height: "auto", display: "block" }} />
              ) : (
                <>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📸</div>
                  <div style={{ fontWeight: 600 }}>Tap to open Camera</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>JPEG, PNG max 5MB</div>
                </>
              )}
              
              {/* The mobile-first trick: accept="image/*" capture="environment" opens the rear camera instantly on iOS/Android */}
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={handleFileChange}
                style={{ 
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" 
                }}
              />
            </div>

            <label>Yield Weight (lbs)</label>
            <input 
              type="number" 
              step="0.1"
              className="input" 
              required
              placeholder="e.g. 1.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />

            <label style={{ marginTop: "16px" }}>Notes for the Homeowner (Optional)</label>
            <textarea 
              className="input" 
              rows={3}
              placeholder="Left 3 tomatoes on the porch counter!"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "24px" }}>
              {loading ? "Uploading Securely..." : "Submit Harvest Log"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
