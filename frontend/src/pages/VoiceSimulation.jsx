import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

let vapiInstance = null;

export default function VoiceSimulation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("briefing");
  const [transcript, setTranscript] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef([]);
  const transcriptEndRef = useRef(null);
  const evaluatingRef = useRef(false);
  const name = sessionStorage.getItem("evalName") || "Candidate";

  const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || "beef8108-20f1-4a2f-9a4d-e24052e04d6f";
  const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (vapiInstance) { try { vapiInstance.stop(); } catch(e) {} }
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Keep ref in sync with state so call-end handler can read latest transcript
  const updateTranscript = (updater) => {
    setTranscript(prev => {
      const next = updater(prev);
      transcriptRef.current = next;
      return next;
    });
  };

  const evaluateTranscript = async (lines) => {
    if (evaluatingRef.current) return;
    evaluatingRef.current = true;
    setPhase("evaluating");
    setStatusMsg("Claude is grading your call...");

    const transcriptText = lines
      .filter(t => t.final !== false && t.text?.trim())
      .map(t => `${t.role === "user" ? name + " (Dispatcher)" : "CUSTOMER (Mike)"}: ${t.text.trim()}`)
      .join("\n");

    // Always save the transcript for display
    sessionStorage.setItem("voiceTranscript", transcriptText);

    if (!transcriptText || transcriptText.length < 30) {
      sessionStorage.setItem("voiceEval", JSON.stringify({
        totalScore: 0,
        recommendation: "NOT RECOMMENDED",
        summary: "The call was too short or no transcript was captured. Please ensure your microphone is working and the call lasts at least 1-2 minutes.",
        rubricResults: [
          { item: "Proper greeting", status: "missed", points: 0, maxPoints: 5, note: "No transcript captured" },
          { item: "Explained test details", status: "missed", points: 0, maxPoints: 10, note: "No transcript captured" },
          { item: "Quoted correct price ($375)", status: "missed", points: 0, maxPoints: 10, note: "No transcript captured" },
          { item: "Mentioned warranty", status: "missed", points: 0, maxPoints: 10, note: "No transcript captured" },
        ],
        coachingNotes: ["Ensure microphone permission is granted in your browser.", "Make sure the call lasts at least 2-3 minutes.", "Speak clearly and wait for the customer to finish before responding."]
      }));
      evaluatingRef.current = false;
      setPhase("done");
      return;
    }

    try {
      setStatusMsg("Sending transcript to Claude for grading...");
      const res = await fetch("/api/evaluate/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText, role: "dispatcher" }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      sessionStorage.setItem("voiceEval", JSON.stringify(data));
      setStatusMsg("Grading complete!");
    } catch (err) {
      console.error("Evaluation error:", err);
      // Save a fallback but still save the transcript
      sessionStorage.setItem("voiceEval", JSON.stringify({
        totalScore: 0,
        recommendation: "CONSIDER",
        summary: "Grading service error — transcript was captured but could not be evaluated automatically. Please review the transcript manually.",
        rubricResults: [],
        coachingNotes: ["Manual review required — see transcript below."]
      }));
    } finally {
      evaluatingRef.current = false;
      setPhase("done");
    }
  };

  const initVapi = async () => {
    if (!VAPI_PUBLIC_KEY || VAPI_PUBLIC_KEY === "your_vapi_public_key_here") {
      setError("VITE_VAPI_PUBLIC_KEY is not set in Railway environment variables.");
      return;
    }
    try {
      setPhase("calling");
      setError(null);
      transcriptRef.current = [];
      setTranscript([]);

      const { default: Vapi } = await import("@vapi-ai/web");
      vapiInstance = new Vapi(VAPI_PUBLIC_KEY);

      vapiInstance.on("call-start", () => {
        setPhase("active");
        timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
      });

      // This fires when call ends — either user clicks End Call OR VAPI ends it naturally
      vapiInstance.on("call-end", () => {
        clearInterval(timerRef.current);
        // Use the ref to get latest transcript at time of call end
        const finalLines = transcriptRef.current;
        evaluateTranscript(finalLines);
      });

      vapiInstance.on("message", (msg) => {
        // Capture both transcript chunks and conversation updates
        if (msg.type === "transcript") {
          const role = msg.role;
          const text = msg.transcript;
          const isFinal = msg.transcriptType === "final";

          updateTranscript(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === role && !last.final) {
              return [...prev.slice(0, -1), { role, text, final: isFinal }];
            }
            return [...prev, { role, text, final: isFinal }];
          });
        }

        // VAPI also sends full conversation via conversation-update
        if (msg.type === "conversation-update" && msg.conversation) {
          const lines = msg.conversation
            .filter(m => m.role === "user" || m.role === "assistant")
            .filter(m => m.content?.trim())
            .map(m => ({ role: m.role === "user" ? "user" : "assistant", text: m.content, final: true }));
          if (lines.length > transcriptRef.current.length) {
            transcriptRef.current = lines;
            setTranscript(lines);
          }
        }
      });

      vapiInstance.on("error", (e) => {
        console.error("VAPI error:", e);
        clearInterval(timerRef.current);
        setError("Call error: " + (e?.message || e?.error?.message || "Check your VAPI key and assistant ID."));
        setPhase("briefing");
      });

      await vapiInstance.start(VAPI_ASSISTANT_ID);
    } catch (err) {
      console.error(err);
      clearInterval(timerRef.current);
      setError("Failed to start call: " + err.message);
      setPhase("briefing");
    }
  };

  const endCallManually = () => {
    clearInterval(timerRef.current);
    if (vapiInstance) {
      try { vapiInstance.stop(); } catch(e) {}
    }
    // call-end event will fire and trigger evaluateTranscript
  };

  const handleMute = () => {
    if (vapiInstance) { vapiInstance.setMuted(!isMuted); setIsMuted(!isMuted); }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── BRIEFING ──────────────────────────────────────
  if (phase === "briefing") {
    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm fade-in" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 24, fontWeight: 800 }}>🎙️ Voice Call Simulation</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>Part 3 of your Dispatcher Evaluation</p>
            </div>
            <div className="card-body">
              <div style={{ padding: "1rem", background: "rgba(0,119,182,0.06)", borderRadius: "var(--radius)", border: "1px solid rgba(0,119,182,0.15)", marginBottom: "1.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--pool-blue-dark)", marginBottom: 8 }}>Your scenario:</div>
                <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6, margin: 0 }}>
                  An inbound call is coming in. The AI plays <strong>Mike Rodriguez</strong>, a homeowner who suspects a pool leak. He's slightly skeptical about cost. Handle the call exactly as you would on the job — work through the full script and move toward booking.
                </p>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>You'll be graded on:</div>
                {[
                  "Proper greeting with your name",
                  "Explaining what the test includes (plumbing, shell, equipment pad, seals)",
                  "Quoting $375 correctly",
                  "Mentioning 1–3 hour test duration",
                  "Saying customer doesn't need to be home",
                  "Mentioning the full report + repair estimate",
                  "Mentioning the 3-year no-leak warranty",
                  "Offering to send a text / collect info",
                  "Mentioning prepayment + free cancellation",
                  "Professional, confident, friendly tone",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--gray-700)", padding: "3px 0" }}>
                    <span style={{ color: "var(--pool-blue)", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 14px", background: "var(--amber-light)", borderRadius: "var(--radius)", marginBottom: "1.5rem", fontSize: 13, color: "var(--amber)" }}>
                ⚠️ Allow microphone access when your browser asks. The call will be recorded and graded automatically when it ends.
              </div>
              {error && (
                <div style={{ padding: "12px 14px", background: "var(--red-light)", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: 13, color: "var(--red)", lineHeight: 1.6 }}>
                  <strong>Error:</strong> {error}
                </div>
              )}
              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={initVapi}>
                📞 Answer the Call
              </button>
              <button onClick={() => navigate("/results")} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 12, background: "none", border: "none", color: "var(--gray-400)", fontSize: 13, cursor: "pointer" }}>
                Skip voice simulation → go to results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── EVALUATING ─────────────────────────────────────
  if (phase === "evaluating") {
    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-body text-center" style={{ padding: "3rem 2rem" }}>
              <div style={{ fontSize: 64, marginBottom: "1rem" }}>🤖</div>
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Grading Your Call</h2>
              <p style={{ fontSize: 15, color: "var(--gray-600)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Claude is reviewing your transcript against the Mr. Pool Leak script rubric. This takes about 10–15 seconds.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--pool-blue)", fontWeight: 600, fontSize: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid var(--pool-blue)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                {statusMsg || "Processing..."}
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: 12, color: "var(--gray-400)", marginTop: "2rem" }}>
                {transcript.filter(t => t.text?.trim()).length} transcript lines captured
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ───────────────────────────────────────────
  if (phase === "done") {
    const evalData = JSON.parse(sessionStorage.getItem("voiceEval") || "{}");
    const score = evalData.totalScore ?? 0;
    const scoreColor = score >= 85 ? "var(--green)" : score >= 65 ? "var(--amber)" : "var(--red)";

    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm slide-up" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-header text-center">
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 24, fontWeight: 800 }}>📞 Call Graded!</h2>
            </div>
            <div className="card-body text-center">
              <div style={{ fontFamily: "var(--font-condensed)", fontSize: 72, fontWeight: 800, color: scoreColor, lineHeight: 1, marginBottom: 8 }}>
                {score}
              </div>
              <div style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: "0.5rem" }}>out of 100</div>
              <div className={`badge ${evalData.recommendation === "STRONG HIRE" ? "badge-green" : evalData.recommendation === "CONSIDER" ? "badge-amber" : "badge-red"}`} style={{ marginBottom: "1rem" }}>
                {evalData.recommendation || "REVIEWED"}
              </div>
              <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {evalData.summary}
              </p>

              {/* Quick rubric preview */}
              {evalData.rubricResults && evalData.rubricResults.length > 0 && (
                <div style={{ textAlign: "left", marginBottom: "1.5rem", background: "var(--off-white)", borderRadius: "var(--radius)", padding: "1rem" }}>
                  <div className="section-label" style={{ marginBottom: 8 }}>Quick rubric preview:</div>
                  {evalData.rubricResults.slice(0, 5).map((r, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, padding: "3px 0" }}>
                      <span>{r.status === "hit" ? "✅" : r.status === "partial" ? "🟡" : "❌"}</span>
                      <span style={{ flex: 1, color: "var(--gray-700)" }}>{r.item}</span>
                      <span style={{ fontWeight: 700, color: r.points > 0 ? "var(--green)" : "var(--red)" }}>{r.points}/{r.maxPoints}</span>
                    </div>
                  ))}
                  {evalData.rubricResults.length > 5 && (
                    <div style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 6 }}>+ {evalData.rubricResults.length - 5} more items in full results</div>
                  )}
                </div>
              )}

              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => navigate("/results")}>
                View Full Results & Transcript →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CALLING / ACTIVE ───────────────────────────────
  return (
    <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="container" style={{ width: "100%" }}>

        {/* Call status bar */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%", fontSize: 20,
                background: phase === "active" ? "var(--green)" : "var(--amber)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {phase === "calling" ? "⏳" : "📞"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {phase === "calling" ? "Connecting to Mike..." : "Mike Rodriguez — Live Call"}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>
                  {phase === "active" ? `Duration: ${formatTime(callDuration)} · Call will be graded when it ends` : "Initializing..."}
                </div>
              </div>
            </div>
            {phase === "active" && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className={`btn btn-sm ${isMuted ? "btn-danger" : "btn-outline"}`} onClick={handleMute}>
                  {isMuted ? "🔇 Unmute" : "🎤 Mute"}
                </button>
                <button className="btn btn-sm btn-danger" onClick={endCallManually}>
                  End Call
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pulse orb */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div className={`call-orb ${phase === "active" ? "active" : ""}`} style={{ opacity: phase === "calling" ? 0.5 : 1 }}>
            <span style={{ fontSize: 48 }}>📞</span>
          </div>
        </div>

        {/* Live transcript */}
        <div className="card">
          <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--gray-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="section-label" style={{ margin: 0 }}>Live Transcript</div>
            {phase === "active" && (
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", animation: "pulse-ring 1s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recording</span>
              </div>
            )}
          </div>
          <div style={{ padding: "1rem 1.5rem", minHeight: 300, maxHeight: 450, overflowY: "auto" }}>
            {transcript.filter(t => t.text?.trim()).length === 0 ? (
              <div style={{ color: "var(--gray-400)", fontSize: 14, textAlign: "center", paddingTop: "3rem" }}>
                {phase === "calling" ? "📡 Connecting — please wait..." : "Start speaking — transcript will appear here in real time."}
              </div>
            ) : (
              transcript.filter(t => t.text?.trim()).map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: t.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                  <div style={{
                    maxWidth: "78%", padding: "8px 14px",
                    borderRadius: t.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: t.role === "user" ? "var(--pool-blue)" : "var(--gray-100)",
                    color: t.role === "user" ? "white" : "var(--gray-800)",
                    fontSize: 14, lineHeight: 1.5,
                    opacity: t.final === false ? 0.6 : 1,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.65, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {t.role === "user" ? `${name} (You)` : "Mike — Customer"}
                    </div>
                    {t.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
          <div style={{ padding: "0.75rem 1.5rem", borderTop: "1px solid var(--gray-100)", fontSize: 12, color: "var(--gray-400)" }}>
            Your call will be automatically graded by Claude when you click "End Call" or when Mike hangs up.
          </div>
        </div>

      </div>
    </div>
  );
}
