import { useState } from "react";

export default function BranchingScenario({ challenge, onComplete }) {
  const [history, setHistory] = useState([{ node: challenge.start, choice: null }]);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const current = history[history.length - 1].node;

  const handleChoice = (choice) => {
    const next = challenge.nodes[choice.next];
    const newHistory = [...history, { node: next, choice: choice.text }];
    setHistory(newHistory);

    if (next.terminal) {
      setFinalScore(next.score);
      setDone(true);
    }
  };

  const outcomeColor = finalScore >= 80 ? "var(--green)" : finalScore >= 50 ? "var(--amber)" : "var(--red)";
  const outcomeBg = finalScore >= 80 ? "var(--green-light)" : finalScore >= 50 ? "var(--amber-light)" : "var(--red-light)";
  const outcomeIcon = finalScore >= 80 ? "🎉" : finalScore >= 50 ? "😐" : "😬";

  return (
    <div>
      {/* Scenario header */}
      <div style={{ padding: "12px 16px", background: "rgba(0,119,182,0.06)", borderRadius: "var(--radius)", border: "1px solid rgba(0,119,182,0.15)", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--pool-blue)", marginBottom: 4 }}>
          Scenario
        </div>
        <p style={{ fontSize: 14, color: "var(--gray-700)", margin: 0, lineHeight: 1.6 }}>
          {challenge.setup}
        </p>
      </div>

      {/* Conversation history */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.25rem" }}>
        {history.map((h, i) => (
          <div key={i}>
            {/* Customer/situation bubble */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "var(--gray-200)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>
                {challenge.customerEmoji || "👤"}
              </div>
              <div style={{
                flex: 1, padding: "10px 14px",
                background: "var(--gray-50)", border: "1px solid var(--gray-100)",
                borderRadius: "12px 12px 12px 4px",
                fontSize: 14, color: "var(--gray-800)", lineHeight: 1.5,
              }}>
                {h.node.customerSays}
              </div>
            </div>

            {/* User's choice bubble */}
            {h.choice && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  maxWidth: "75%", padding: "10px 14px",
                  background: "var(--pool-blue)", borderRadius: "12px 12px 4px 12px",
                  fontSize: 14, color: "white", lineHeight: 1.5,
                }}>
                  {h.choice}
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: "var(--pool-blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>
                  🎧
                </div>
              </div>
            )}

            {/* Coach note mid-flow */}
            {h.node.coachNote && i < history.length - 1 && (
              <div style={{ margin: "8px 0", padding: "6px 12px", background: "var(--amber-light)", borderRadius: "var(--radius)", fontSize: 12, color: "var(--amber)", borderLeft: "3px solid var(--amber)" }}>
                💡 {h.node.coachNote}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Terminal outcome */}
      {done && (
        <div style={{ padding: "1rem", background: outcomeBg, borderRadius: "var(--radius-lg)", marginBottom: "1.25rem", border: `2px solid ${outcomeColor}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>{outcomeIcon}</span>
            <div>
              <div style={{ fontFamily: "var(--font-condensed)", fontSize: 20, fontWeight: 800, color: outcomeColor }}>
                {current.outcome}
              </div>
              <div style={{ fontSize: 13, color: outcomeColor, opacity: 0.8 }}>
                Score: {finalScore}/100
              </div>
            </div>
          </div>
          {current.coachNote && (
            <p style={{ fontSize: 13, color: "var(--gray-700)", margin: 0, lineHeight: 1.6 }}>
              💡 {current.coachNote}
            </p>
          )}
        </div>
      )}

      {/* Choices */}
      {!done && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
            How do you respond?
          </div>
          {current.choices?.map((choice, i) => (
            <button key={i} className="option-btn" onClick={() => handleChoice(choice)}
              style={{ textAlign: "left" }}>
              <span style={{ fontWeight: 600, color: "var(--pool-blue)", marginRight: 8 }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {done && (
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={() => onComplete(finalScore)}>
          Continue →
        </button>
      )}
    </div>
  );
}
