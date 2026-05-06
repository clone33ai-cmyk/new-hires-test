import { useState } from "react";

const ZONES = [
  { id: "shell",      label: "Pool Shell",        path: "M 160,80 L 440,80 L 460,200 L 140,200 Z",                                cx: 300, cy: 140, rx: 130, ry: 50 },
  { id: "skimmer",   label: "Skimmer",             cx: 165, cy: 120, rx: 28, ry: 18 },
  { id: "light",     label: "Light Niche",         cx: 430, cy: 155, rx: 22, ry: 15 },
  { id: "equipment", label: "Equipment Pad",       cx: 300, cy: 290, rx: 90, ry: 28 },
  { id: "plumbing",  label: "Underground Plumbing",cx: 300, cy: 230, rx: 110, ry: 18 },
  { id: "drain",     label: "Main Drain",          cx: 300, cy: 175, rx: 18, ry: 12 },
];

export default function Hotspot({ challenge, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === challenge.correctZone;

  const getZoneColor = (id) => {
    if (!submitted) return selected === id ? "rgba(0,119,182,0.25)" : "rgba(0,119,182,0.06)";
    if (id === challenge.correctZone) return "rgba(22,163,74,0.25)";
    if (id === selected && !isCorrect) return "rgba(220,38,38,0.2)";
    return "rgba(0,119,182,0.04)";
  };

  const getZoneStroke = (id) => {
    if (!submitted) return selected === id ? "var(--pool-blue)" : "var(--gray-200)";
    if (id === challenge.correctZone) return "var(--green)";
    if (id === selected && !isCorrect) return "var(--red)";
    return "var(--gray-200)";
  };

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--gray-700)", marginBottom: "0.5rem", lineHeight: 1.6 }}>
        {challenge.scenario}
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--pool-blue-dark)", marginBottom: "1rem" }}>
        👆 Tap the area you would investigate first.
      </p>

      {/* Pool diagram */}
      <div style={{ background: "var(--off-white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-100)", padding: "1rem", marginBottom: "1rem" }}>
        <svg viewBox="0 0 600 350" style={{ width: "100%", maxHeight: 280 }}>
          {/* Water */}
          <ellipse cx="300" cy="148" rx="155" ry="75" fill="#CAF0F8" opacity="0.5" />

          {/* Pool shell outline */}
          <ellipse cx="300" cy="148" rx="155" ry="75"
            fill={getZoneColor("shell")} stroke={getZoneStroke("shell")} strokeWidth="2.5"
            style={{ cursor: submitted ? "default" : "pointer" }}
            onClick={() => !submitted && setSelected("shell")}
          />

          {/* Underground plumbing line */}
          <rect x="185" y="218" width="230" height="22" rx="6"
            fill={getZoneColor("plumbing")} stroke={getZoneStroke("plumbing")} strokeWidth="2"
            strokeDasharray="6 3"
            style={{ cursor: submitted ? "default" : "pointer" }}
            onClick={() => !submitted && setSelected("plumbing")}
          />
          <text x="300" y="233" textAnchor="middle" fontSize="10" fill="var(--gray-600)" style={{ pointerEvents: "none" }}>Underground Plumbing</text>

          {/* Equipment pad */}
          <rect x="210" y="258" width="180" height="52" rx="8"
            fill={getZoneColor("equipment")} stroke={getZoneStroke("equipment")} strokeWidth="2"
            style={{ cursor: submitted ? "default" : "pointer" }}
            onClick={() => !submitted && setSelected("equipment")}
          />
          <text x="300" y="280" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--gray-700)" style={{ pointerEvents: "none" }}>Equipment Pad</text>
          <text x="300" y="298" textAnchor="middle" fontSize="10" fill="var(--gray-500)" style={{ pointerEvents: "none" }}>pump · filter · valves</text>

          {/* Skimmer */}
          <ellipse cx="152" cy="120" rx="30" ry="20"
            fill={getZoneColor("skimmer")} stroke={getZoneStroke("skimmer")} strokeWidth="2"
            style={{ cursor: submitted ? "default" : "pointer" }}
            onClick={() => !submitted && setSelected("skimmer")}
          />
          <text x="152" y="155" textAnchor="middle" fontSize="10" fill="var(--gray-600)" style={{ pointerEvents: "none" }}>Skimmer</text>

          {/* Light niche */}
          <ellipse cx="445" cy="148" rx="24" ry="16"
            fill={getZoneColor("light")} stroke={getZoneStroke("light")} strokeWidth="2"
            style={{ cursor: submitted ? "default" : "pointer" }}
            onClick={() => !submitted && setSelected("light")}
          />
          <text x="445" y="175" textAnchor="middle" fontSize="10" fill="var(--gray-600)" style={{ pointerEvents: "none" }}>Light Niche</text>

          {/* Main drain */}
          <ellipse cx="300" cy="172" rx="20" ry="13"
            fill={getZoneColor("drain")} stroke={getZoneStroke("drain")} strokeWidth="2"
            style={{ cursor: submitted ? "default" : "pointer" }}
            onClick={() => !submitted && setSelected("drain")}
          />
          <text x="300" y="196" textAnchor="middle" fontSize="10" fill="var(--gray-600)" style={{ pointerEvents: "none" }}>Main Drain</text>

          {/* Pipe lines */}
          <line x1="182" y1="126" x2="210" y2="258" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="420" y1="152" x2="390" y2="258" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="300" y1="185" x2="300" y2="258" stroke="var(--gray-200)" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Selected indicator */}
          {selected && !submitted && (
            <text x="300" y="330" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--pool-blue)">
              Selected: {ZONES.find(z => z.id === selected)?.label}
            </text>
          )}

          {/* Result indicators */}
          {submitted && (
            <>
              <ellipse cx={ZONES.find(z => z.id === challenge.correctZone)?.cx}
                       cy={ZONES.find(z => z.id === challenge.correctZone)?.cy}
                       rx="16" ry="16" fill="var(--green)" opacity="0.9" />
              <text x={ZONES.find(z => z.id === challenge.correctZone)?.cx}
                    y={ZONES.find(z => z.id === challenge.correctZone)?.cy + 5}
                    textAnchor="middle" fontSize="14" fill="white" style={{ pointerEvents: "none" }}>✓</text>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1rem" }}>
        {ZONES.map(z => (
          <button key={z.id} disabled={submitted}
            onClick={() => !submitted && setSelected(z.id)}
            style={{
              padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500,
              border: `2px solid ${submitted
                ? z.id === challenge.correctZone ? "var(--green)" : selected === z.id ? "var(--red)" : "var(--gray-200)"
                : selected === z.id ? "var(--pool-blue)" : "var(--gray-200)"}`,
              background: submitted
                ? z.id === challenge.correctZone ? "var(--green-light)" : selected === z.id ? "var(--red-light)" : "var(--off-white)"
                : selected === z.id ? "rgba(0,119,182,0.08)" : "var(--off-white)",
              color: submitted
                ? z.id === challenge.correctZone ? "var(--green)" : selected === z.id ? "var(--red)" : "var(--gray-500)"
                : selected === z.id ? "var(--pool-blue-dark)" : "var(--gray-600)",
              cursor: submitted ? "default" : "pointer",
              fontFamily: "var(--font)",
            }}
          >
            {z.label}
          </button>
        ))}
      </div>

      {submitted && (
        <div className="explanation-box" style={{ marginBottom: "1.25rem" }}>
          {isCorrect ? "✓ Correct!" : `✗ The right answer was: ${ZONES.find(z => z.id === challenge.correctZone)?.label}.`}{" "}
          {challenge.explanation}
        </div>
      )}

      {!submitted ? (
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={() => setSubmitted(true)} disabled={!selected}>
          Submit Answer
        </button>
      ) : (
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={() => onComplete(isCorrect ? 100 : 0)}>
          Continue →
        </button>
      )}
    </div>
  );
}
