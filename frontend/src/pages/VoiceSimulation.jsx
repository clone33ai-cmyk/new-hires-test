import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

let vapiInstance = null;

export default function VoiceSimulation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("briefing");
  const [displayLines, setDisplayLines] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [gradingStatus, setGradingStatus] = useState("");

  // Use refs for everything the call-end handler needs
  // (React state is stale inside event handlers)
  const linesRef = useRef([]);
  const fullConversationRef = useRef([]);
  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const hasGradedRef = useRef(false);

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
  }, [displayLines]);

  const gradeCall = async () => {
    if (hasGradedRef.current) return;
    hasGradedRef.current = true;
    setPhase("evaluating");

    // Build transcript — try fullConversation first, fall back to linesRef
    let lines = fullConversationRef.current.length > 0
      ? fullConversationRef.current
      : linesRef.current;

    const transcriptText = lines
      .filter(l => l.text && l.text.trim().length > 0)
      .map(l => `${l.role === "user" ? name + " (Dispatcher)" : "CUSTOMER (Mike)"}: ${l.text.trim()}`)
      .join("\n");

    console.log("Grading transcript:", transcriptText.length, "chars");
    console.log("Transcript preview:", transcriptText.slice(0, 200));

    // Always save transcript regardless of grading outcome
    sessionStorage.setItem("voiceTranscript", transcriptText);

    if (!transcriptText || transcriptText.length < 20) {
      sessionStorage.setItem("voiceEval", JSON.stringify({
        totalScore: 0,
        recommendation: "NOT RECOMMENDED",
        summary: "No transcript was captured. Please check that your microphone was working and the call lasted at least 1-2 minutes.",
        rubricResults: [],
        coachingNotes: ["Microphone may not have been active.", "Try the call again with mic permissions granted."]
      }));
      setPhase("done");
      return;
    }

    try {
      setGradingStatus("Sending to Claude for grading...");

      const res = await fetch("/api/evaluate/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText, role: "dispatcher" }),
      });

      const text = await res.text();
      console.log("Grading API response:", res.status, text.slice(0, 300));

      if (!res.ok) throw new Error(`API returned ${res.status}: ${text}`);

      const data = JSON.parse(text);
      sessionStorage.setItem("voiceEval", JSON.stringify(data));
      setGradingStatus("Complete!");
    } catch (err) {
      console.error("Grading failed:", err);
      // Save a placeholder with the transcript so at least that shows
      sessionStorage.setItem("voiceEval", JSON.stringify({
        totalScore: null,
        recommendation: "MANUAL REVIEW",
        summary: "Automatic grading encountered an error. Your transcript was saved — please review it manually below.",
        rubricResults: [],
        coachingNotes: ["Grading error: " + err.message]
      }));
    } finally {
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
      linesRef.current = [];
      fullConversationRef.current = [];
      hasGradedRef.current = false;
      setDisplayLines([]);

      const { default: Vapi } = await import("@vapi-ai/web");
      vapiInstance = new Vapi(VAPI_PUBLIC_KEY);

      vapiInstance.on("call-start", () => {
        setPhase("active");
        timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
      });

      vapiInstance.on("call-end", () => {
        clearInterval(timerRef.current);
        gradeCall();
      });

      vapiInstance.on("message", (msg) => {
        // Method 1: real-time transcript chunks
        if (msg.type === "transcript") {
          const role = msg.role; // "user" or "assistant"
          const text = msg.transcript || "";
          const isFinal = msg.transcriptType === "final";

          const newLine = { role, text, final: isFinal };

          // Update ref (for grading)
          const prev = linesRef.current;
          const last = prev[prev.length - 1];
          if (last && last.role === role && !last.final) {
            linesRef.current = [...prev.slice(0, -1), newLine];
          } else {
            linesRef.current = [...prev, newLine];
          }

          // Update display state
          setDisplayLines([...linesRef.current]);
        }

        // Method 2: full conversation object (more reliable)
        if (msg.type === "conversation-update" && Array.isArray(msg.conversation)) {
          const mapped = msg.conversation
            .filter(m => (m.role === "user" || m.role === "assistant") && m.content?.trim())
            .map(m => ({ role: m.role === "user" ? "user" : "assistant", text: m.content.trim(), final: true }));

          if (mapped.length > 0) {
            fullConversationRef.current = mapped;
            // Also update display with these (more complete)
            setDisplayLines(mapped);
          }
        }

        // Method 3: end-of-call-report from VAPI (most complete)
        if (msg.type === "end-of-call-report") {
          console.log("end-of-call-report received:", JSON.stringify(msg).slice(0, 500));
          if (msg.transcript) {
            // VAPI sends a plain text transcript string
            const lines = msg.transcript.split("\n")
              .filter(l => l.trim())
              .map(l => {
                const isAssistant = l.toLowerCase().startsWith("assistant:") || l.toLowerCase().startsWith("mike");
                const text = l.replace(/^(assistant|user|mike|dispatcher)[:\s]*/i, "").trim();
                return { role: isAssistant ? "assistant" : "user", text, final: true };
              });
            if (lines.length > 0) fullConversationRef.current = lines;
          }
          if (msg.messages && Array.isArray(msg.messages)) {
            const mapped = msg.messages
              .filter(m => (m.role === "user" || m.role === "assistant") && m.content?.trim())
              .map(m => ({ role: m.role, text: m.content.trim(), final: true }));
            if (mapped.length > 0) fullConversationRef.current = mapped;
          }
        }
      });

      vapiInstance.on("error", (e) => {
        console.error("VAPI error:", e);
        clearInterval(timerRef.current);
        setError("Call error: " + (e?.message || e?.error?.message || "Unknown error. Check your VAPI key."));
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
    if (vapiInstance) { try { vapiInstance.stop(); } catch(e) { gradeCall(); } }
  };

  const handleMute = () => {
    if (vapiInstance) { vapiInstance.setMuted(!isMuted); setIsMuted(!isMuted); }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── BRIEFING ──
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
                  An inbound call is coming in. The AI plays <strong>Mike Rodriguez</strong>, a homeowner who suspects a pool leak. Handle the call exactly as you would on the job — use the full script and move toward booking.
                </p>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>You will be graded on:</div>
                {["Proper greeting with your name", "Explaining what the test includes", "Quoting $375 correctly", "1-3 hour test duration", "Customer doesn't need to be home", "Full report + repair estimate included", "3-year no-leak warranty", "Offer to send text / collect info", "Prepayment policy + free cancellation", "Professional confident tone"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--gray-700)", padding: "3px 0" }}>
                    <span style={{ color: "var(--pool-blue)", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 14px", background: "var(--amber-light)", borderRadius: "var(--radius)", marginBottom: "1.5rem", fontSize: 13, color: "var(--amber)" }}>
                ⚠️ Allow microphone access when your browser asks. Your call will be automatically graded when it ends.
              </div>
              {error && (
                <div style={{ padding: "12px 14px", background: "var(--red-light)", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: 13, color: "var(--red)", lineHeight: 1.6 }}>
                  <strong>Error:</strong> {error}
                </div>
              )}
              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={initVapi}>📞 Answer the Call</button>
              <button onClick={() => navigate("/results")} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 12, background: "none", border: "none", color: "var(--gray-400)", fontSize: 13, cursor: "pointer" }}>
                Skip voice simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── EVALUATING ──
  if (phase === "evaluating") {
    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-body text-center" style={{ padding: "3rem 2rem" }}>
              <div style={{ fontSize: 56, marginBottom: "1rem" }}>🤖</div>
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Grading Your Call</h2>
              <p style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Claude is reviewing your transcript against the Mr. Pool Leak Repair script. This takes about 10-15 seconds.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--pool-blue)", fontWeight: 600, fontSize: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid var(--pool-blue)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                {gradingStatus || "Processing transcript..."}
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: 12, color: "var(--gray-400)", marginTop: "2rem" }}>
                {(fullConversationRef.current.length || linesRef.current.length)} lines captured
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ──
  if (phase === "done") {
    const evalData = JSON.parse(sessionStorage.getItem("voiceEval") || "{}");
    const score = evalData.totalScore;
    const hasScore = score !== null && score !== undefined;
    const scoreColor = !hasScore ? "var(--gray-400)" : score >= 85 ? "var(--green)" : score >= 65 ? "var(--amber)" : "var(--red)";
    const transcript = sessionStorage.getItem("voiceTranscript") || "";
    const transcriptLines = transcript.split("\n").filter(l => l.trim());

    return (
      <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
        <div className="container" style={{ width: "100%" }}>

          {/* Score card */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-condensed)", fontSize: 64, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                    {hasScore ? score : "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>/ 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-condensed)", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Call Graded</div>
                  <div className={`badge ${evalData.recommendation === "STRONG HIRE" ? "badge-green" : evalData.recommendation === "CONSIDER" ? "badge-amber" : "badge-red"}`} style={{ marginBottom: 8 }}>
                    {evalData.recommendation || "REVIEWED"}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.6, margin: 0 }}>{evalData.summary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rubric preview */}
          {evalData.rubricResults && evalData.rubricResults.length > 0 && (
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
                <div className="section-label">Script Rubric</div>
              </div>
              <div style={{ padding: "0.5rem 1.5rem" }}>
                {evalData.rubricResults.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < evalData.rubricResults.length - 1 ? "1px solid var(--gray-100)" : "none" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{r.status === "hit" ? "✅" : r.status === "partial" ? "🟡" : "❌"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{r.item}</div>
                      {r.note && <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{r.note}</div>}
                    </div>
                    <div style={{ fontFamily: "var(--font-condensed)", fontSize: 15, fontWeight: 800, color: r.points > 0 ? "var(--green)" : "var(--red)", flexShrink: 0 }}>
                      {r.points}/{r.maxPoints}
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontWeight: 700, fontSize: 15 }}>
                  <span>Total</span>
                  <span style={{ color: scoreColor }}>{hasScore ? score : "—"} / 100</span>
                </div>
              </div>
            </div>
          )}

          {/* Coaching notes */}
          {evalData.coachingNotes && evalData.coachingNotes.length > 0 && (
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
                <div className="section-label">Coaching Notes</div>
              </div>
              <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 8 }}>
                {evalData.coachingNotes.map((note, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "var(--off-white)", borderRadius: "var(--radius)", fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6, borderLeft: "3px solid var(--pool-blue)" }}>
                    <span style={{ color: "var(--pool-blue)", fontWeight: 700, flexShrink: 0 }}>💡</span>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full transcript */}
          {transcriptLines.length > 0 && (
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
                <div className="section-label">Full Call Transcript</div>
              </div>
              <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
                {transcriptLines.map((line, i) => {
                  const isYou = line.includes("(Dispatcher)") || line.startsWith(name);
                  const text = line.replace(/^[^:]+:\s*/, "");
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isYou ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "80%", padding: "8px 14px", fontSize: 13, lineHeight: 1.5,
                        background: isYou ? "var(--pool-blue)" : "var(--gray-100)",
                        color: isYou ? "white" : "var(--gray-800)",
                        borderRadius: isYou ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.65, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {isYou ? name : "Mike — Customer"}
                        </div>
                        {text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: "2rem" }} onClick={() => navigate("/results")}>
            View Full Results →
          </button>
        </div>
      </div>
    );
  }

  // ── CALLING / ACTIVE ──
  return (
    <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="container" style={{ width: "100%" }}>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", fontSize: 20, background: phase === "active" ? "var(--green)" : "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {phase === "calling" ? "⏳" : "📞"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{phase === "calling" ? "Connecting to Mike..." : "Mike Rodriguez — Live Call"}</div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{phase === "active" ? `${formatTime(callDuration)} · Will be graded automatically when call ends` : "Connecting..."}</div>
              </div>
            </div>
            {phase === "active" && (
              <div style={{ display: "flex", gap: 8 }}>
                <button className={`btn btn-sm ${isMuted ? "btn-danger" : "btn-outline"}`} onClick={handleMute}>{isMuted ? "🔇 Unmute" : "🎤 Mute"}</button>
                <button className="btn btn-sm btn-danger" onClick={endCallManually}>End Call</button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div className={`call-orb ${phase === "active" ? "active" : ""}`} style={{ opacity: phase === "calling" ? 0.5 : 1 }}>
            <span style={{ fontSize: 48 }}>📞</span>
          </div>
        </div>

        <div className="card">
          <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--gray-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="section-label" style={{ margin: 0 }}>Live Transcript</div>
            {phase === "active" && <div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", animation: "pulse-ring 1s ease-in-out infinite" }} /><span style={{ fontSize: 11, fontWeight: 600, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recording</span></div>}
          </div>
          <div style={{ padding: "1rem 1.5rem", minHeight: 300, maxHeight: 420, overflowY: "auto" }}>
            {displayLines.filter(t => t.text?.trim()).length === 0 ? (
              <div style={{ color: "var(--gray-400)", fontSize: 14, textAlign: "center", paddingTop: "3rem" }}>
                {phase === "calling" ? "📡 Connecting — please wait..." : "Start speaking — transcript appears here in real time."}
              </div>
            ) : (
              displayLines.filter(t => t.text?.trim()).map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: t.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                  <div style={{ maxWidth: "78%", padding: "8px 14px", borderRadius: t.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: t.role === "user" ? "var(--pool-blue)" : "var(--gray-100)", color: t.role === "user" ? "white" : "var(--gray-800)", fontSize: 14, lineHeight: 1.5 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.65, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.role === "user" ? `${name} (You)` : "Mike — Customer"}</div>
                    {t.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
          <div style={{ padding: "0.75rem 1.5rem", borderTop: "1px solid var(--gray-100)", fontSize: 12, color: "var(--gray-400)" }}>
            Your call will be graded automatically when you click "End Call" or when Mike hangs up.
          </div>
        </div>
      </div>
    </div>
  );
}
