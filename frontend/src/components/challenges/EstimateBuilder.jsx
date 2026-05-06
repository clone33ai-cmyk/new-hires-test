import { useState } from "react";

export default function EstimateBuilder({ challenge, onComplete }) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => {
    if (submitted) return;
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const total = challenge.lineItems
    .filter(item => selected.has(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const correctIds = new Set(challenge.correctItems);
  const selectedArr = [...selected];
  const missed = [...correctIds].filter(id => !selected.has(id));
  const extra = selectedArr.filter(id => !correctIds.has(id));
  const hits = selectedArr.filter(id => correctIds.has(id));

  const score = submitted
    ? Math.max(0, Math.round((hits.length / correctIds.size) * 100 - extra.length * 15))
    : 0;

  const correctTotal = challenge.lineItems
    .filter(i => correctIds.has(i.id))
    .reduce((s, i) => s + i.price, 0);

  return (
    <div>
      {/* Job scenario */}
      <div style={{ padding: "12px 16px", background: "rgba(0,119,182,0.06)", borderRadius: "var(--radius)", border: "1px solid rgba(0,119,182,0.15)", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--pool-blue)", marginBottom: 4 }}>Job scenario</div>
        <p style={{ fontSize: 14, color: "var(--gray-700)", margin: 0, lineHeight: 1.6 }}>{challenge.scenario}</p>
      </div>

      <p style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: "1rem" }}>
        Select all repairs that apply to this job and build the estimate:
      </p>

      {/* Line items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem" }}>
        {challenge.lineItems.map(item => {
          const isSelected = selected.has(item.id);
          const isCorrect = correctIds.has(item.id);
          let bg = isSelected ? "rgba(0,119,182,0.08)" : "var(--off-white)";
          let border = isSelected ? "2px solid var(--pool-blue)" : "2px solid var(--gray-100)";
          if (submitted) {
            if (isCorrect && isSelected) { bg = "var(--green-light)"; border = "2px solid var(--green)"; }
            else if (isCorrect && !isSelected) { bg = "var(--amber-light)"; border = "2px solid var(--amber)"; }
            else if (!isCorrect && isSelected) { bg = "var(--red-light)"; border = "2px solid var(--red)"; }
            else { bg = "var(--off-white)"; border = "2px solid var(--gray-100)"; }
          }

          return (
            <div key={item.id} onClick={() => toggle(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              background: bg, border, borderRadius: "var(--radius)",
              cursor: submitted ? "default" : "pointer", transition: "all 0.15s",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                border: `2px solid ${isSelected ? "var(--pool-blue)" : "var(--gray-300)"}`,
                background: isSelected ? "var(--pool-blue)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {isSelected && <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-800)" }}>{item.name}</div>
                {item.note && <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{item.note}</div>}
              </div>
              <div style={{ fontFamily: "var(--font-condensed)", fontSize: 16, fontWeight: 700, color: "var(--gray-700)", flexShrink: 0 }}>
                ${item.price.toLocaleString()}
              </div>
              {submitted && (
                <span style={{ fontSize: 16, flexShrink: 0 }}>
                  {isCorrect && isSelected ? "✅" : isCorrect && !isSelected ? "⚠️" : !isCorrect && isSelected ? "❌" : ""}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Running total */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 16px", background: "var(--gray-900)", borderRadius: "var(--radius)",
        marginBottom: "1.25rem",
      }}>
        <span style={{ fontFamily: "var(--font-condensed)", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Estimate Total
        </span>
        <span style={{ fontFamily: "var(--font-condensed)", fontSize: 24, fontWeight: 800, color: "var(--pool-cyan)" }}>
          ${total.toLocaleString()}
        </span>
      </div>

      {submitted && (
        <>
          <div className="explanation-box" style={{ marginBottom: "1rem" }}>
            <strong>Correct total: ${correctTotal.toLocaleString()}</strong> — Score: {score}/100.{" "}
            {missed.length > 0 && `You missed: ${missed.map(id => challenge.lineItems.find(i => i.id === id)?.name).join(", ")}. `}
            {extra.length > 0 && `You shouldn't have included: ${extra.map(id => challenge.lineItems.find(i => i.id === id)?.name).join(", ")}. `}
            {challenge.explanation}
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete(score)}>
            Continue →
          </button>
        </>
      )}

      {!submitted && (
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={() => setSubmitted(true)} disabled={selected.size === 0}>
          Submit Estimate
        </button>
      )}
    </div>
  );
}
