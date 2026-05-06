import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// VAPI Web SDK
let vapiInstance = null;

export default function VoiceSimulation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("briefing"); // briefing | calling | active | ended | evaluating
  const [transcript, setTranscript] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const name = sessionStorage.getItem("evalName") || "Candidate";

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (vapiInstance) vapiInstance.stop();
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const initVapi = async () => {
    try {
      // Dynamically import VAPI SDK
      const { default: Vapi } = await import("@vapi-ai/web");

      // Get assistant config from backend
      const res = await fetch("/api/vapi/assistant-config");
      const { assistant } = await res.json();

      vapiInstance = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

      vapiInstance.on("call-start", () => {
        setPhase("active");
        timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
      });

      vapiInstance.on("call-end", () => {
        clearInterval(timerRef.current);
        setPhase("ended");
      });

      vapiInstance.on("message", (msg) => {
        if (msg.type === "transcript") {
          setTranscript(prev => {
            // Update or append
            const last = prev[prev.length - 1];
            if (last && last.role === msg.role && !last.final) {
              return [...prev.slice(0, -1), { ...last, text: msg.transcript, final: msg.transcriptType === "final" }];
            }
            return [...prev, { role: msg.role, text: msg.transcript, final: msg.transcriptType === "final" }];
          });
        }
      });

      vapiInstance.on("error", (e) => {
        console.error("VAPI error:", e);
        setError("Call error: " + (e.message || "Unknown error"));
        setPhase("briefing");
      });

      setPhase("calling");
      await vapiInstance.start(assistant);
    } catch (err) {
      console.error(err);
      setError("Failed to start call: " + err.message);
      setPhase("briefing");
    }
  };

  const endCall = async () => {
    if (vapiInstance) vapiInstance.stop();
    clearInterval(timerRef.current);
    setPhase("evaluating");

    // Build transcript string
    const transcriptText = transcript
      .filter(t => t.final)
      .map(t => `${t.role === "user" ? name : "CUSTOMER (Mike)"}: ${t.text}`)
      .join("\n");

    try {
      const res = await fetch("/api/evaluate/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText, role: "dispatcher" }),
      });
      const data = await res.json();
      setEvaluation(data);
      setPhase("ended");

      // Store for results page
      sessionStorage.setItem("voiceEval", JSON.stringify(data));
      sessionStorage.setItem("voiceTranscript", transcriptText);
    } catch (err) {
      setError("Evaluation failed — please contact your manager.");
      setPhase("ended");
    }
  };

  const handleMute = () => {
    if (vapiInstance) {
      vapiInstance.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const goToResults = () => navigate("/results");

  // --- BRIEFING ---
  if (phase === "briefing") {
    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm fade-in" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 24, fontWeight: 800 }}>🎙️ Voice Call Simulation</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>Part 2 of your Dispatcher Evaluation</p>
            </div>
            <div className="card-body">
              <div style={{ padding: "1rem", background: "rgba(0,119,182,0.06)", borderRadius: "var(--radius)", border: "1px solid rgba(0,119,182,0.15)", marginBottom: "1.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--pool-blue-dark)", marginBottom: 8 }}>Your scenario:</div>
                <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6 }}>
                  An inbound call is coming in. The caller is <strong>Mike Rodriguez</strong>, a homeowner who thinks his pool has a leak. He found your number online. He's slightly price-sensitive but reasonable.
                </p>
                <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6, marginTop: 8 }}>
                  Handle the call as you would on the job. Use the script you've trained on. Your goal: qualify the lead, explain the service, and move toward booking.
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>You'll be evaluated on:</div>
                {[
                  "Proper greeting",
                  "Explaining what the test includes",
                  "Quoting the correct price ($375)",
                  "Mentioning the warranty",
                  "Collecting info via text / moving to booking",
                  "Mentioning prepayment policy",
                  "Overall tone and confidence",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "var(--gray-700)", padding: "4px 0" }}>
                    <span style={{ color: "var(--pool-blue)", fontWeight: 700 }}>✓</span> {item}
                  </div>
                ))}
              </div>

              <div style={{ padding: "10px 14px", background: "var(--amber-light)", borderRadius: "var(--radius)", marginBottom: "1.5rem", fontSize: 13, color: "var(--amber)" }}>
                ⚠️ Make sure your <strong>microphone is allowed</strong> in your browser before starting the call.
              </div>

              {error && (
                <div style={{ padding: "10px 14px", background: "var(--red-light)", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: 13, color: "var(--red)" }}>
                  {error}
                </div>
              )}

              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={initVapi}>
                📞 Answer the Call
              </button>

              <button
                onClick={goToResults}
                style={{ display: "block", width: "100%", textAlign: "center", marginTop: 12, background: "none", border: "none", color: "var(--gray-400)", fontSize: 13, cursor: "pointer" }}
              >
                Skip voice simulation → go to results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CALLING / ACTIVE / ENDED ---
  return (
    <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="container" style={{ width: "100%" }}>

        {/* Call header */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: phase === "active" ? "var(--green)" : phase === "calling" ? "var(--amber)" : "var(--gray-400)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>
                {phase === "calling" ? "⏳" : phase === "active" ? "📞" : "📵"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {phase === "calling" ? "Connecting..." : phase === "active" ? "Mike Rodriguez — On Call" : "Call Ended"}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>
                  {phase === "active" ? `Duration: ${formatTime(callDuration)}` : "Mr. Pool Leak Repair simulation"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {phase === "active" && (
                <>
                  <button className={`btn btn-sm ${isMuted ? "btn-danger" : "btn-outline"}`} onClick={handleMute}>
                    {isMuted ? "🔇 Muted" : "🎤 Mute"}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={endCall}>
                    End Call
                  </button>
                </>
              )}
              {phase === "evaluating" && (
                <div style={{ fontSize: 14, color: "var(--amber)", fontWeight: 600 }}>⏳ Evaluating transcript...</div>
              )}
              {phase === "ended" && evaluation && (
                <button className="btn btn-primary btn-sm" onClick={goToResults}>
                  View Full Results →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Call orb visual */}
        {(phase === "calling" || phase === "active") && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div className={`call-orb ${phase === "active" ? "active" : ""}`}>
              <span style={{ fontSize: 48 }}>📞</span>
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
            <div className="section-label">Live Transcript</div>
          </div>
          <div style={{ padding: "1rem 1.5rem", minHeight: 300, maxHeight: 400, overflowY: "auto" }}>
            {transcript.length === 0 ? (
              <div style={{ color: "var(--gray-400)", fontSize: 14, textAlign: "center", paddingTop: "2rem" }}>
                {phase === "calling" ? "Connecting to customer..." : "Transcript will appear here during the call."}
              </div>
            ) : (
              transcript.filter(t => t.text).map((t, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: t.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}>
                  <div style={{
                    maxWidth: "75%",
                    padding: "8px 12px",
                    borderRadius: t.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                    background: t.role === "user" ? "var(--pool-blue)" : "var(--gray-100)",
                    color: t.role === "user" ? "white" : "var(--gray-800)",
                    fontSize: 14,
                    opacity: t.final ? 1 : 0.6,
                    lineHeight: 1.5,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {t.role === "user" ? name : "Mike (Customer)"}
                    </div>
                    {t.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {/* Post-call quick score */}
        {phase === "ended" && evaluation && (
          <div className="card fade-in">
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 52, fontWeight: 800, fontFamily: "var(--font-condensed)",
                    color: evaluation.totalScore >= 85 ? "var(--green)" : evaluation.totalScore >= 65 ? "var(--amber)" : "var(--red)"
                  }}>
                    {evaluation.totalScore}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>/ 100</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Call Simulation Complete</div>
                  <div className={`badge ${evaluation.recommendation === "STRONG HIRE" ? "badge-green" : evaluation.recommendation === "CONSIDER" ? "badge-amber" : "badge-red"}`}>
                    {evaluation.recommendation}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 6 }}>{evaluation.summary}</div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={goToResults}>
                View Full Results & Coaching →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
