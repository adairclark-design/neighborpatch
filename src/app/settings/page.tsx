"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        
        <div className="page-header fade-up">
          <div className="page-header-text">
            <h2>Account Settings</h2>
            <p>Manage your profile, billing, and notification preferences.</p>
          </div>
        </div>

        <div className="grid-2 fade-up fade-up-1" style={{ alignItems: "start" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Profile Settings */}
            <div className="card">
              <h3 className="mb-16">Profile Information</h3>
              <div className="field mb-16">
                <label>Full Name</label>
                <input className="input" defaultValue="John Doe" />
              </div>
              <div className="field mb-16">
                <label>Email Address</label>
                <input className="input" defaultValue="john@example.com" />
              </div>
              <div className="field mb-16">
                <label>Phone Number</label>
                <input className="input" defaultValue="(555) 123-4567" />
              </div>
              <button className="btn btn-primary mt-8">Save Changes</button>
            </div>

            {/* Notification Settings */}
            <div className="card">
              <h3 className="mb-16">Notifications</h3>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.9rem" }}>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)} 
                  style={{ width: "18px", height: "18px" }}
                />
                Email me when I receive a new message or application
              </label>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Stripe Verification Status */}
            <div className="card card-sm">
              <h3 className="mb-16">Identity Verification</h3>
              <div className="flex items-center gap-12 mb-16">
                <div style={{ fontSize: "2rem" }}>🛡️</div>
                <div>
                  <div className="font-semibold color-green">Identity Verified via Stripe</div>
                  <p className="text-xs color-muted mt-4">Your government ID was securely verified on March 28, 2026.</p>
                </div>
              </div>
              <button className="btn btn-secondary btn-full">Review Verification Token</button>
            </div>

            {/* Billing */}
            <div className="card card-sm">
              <h3 className="mb-16">Billing & Payouts</h3>
              <p className="text-sm color-secondary mb-16">Manage your saved payment methods for utility fees, or set up your bank account to receive flat-fee payments from gardeners.</p>
              <button className="btn btn-ghost" style={{ background: "var(--brand-earth-light)", color: "var(--brand-earth)", width: "100%" }}>
                Open Stripe Dashboard ↗
              </button>
            </div>

            {/* Danger Zone */}
            <div className="card card-sm" style={{ border: "1px solid #fca5a5" }}>
              <h3 className="mb-8" style={{ color: "#ef4444" }}>Danger Zone</h3>
              <p className="text-xs color-secondary mb-16">Permanently delete your account and remove all active listings.</p>
              <button className="btn btn-sm" style={{ background: "#ef4444", color: "white" }}>Delete Account</button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
