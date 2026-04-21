"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

const CONVOS = [
  {
    id: 1,
    name: "Sarah & Tom Miller",
    initials: "SM",
    plot: "Sunny Backyard — East Austin",
    lastMessage: "Thanks for logging the harvest! We loved the tomatoes you left 🍅",
    time: "2h ago",
    unread: 2,
    verified: true,
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    initials: "CR",
    plot: "Large Side Yard — Mueller",
    lastMessage: "Hi! I saw your profile. Are you still accepting applications?",
    time: "Yesterday",
    unread: 0,
    verified: true,
  },
];

const MESSAGES = [
  { from: "them", text: "Hey John! Just wanted to reach out — we really appreciate how tidy you keep the beds.", time: "Mon 9:14 AM" },
  { from: "me",   text: "Thank you so much! It means a lot. I left some zucchini and cherry tomatoes in the basket by the back gate.", time: "Mon 9:32 AM" },
  { from: "them", text: "We found them! Absolutely delicious. The kids are obsessed with the cherry tomatoes 😄", time: "Mon 10:05 AM" },
  { from: "them", text: "Thanks for logging the harvest! We loved the tomatoes you left 🍅", time: "Today 8:22 AM" },
];

export default function InboxPage() {
  const router = useRouter();
  const [activeConvo, setActiveConvo] = useState(CONVOS[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [addressRevealed, setAddressRevealed] = useState(false);

  useEffect(() => {
    // Phase 4: Mock connection to Supabase Realtime channel
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as any;
        setMessages((prev) => [...prev, { from: newMsg.from, text: newMsg.text, time: newMsg.time || "Now" }]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input, time: "Now" }]);
    setInput("");
  };

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
        
        {/* Page header */}
        <div style={{ padding: "32px 40px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2>Inbox</h2>
          <p style={{ fontSize: "0.9rem" }}>Conversations with homeowners and applicants.</p>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 110px)" }}>

          {/* Conversation list */}
          <div style={{ width: 280, borderRight: "1px solid var(--border)", overflowY: "auto", flexShrink: 0 }}>
            {CONVOS.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConvo(c)}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  background: activeConvo.id === c.id ? "var(--brand-green-pale)" : "transparent",
                  transition: "background var(--transition)",
                }}
              >
                <div className="flex items-center gap-12">
                  <div className="user-avatar" style={{ background: activeConvo.id === c.id ? "var(--brand-green)" : "#94a3b8" }}>{c.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex justify-between">
                      <span className="font-semibold" style={{ fontSize: "0.88rem" }}>{c.name}</span>
                      <span className="text-xs color-muted">{c.time}</span>
                    </div>
                    <div className="text-xs color-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMessage}</div>
                  </div>
                  {c.unread > 0 && (
                    <span style={{ background: "var(--brand-green)", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: "0.68rem", display: "grid", placeItems: "center", fontWeight: 700, flexShrink: 0 }}>{c.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Messages pane */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Chat Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
              <div>
                <div className="font-semibold">{activeConvo.name}</div>
                <div className="text-xs color-muted">Re: {activeConvo.plot}</div>
              </div>
              <div className="flex gap-8">
                {addressRevealed
                  ? <span className="badge badge-green">📍 Address Revealed</span>
                  : <button className="btn btn-sm" style={{ background: "var(--brand-earth-light)", color: "var(--brand-earth)" }} onClick={() => setAddressRevealed(true)}>Reveal Address</button>
                }
                <button className="btn btn-secondary btn-sm" onClick={() => router.push("/dashboard/contracts/sign")}>View Agreement</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-base)" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "me" ? "flex-end" : "flex-start" }}>
                  <div className={`chat-bubble ${m.from === "me" ? "from-me" : "from-them"}`}>{m.text}</div>
                  <div className="chat-time" style={{ textAlign: m.from === "me" ? "right" : "left" }}>{m.time}</div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "white", display: "flex", gap: "10px" }}>
              <input
                className="input"
                style={{ flex: 1 }}
                placeholder="Write a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button className="btn btn-primary" onClick={send}>Send</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
