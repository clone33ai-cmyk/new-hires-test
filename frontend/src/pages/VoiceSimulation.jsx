import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

let vapiInstance = null;

export default function VoiceSimulation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("briefing");
  const [transcript, setTranscript] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);
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

  const initVapi = async () => {
    if (!VAPI_PUBLIC_KEY || VAPI_PUBLIC_KEY === "your_vapi_public_key_here") {
      setError("VITE_VAPI_PUBLIC_KEY is not set in your frontend/.env file.");
      return;
    }
    if (!VAPI_ASSISTANT_ID || VAPI_ASSISTANT_ID === "your_vapi_assistant_id_here") {
      setError("VITE_VAPI_ASSISTANT_ID is not set. Create your assistant at dashboard.vapi.ai and paste the ID in frontend/.env");
      return;
    }
    try {
      setPhase("calling");
      setError(null);
      const { default: Vapi } = await import("@vapi-ai/web");
      vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
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
            const last = prev[prev.length - 1];
            if (last && last.role === msg.role && !last.final) {
              return [...prev.slice(0, -1), { role: msg.role, text: msg.transcript, final: msg.transcriptType === "final" }];
            }
            return [...prev, { role: msg.role, text: msg.transcript, final: msg.transcriptType === "final" }];
          });
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
      setError("Failed to start: " + err.message);
      setPhase("briefing");
    }
  };

  const endCall = async () => {
    clearInterval(timerRef.current);
    if (vapiInstance) { try { vapiInstance.stop(); } catch(e) {} }
    setPhase("evaluating");
    setIsEvaluating(true);
    const transcriptText = transcript
      .filter(t => t.final && t.text?.trim())
      .map(t => `${t.role === "user" ? name + " (Dispatcher)" : "CUSTOMER (Mike)"}: ${t.text}`)
      .join("\n");
    if (!transcriptText) {
      sessionStorage.setItem("voiceEval", JSON.stringify({ totalScore: 0, recommendation: "NOT RECOMMENDED", summary: "No transcript captured.", rubricResults: [], coachingNotes: ["Ensure mic is enabled and call lasted at least 2 minutes."] }));
      setIsEvaluating(false);
      navigate("/results");
      return;
    }
    try {
      const res = await fetch("/api/evaluate/transcript", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript: transcriptText, role: "dispatcher" }) });
      const data = await res.json();
      setEvaluation(data);
      sessionStorage.setItem("voiceEval", JSON.stringify(data));
      sessionStorage.setItem("voiceTranscript", transcriptText);
    } catch (err) {
      sessionStorage.setItem("voiceEval", JSON.stringify({ totalScore: 50, recommendation: "CONSIDER", summary: "Evaluation error — manual review needed.", rubricResults: [], coachingNotes: [] }));
    } finally {
      setIsEvaluating(false);
      setPhase("ended");
    }
  };

  const handleMute = () => { if (vapiInstance) { vapiInstance.setMuted(!isMuted); setIsMuted(!isMuted); } };
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const goToResults = () => navigate("/results");

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
                <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6, margin: 0 }}>An inbound call is coming in. The AI will play <strong>Mike Rodriguez</strong>, a homeowner who suspects a pool leak. He's slightly skeptical about cost. Handle the call as you would on the job and move toward booking.</p>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>Graded on:</div>
                {["Proper greeting with your name", "Explaining what the test includes", "Quoting $375 correctly", "1–3 hour duration mentioned", "Customer doesn't need to be home", "Full report + repair estimate mentioned", "3-year warranty mentioned", "Collecting info via text / booking offer", "Prepayment policy + free cancellation", "Professional confident tone"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--gray-700)", padding: "3px 0" }}>
                    <span style={{ color: "var(--pool-blue)", fontWeight: 700 }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 14px", background: "var(--amber-light)", borderRadius: "var(--radius)", marginBottom: "1.5rem", fontSize: 13, color: "var(--amber)" }}>
                ⚠️ Allow microphone access when your browser asks. Speak clearly — the AI responds like a real customer.
              </div>
              {error && (
                <div style={{ padding: "12px 14px", background: "var(--red-light)", borderRadius: "var(--radius)", marginBottom: "1rem", fontSize: 13, color: "var(--red)", lineHeight: 1.6 }}>
                  <strong>Error:</strong> {error}
                </div>
              )}
              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={initVapi}>📞 Answer the Call</button>
              <button onClick={goToResults} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 12, background: "none", border: "none", color: "var(--gray-400)", fontSize: 13, cursor: "pointer" }}>
                Skip voice simulation → go to results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="container" style={{ width: "100%" }}>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", fontSize: 20, background: phase === "active" ? "var(--green)" : phase === "calling" ? "var(--amber)" : "var(--gray-400)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {phase === "calling" ? "⏳" : phase === "active" ? "📞" : "📵"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{phase === "calling" ? "Connecting to Mike..." : phase === "active" ? "Mike Rodriguez — Live Call" : phase === "evaluating" ? "Grading your call..." : "Call Complete"}</div>
                <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{phase === "active" ? `Duration: ${formatTime(callDuration)}` : "Mr. Pool Leak Repair · AI Simulation"}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {phase === "active" && (<><button className={`btn btn-sm ${isMuted ? "btn-danger" : "btn-outline"}`} onClick={handleMute}>{isMuted ? "🔇 Unmute" : "🎤 Mute"}</button><button className="btn btn-sm btn-danger" onClick={endCall}>End Call</button></>)}
              {isEvaluating && <div style={{ fontSize: 13, color: "var(--pool-blue)", fontWeight: 600 }}>⏳ Claude is grading...</div>}
              {phase === "ended" && !isEvaluating && <button className="btn btn-primary btn-sm" onClick={goToResults}>View Full Results →</button>}
            </div>
          </div>
        </div>

        {(phase === "calling" || phase === "active") && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div className={`call-orb ${phase === "active" ? "active" : ""}`} style={{ opacity: phase === "calling" ? 0.5 : 1 }}>
              <span style={{ fontSize: 48 }}>📞</span>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--gray-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="section-label" style={{ margin: 0 }}>Live Transcript</div>
            {phase === "active" && <div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", animation: "pulse-ring 1s ease-in-out infinite" }} /><span style={{ fontSize: 11, fontWeight: 600, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Live</span></div>}
          </div>
          <div style={{ padding: "1rem 1.5rem", minHeight: 280, maxHeight: 420, overflowY: "auto" }}>
            {transcript.filter(t => t.text?.trim()).length === 0 ? (
              <div style={{ color: "var(--gray-400)", fontSize: 14, textAlign: "center", paddingTop: "3rem" }}>{phase === "calling" ? "📡 Connecting — please wait..." : "Transcript appears here as you speak."}</div>
            ) : (
              transcript.filter(t => t.text?.trim()).map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: t.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                  <div style={{ maxWidth: "78%", padding: "8px 14px", borderRadius: t.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: t.role === "user" ? "var(--pool-blue)" : "var(--gray-100)", color: t.role === "user" ? "white" : "var(--gray-800)", fontSize: 14, lineHeight: 1.5, opacity: t.final ? 1 : 0.6 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.65, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.role === "user" ? `${name} (You)` : "Mike — Customer"}</div>
                    {t.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

        {phase === "ended" && evaluation && !isEvaluating && (
          <div className="card fade-in">
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 52, fontWeight: 800, fontFamily: "var(--font-condensed)", lineHeight: 1, color: evaluation.totalScore >= 85 ? "var(--green)" : evaluation.totalScore >= 65 ? "var(--amber)" : "var(--red)" }}>{evaluation.totalScore}</div>
                  <div style={{ fontSize: 12, color: "var(--gray-400)" }}>/ 100</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Call Simulation Graded</div>
                  <div className={`badge ${evaluation.recommendation === "STRONG HIRE" ? "badge-green" : evaluation.recommendation === "CONSIDER" ? "badge-amber" : "badge-red"}`}>{evaluation.recommendation}</div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 8, lineHeight: 1.5 }}>{evaluation.summary}</div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={goToResults}>View Full Results & Coaching →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
