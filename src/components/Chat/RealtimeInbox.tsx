"use client";

import { useState } from "react";

export default function RealtimeInbox() {
  const [addressRevealed, setAddressRevealed] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "gardener", text: "Hey! I'm really interested in the East Austin plot. I have my Identity Verified badge and 3 years experience.", time: "10:00 AM" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { sender: "owner", text: input, time: "Now" }]);
    setInput("");
  };

  const handleReveal = () => {
    setAddressRevealed(true);
    // In production, this updates the Supabase RLS policy, granting this specific 
    // gardener ID access to the exact_address column on the plots table.
    alert("Address Revealed! The gardener can now see exactly where the plot is to complete the application.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "600px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "white" }}>
      
      {/* Header with Safety Controls */}
      <div style={{ padding: "15px 20px", borderBottom: "1px solid var(--border-color)", background: "var(--bg-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0 }}>Applicant: John Doe</h3>
          <span style={{ fontSize: "0.8rem", color: "var(--primary-color)", fontWeight: "bold" }}>✓ ID Verified</span>
        </div>
        {!addressRevealed ? (
          <button style={{ backgroundColor: "#DD6B20", color: "white" }} onClick={handleReveal}>
            Reveal Exact Address
          </button>
        ) : (
          <button style={{ backgroundColor: "var(--primary-color)", color: "white" }}>
            Start E-Sign Agreement
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.sender === "owner" ? "flex-end" : "flex-start", background: m.sender === "owner" ? "var(--primary-color)" : "#edf2f7", color: m.sender === "owner" ? "white" : "black", padding: "10px 15px", borderRadius: "var(--radius-md)", maxWidth: "70%" }}>
            {m.text}
            <div style={{ fontSize: "0.7rem", marginTop: "5px", opacity: 0.7 }}>{m.time}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "15px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}
        />
        <button className="primary" onClick={handleSend}>Send</button>
      </div>

    </div>
  );
}
