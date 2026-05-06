import { useState } from "react";

export default function TextThread({ challenge, onComplete }) {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState([]);
  const [done, setDone] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const current = challenge.steps[step];

  const handleChoice = (choice) => {
    const newChosen = [...chosen, { step, choice }];
    setChosen(newChosen);
    const newScore = totalScore + (choice.points || 0);
    setTotalScore(newScore);

    if (step + 1 >= challenge.steps.length) {
      setDone(true);
      setTotalScore(newScore);
    } else {
      setStep(step + 1);
    }
  };

  const maxScore = challenge.steps.reduce((s, st) => {
    const best = Math.max(...(st.choices?.map(c => c.points || 0) || [0]));
    return s + best;
  }, 0);

  const pct = Math.round((totalScore / maxScore) * 100);

  return (
    <div>
      {/* Context */}
      <div style={{ padding: "10px 14px", background: "rgba(0,119,182,0.06)", borderRadius: "var(--radius)", border: "1px solid rgba(0,119,182,0.12)", marginBottom: "1rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--pool-blue)", marginBottom: 4 }}>Context</div>
        <p style={{ fontSize: 13, color: "var(--gray-700)", margin: 0, lineHeight: 1.5 }}>{challenge.context}</p>
      </div>

      {/* Phone frame */}
      <div style={{ background: "var(--gray-900)", borderRadius: 24, padding: "12px 8px", marginBottom: "1rem", maxWidth: 380, margin: "0 auto 1rem" }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px 8px", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          <span>9:41 AM</span>
          <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{challenge.contactName}</span>
          <span>●●●</span>
        </div>

        {/* Messages */}
        <div style={{ background: "var(--white)", borderRadius: 16, padding: "12px", minHeight: 200, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Show all previous steps' messages and choices */}
          {challenge.steps.slice(0, step + 1).map((s, i) => (
            <div key={i}>
              {/* Customer message */}
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
                <div style={{
                  maxWidth: "75%", padding: "8px 12px", fontSize: 13, lineHeight: 1.4,
                  background: "var(--gray-100)", borderRadius: "16px 16px 16px 4px",
                  color: "var(--gray-800)",
                }}>
                  {s.customerMessage}
                </div>
              </div>

              {/* Chosen reply (if answered) */}
              {chosen[i] && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{
                    maxWidth: "75%", padding: "8px 12px", fontSize: 13, lineHeight: 1.4,
                    background: "var(--pool-blue)", borderRadius: "16px 16px 4px 16px",
                    color: "white",
                  }}>
                    {chosen[i].choice.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {done && challenge.closingMessage && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                maxWidth: "75%", padding: "8px 12px", fontSize: 13, lineHeight: 1.4,
                background: "var(--gray-100)", borderRadius: "16px 16px 16px 4px",
                color: "var(--gray-800)",
              }}>
                {challenge.closingMessage}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply options */}
      {!done && current && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Choose your reply:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {current.choices.map((choice, i) => (
              <button key={i} className="option-btn" onClick={() => handleChoice(choice)}
                style={{ fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: "var(--pool-blue)", marginRight: 8 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {done && (
        <>
          <div style={{
            padding: "1rem", borderRadius: "var(--radius-lg)", marginBottom: "1rem",
            background: pct >= 80 ? "var(--green-light)" : pct >= 60 ? "var(--amber-light)" : "var(--red-light)",
            border: `2px solid ${pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)"}`,
          }}>
            <div style={{ fontFamily: "var(--font-condensed)", fontSize: 22, fontWeight: 800, color: pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)", marginBottom: 4 }}>
              {pct >= 80 ? "Great follow-up! 🎉" : pct >= 60 ? "Decent, but could be stronger 🤔" : "Needs improvement ❌"}
            </div>
            <div style={{ fontSize: 13, color: "var(--gray-700)" }}>
              Score: {totalScore} / {maxScore} points ({pct}%)
            </div>
          </div>

          <div className="explanation-box" style={{ marginBottom: "1rem" }}>
            {challenge.debrief}
          </div>

          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete(pct)}>
            Continue →
          </button>
        </>
      )}
    </div>
  );
}
