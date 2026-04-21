"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

export default function InboxPage() {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [convos, setConvos] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  const [gardenerSurvey, setGardenerSurvey] = useState<any>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [addressRevealed, setAddressRevealed] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);

      // Fetch all messages involving the user
      const { data: rawMessages } = await supabase
        .from('messages')
        .select('*, sender:sender_id(full_name), recipient:recipient_id(full_name), plot:plot_id(title, id, owner_id)')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (rawMessages && rawMessages.length > 0) {
        // Group by plot_id and the "other" person to form conversations
        const convoMap = new Map();
        
        rawMessages.forEach(msg => {
          const isSender = msg.sender_id === user.id;
          const otherUserId = isSender ? msg.recipient_id : msg.sender_id;
          const otherUserName = isSender ? msg.recipient?.full_name : msg.sender?.full_name;
          const mapKey = `${msg.plot_id}_${otherUserId}`;
          
          if (!convoMap.has(mapKey)) {
            convoMap.set(mapKey, {
              id: mapKey,
              otherUserId,
              name: otherUserName || "Unknown User",
              initials: (otherUserName || "U").substring(0,2).toUpperCase(),
              plotId: msg.plot_id,
              plotName: msg.plot?.title || "Unknown Plot",
              plotOwnerId: msg.plot?.owner_id,
              messages: []
            });
          }
          
          convoMap.get(mapKey).messages.push({
            id: msg.id,
            from: isSender ? "me" : "them",
            text: msg.body,
            time: new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          });
        });

        const convoArray = Array.from(convoMap.values());
        // Sort convos by latest message
        convoArray.sort((a, b) => b.messages[b.messages.length - 1].id.localeCompare(a.messages[a.messages.length - 1].id));
        
        setConvos(convoArray);
        setActiveConvo(convoArray[0]);
        setMessages(convoArray[0].messages);
      }
    };
    init();

    // Listen for incoming messages
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        // Simple reload for MVP
        init();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (activeConvo && currentUser) {
      setMessages(activeConvo.messages);
      
      // Determine the applicant (it's the person who isn't the owner)
      const isOwner = activeConvo.plotOwnerId === currentUser.id;
      const applicantId = isOwner ? activeConvo.otherUserId : currentUser.id;

      // Fetch application status
      supabase.from('applications')
        .select('id, status')
        .eq('plot_id', activeConvo.plotId)
        .eq('applicant_id', applicantId)
        .single()
        .then(({ data }) => {
          if (data) {
            setApplicationStatus(data.status);
            setApplicationId(data.id);
          } else {
            setApplicationStatus(null);
            setApplicationId(null);
          }
        });

      // Fetch Gardener Survey data (only relevant if we are reading a gardener's application)
      supabase.from('gardener_surveys')
        .select('*')
        .eq('gardener_id', applicantId)
        .single()
        .then(({ data }) => {
          setGardenerSurvey(data || null);
        });
    }
  }, [activeConvo, currentUser]);

  const send = async () => {
    if (!input.trim() || !activeConvo || !currentUser) return;
    
    const bodyText = input;
    setInput(""); // Optimistic clear

    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      recipient_id: activeConvo.otherUserId,
      plot_id: activeConvo.plotId,
      body: bodyText
    });
    // The postgres listener will trigger a refresh.
  };

  const handleAcceptGardener = async () => {
    if (!applicationId || !activeConvo || !currentUser) return;
    
    // 1. Update application status
    await supabase.from('applications').update({ status: 'approved' }).eq('id', applicationId);
    // 2. Update plot status
    await supabase.from('plots').update({ status: 'occupied' }).eq('id', activeConvo.plotId);
    // 3. Send system message
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      recipient_id: activeConvo.otherUserId,
      plot_id: activeConvo.plotId,
      body: "SYSTEM: Application Approved! The plot is now yours to farm. Contracts have been fully executed."
    });

    setApplicationStatus('approved');
    alert("Application successfully approved! The plot has been secured.");
  };

  const renderPills = (arr: string[]) => {
    if (!arr || arr.length === 0) return <span className="color-muted text-sm">None selected</span>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {arr.map((item, i) => (
          <span key={i} style={{ background: "var(--bg-muted)", padding: "4px 10px", borderRadius: "100px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
        
        {/* Gardener Resume Modal */}
        {isResumeOpen && gardenerSurvey && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
            <div className="card fade-up" style={{ width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
              <button 
                onClick={() => setIsResumeOpen(false)}
                style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--color-muted)" }}
              >
                ✕
              </button>
              
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 20, marginBottom: 20 }}>
                <h2 style={{ marginBottom: 8 }}>{activeConvo?.name || "Gardener"}</h2>
                {gardenerSurvey.hotoku_pledge && (
                  <span className="badge badge-green" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span>🌱</span> Hotoku Community Pledge Signed
                  </span>
                )}
              </div>

              {gardenerSurvey.personal_statement && (
                <div style={{ marginBottom: 24, fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.6, padding: "16px", background: "var(--bg-muted)", borderRadius: "8px", borderLeft: "4px solid var(--brand-green)" }}>
                  "{gardenerSurvey.personal_statement}"
                </div>
              )}

              <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
                <div>
                  <h4 className="mb-8 text-sm">Motivations</h4>
                  {renderPills(gardenerSurvey.motivations)}
                </div>
                <div>
                  <h4 className="mb-8 text-sm">Experience</h4>
                  <div className="text-sm color-secondary">
                    Total: <strong>{gardenerSurvey.gardening_years || "N/A"}</strong><br />
                    Serious: <strong>{gardenerSurvey.serious_gardening_years || "N/A"}</strong><br />
                    Patio/Deck: <strong>{gardenerSurvey.deck_experience || "N/A"}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 className="mb-8 text-sm">What they want to grow</h4>
                {renderPills(gardenerSurvey.crops_to_grow)}
              </div>

              <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
                <div>
                  <h4 className="mb-8 text-sm">Familiar Techniques</h4>
                  {renderPills(gardenerSurvey.techniques)}
                </div>
                <div>
                  <h4 className="mb-8 text-sm">Compost / Soil Knowledge</h4>
                  {renderPills(gardenerSurvey.composting_practices)}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 className="mb-8 text-sm">Tools Owned</h4>
                {renderPills(gardenerSurvey.tools_owned)}
              </div>

              {gardenerSurvey.willing_chicken_care && (
                <div className="badge badge-green" style={{ display: "inline-block" }}>
                  🐔 Willing to help with backyard chickens/quail
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page header */}
        <div style={{ padding: "32px 40px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2>Inbox</h2>
          <p style={{ fontSize: "0.9rem" }}>Conversations with homeowners and applicants.</p>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 110px)" }}>

          {/* Conversation list */}
          <div style={{ width: 280, borderRight: "1px solid var(--border)", overflowY: "auto", flexShrink: 0 }}>
            {convos.length === 0 ? (
              <div style={{ padding: 20, color: "var(--color-muted)", fontSize: "0.9rem" }}>No messages yet.</div>
            ) : convos.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConvo(c)}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  background: activeConvo?.id === c.id ? "var(--brand-green-pale)" : "transparent",
                  transition: "background var(--transition)",
                }}
              >
                <div className="flex items-center gap-12">
                  <div className="user-avatar" style={{ background: activeConvo?.id === c.id ? "var(--brand-green)" : "#94a3b8" }}>{c.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex justify-between">
                      <span className="font-semibold" style={{ fontSize: "0.88rem" }}>{c.name}</span>
                    </div>
                    <div className="text-xs color-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.messages[c.messages.length - 1]?.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Messages pane */}
          {activeConvo ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
                <div>
                  <div className="font-semibold">{activeConvo.name}</div>
                  <div className="text-xs color-muted">Re: {activeConvo.plotName}</div>
                </div>
                <div className="flex gap-8">
                  {activeConvo.plotOwnerId === currentUser?.id && applicationStatus === 'pending' && (
                    <button className="btn btn-sm" style={{ background: "var(--brand-green)", color: "white" }} onClick={handleAcceptGardener}>
                      ✓ Accept Gardener
                    </button>
                  )}
                  {gardenerSurvey && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsResumeOpen(true)}>
                      📄 View Gardener Profile
                    </button>
                  )}
                  {applicationStatus === 'approved' && (
                    <span className="badge badge-green">Contract Active</span>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => router.push("/dashboard/contracts/sign")}>View Agreement</button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-base)" }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "me" ? "flex-end" : "flex-start" }}>
                    <div className={`chat-bubble ${m.from === "me" ? "from-me" : "from-them"}`}>{m.text}</div>
                    <div className="chat-time" style={{ textAlign: m.from === "me" ? "right" : "left" }}>{m.time}</div>
                  </div>
                ))}
              </div>

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
          ) : (
             <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-muted)" }}>
               Select a conversation
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
