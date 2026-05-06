import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) navigate(`/intro/${selected}`);
  };

  return (
    <div className="water-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="container-sm fade-in" style={{ width: "100%" }}>

        {/* Logo / Brand */}
        <div className="text-center mb-4">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--pool-blue), var(--pool-cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24
            }}>💧</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-condensed)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pool-cyan)", marginBottom: 2 }}>
                Mr. Pool Leak Repair
              </div>
              <div style={{ fontFamily: "var(--font-condensed)", fontSize: 22, fontWeight: 800, color: "var(--white)", lineHeight: 1 }}>
                New Hire Evaluation
              </div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 4 }}>
            This assessment covers company knowledge, role-specific skills, and real-world scenarios.
          </p>
        </div>

        {/* Role selection card */}
        <div className="card">
          <div className="card-header text-center">
            <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 22, fontWeight: 700, letterSpacing: "0.03em" }}>
              Select Your Role
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>
              Choose the position you're being evaluated for
            </p>
          </div>

          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {/* Dispatcher Card */}
              <button
                onClick={() => setSelected("dispatcher")}
                style={{
                  background: selected === "dispatcher" ? "rgba(0,119,182,0.08)" : "var(--off-white)",
                  border: `2px solid ${selected === "dispatcher" ? "var(--pool-blue)" : "var(--gray-100)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem 1rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  fontFamily: "var(--font)",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>📞</div>
                <div style={{ fontFamily: "var(--font-condensed)", fontSize: 20, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>
                  Dispatcher
                </div>
                <div style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.5 }}>
                  Customer calls, scheduling, follow-up, and sales
                </div>
                {selected === "dispatcher" && (
                  <div className="badge badge-blue" style={{ marginTop: 10 }}>✓ Selected</div>
                )}
              </button>

              {/* Technician Card */}
              <button
                onClick={() => setSelected("technician")}
                style={{
                  background: selected === "technician" ? "rgba(0,119,182,0.08)" : "var(--off-white)",
                  border: `2px solid ${selected === "technician" ? "var(--pool-blue)" : "var(--gray-100)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem 1rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.15s ease",
                  fontFamily: "var(--font)",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔧</div>
                <div style={{ fontFamily: "var(--font-condensed)", fontSize: 20, fontWeight: 700, color: "var(--gray-900)", marginBottom: 6 }}>
                  Technician
                </div>
                <div style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.5 }}>
                  Leak detection, repairs, documentation, and field work
                </div>
                {selected === "technician" && (
                  <div className="badge badge-blue" style={{ marginTop: 10 }}>✓ Selected</div>
                )}
              </button>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              onClick={handleContinue}
              disabled={!selected}
            >
              Begin Evaluation →
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: "var(--gray-400)", marginTop: "1rem" }}>
              30 questions · Approx. 15-20 minutes · Results shown at the end
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: "1.5rem" }}>
          © Mr. Pool Leak Repair · Confidential Internal Assessment
        </p>
      </div>
    </div>
  );
}
