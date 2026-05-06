import { useState } from "react";

export default function SymptomDiagnosis({ challenge, onComplete }) {
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const current = challenge.steps[step];

  const handleChoice = (choice) => {
    const newHistory = [...history, { step: current, choice }];
    setHistory(newHistory);
    const newScore = score + (choice.points || 0);
    setScore(newScore);

    if (choice.terminal || step + 1 >= challenge.steps.length) {
      setDone(true);
      setScore(newScore);
    } else {
      const nextIdx = choice.nextStep !== undefined ? choice.nextStep : step + 1;
      setStep(nextIdx);
    }
  };

  const maxScore = challenge.steps.reduce((s, st) => {
    const best = Math.max(...(st.choices?.map(c => c.points || 0) || [0]));
    return s + best;
  }, 0);

  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div>
      {/* Customer complaint */}
      <div style={{ padding: "12px 16px", background: "rgba(0,119,182,0.06)", borderRadius: "var(--radius)", border: "1px solid rgba(0,119,182,0.15)", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--pool-blue)", marginBottom: 4 }}>
          {challenge.roleLabel || "Customer complaint"}
        </div>
        <p style={{ fontSize: 14, color: "var(--gray-700)", margin: 0, lineHeight: 1.6 }}>{challenge.situation}</p>
      </div>

      {/* Progress trail */}
      {history.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gray-400)", marginBottom: 8 }}>
            Your diagnostic path
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: h.choice.points > 0 ? "var(--green)" : "var(--red)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{h.step.question}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: h.choice.points > 0 ? "var(--green)" : "var(--red)" }}>
                    → {h.choice.text}
                    {h.choice.points > 0 && <span style={{ marginLeft: 6, fontSize: 11, color: "var(--green)" }}>+{h.choice.points}pts</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!done && current && (
        <>
          {/* Current step */}
          <div style={{ padding: "12px 16px", background: "var(--gray-50)", borderRadius: "var(--radius)", marginBottom: "1rem", borderLeft: "3px solid var(--pool-blue)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pool-blue)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              Step {step + 1} of {challenge.steps.length}
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, color: "var(--gray-800)", margin: 0, lineHeight: 1.5 }}>
              {current.question}
            </p>
            {current.hint && (
              <p style={{ fontSize: 12, color: "var(--gray-500)", margin: "6px 0 0", fontStyle: "italic" }}>
                💡 {current.hint}
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {current.choices.map((choice, i) => (
              <button key={i} className="option-btn" onClick={() => handleChoice(choice)}>
                <span style={{ fontWeight: 600, color: "var(--pool-blue)", marginRight: 8 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {choice.text}
              </button>
            ))}
          </div>
        </>
      )}

      {done && (
        <>
          <div style={{
            padding: "1rem", borderRadius: "var(--radius-lg)", marginBottom: "1rem",
            background: pct >= 80 ? "var(--green-light)" : pct >= 60 ? "var(--amber-light)" : "var(--red-light)",
            border: `2px solid ${pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)"}`,
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "var(--font-condensed)", fontSize: 36, fontWeight: 800, color: pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)" }}>
              {pct}%
            </div>
            <div style={{ fontSize: 14, color: "var(--gray-700)" }}>
              {score} / {maxScore} points · {pct >= 80 ? "Excellent diagnostic thinking!" : pct >= 60 ? "Good, but review the steps" : "Needs more practice"}
            </div>
          </div>
          <div className="explanation-box" style={{ marginBottom: "1rem" }}>{challenge.debrief}</div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete(pct)}>
            Continue →
          </button>
        </>
      )}
    </div>
  );
}
