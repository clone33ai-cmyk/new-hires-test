import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Intro() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isDispatcher = role === "dispatcher";

  const handleStart = () => {
    if (!name.trim() || !agreed) return;
    sessionStorage.setItem("evalName", name.trim());
    sessionStorage.setItem("evalRole", role);
    navigate(`/quiz/${role}`);
  };

  return (
    <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="container-sm fade-in" style={{ width: "100%" }}>

        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{isDispatcher ? "📞" : "🔧"}</span>
              <div>
                <div style={{ fontFamily: "var(--font-condensed)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>
                  Mr. Pool Leak Repair
                </div>
                <h1 style={{ fontFamily: "var(--font-condensed)", fontSize: 24, fontWeight: 800 }}>
                  {isDispatcher ? "Dispatcher" : "Technician"} Evaluation
                </h1>
              </div>
            </div>
          </div>

          <div className="card-body">
            {/* What to expect */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="section-label">What to expect</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "📚", text: "30 questions covering company knowledge, your role, and real-world scenarios" },
                  isDispatcher
                    ? { icon: "🎙️", text: "A live voice call simulation — you'll speak with an AI customer and be graded on your script" }
                    : { icon: "🔍", text: "Field scenario questions testing your detection and repair decision-making" },
                  { icon: "📊", text: "A full results breakdown with coaching notes and a hire recommendation" },
                  { icon: "⏱️", text: "Estimated time: 25–35 minutes. Take your time — read each question carefully." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: "var(--off-white)", borderRadius: "var(--radius)", fontSize: 14, color: "var(--gray-700)" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "var(--gray-700)", marginBottom: 6 }}>
                Your full name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                autoFocus
              />
            </div>

            {/* Agreement */}
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: "1.5rem" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 3, width: "auto", accentColor: "var(--pool-blue)" }}
              />
              <span style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.5 }}>
                I understand this is a knowledge assessment. I'll answer questions independently and to the best of my ability.
              </span>
            </label>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              onClick={handleStart}
              disabled={!name.trim() || !agreed}
            >
              Start Assessment →
            </button>

            <button
              onClick={() => navigate("/")}
              style={{ display: "block", width: "100%", textAlign: "center", marginTop: 12, background: "none", border: "none", color: "var(--gray-400)", fontSize: 13, cursor: "pointer" }}
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
