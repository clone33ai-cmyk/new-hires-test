import { useState } from "react";

export default function PreVisitChecklist({ challenge, onComplete }) {
  const [checked, setChecked] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => {
    if (submitted) return;
    const next = new Set(checked);
    next.has(id) ? next.delete(id) : next.add(id);
    setChecked(next);
  };

  const required = new Set(challenge.items.filter(i => i.required).map(i => i.id));
  const missedRequired = [...required].filter(id => !checked.has(id));
  const checkedRequired = [...required].filter(id => checked.has(id));
  const extraChecked = [...checked].filter(id => !required.has(id) && !challenge.items.find(i => i.id === id)?.optional);

  const score = Math.max(0, Math.round(
    (checkedRequired.length / required.size) * 100 - extraChecked.length * 10
  ));

  const categories = [...new Set(challenge.items.map(i => i.category))];

  return (
    <div>
      <div style={{ padding: "12px 16px", background: "rgba(0,119,182,0.06)", borderRadius: "var(--radius)", border: "1px solid rgba(0,119,182,0.15)", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--pool-blue)", marginBottom: 4 }}>Scenario</div>
        <p style={{ fontSize: 14, color: "var(--gray-700)", margin: 0, lineHeight: 1.6 }}>{challenge.scenario}</p>
      </div>

      <p style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: "1rem" }}>
        Check off everything you need to bring. Don't miss anything critical!
      </p>

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gray-400)", marginBottom: 8 }}>
            {cat}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {challenge.items.filter(i => i.category === cat).map(item => {
              const isChecked = checked.has(item.id);
              const isRequired = item.required;
              const isOptional = item.optional;
              const isTrap = !isRequired && !isOptional;

              let borderColor = isChecked ? "var(--pool-blue)" : "var(--gray-200)";
              let bg = isChecked ? "rgba(0,119,182,0.06)" : "var(--off-white)";

              if (submitted) {
                if (isRequired && isChecked) { bg = "var(--green-light)"; borderColor = "var(--green)"; }
                else if (isRequired && !isChecked) { bg = "var(--red-light)"; borderColor = "var(--red)"; }
                else if (isTrap && isChecked) { bg = "var(--amber-light)"; borderColor = "var(--amber)"; }
                else { bg = "var(--off-white)"; borderColor = "var(--gray-200)"; }
              }

              return (
                <div key={item.id} onClick={() => toggle(item.id)} style={{
                  display: "flex", gap: 12, alignItems: "center",
                  padding: "10px 14px", background: bg,
                  border: `2px solid ${borderColor}`, borderRadius: "var(--radius)",
                  cursor: submitted ? "default" : "pointer", transition: "all 0.15s",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${isChecked ? "var(--pool-blue)" : "var(--gray-300)"}`,
                    background: isChecked ? "var(--pool-blue)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isChecked && <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-800)" }}>{item.name}</div>
                    {item.note && <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{item.note}</div>}
                  </div>
                  {!submitted && isRequired && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.06em", flexShrink: 0 }}>Required</span>
                  )}
                  {submitted && (
                    <span style={{ fontSize: 16, flexShrink: 0 }}>
                      {isRequired && isChecked ? "✅" : isRequired && !isChecked ? "❌" : isTrap && isChecked ? "⚠️" : ""}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Progress indicator */}
      {!submitted && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--gray-50)", borderRadius: "var(--radius)", marginBottom: "1rem" }}>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${(checked.size / challenge.items.length) * 100}%` }} />
          </div>
          <span style={{ fontSize: 13, color: "var(--gray-500)", flexShrink: 0 }}>
            {checked.size} / {challenge.items.length} items
          </span>
        </div>
      )}

      {submitted && (
        <>
          <div className="explanation-box" style={{ marginBottom: "1rem" }}>
            {missedRequired.length === 0
              ? "✓ You packed everything required!"
              : `✗ You missed: ${missedRequired.map(id => challenge.items.find(i => i.id === id)?.name).join(", ")}. `}
            {extraChecked.length > 0 && `You included unnecessary items: ${extraChecked.map(id => challenge.items.find(i => i.id === id)?.name).join(", ")}. `}
            {challenge.explanation}
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete(score)}>
            Continue →
          </button>
        </>
      )}

      {!submitted && (
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={() => setSubmitted(true)} disabled={checked.size === 0}>
          I'm Ready — Submit Checklist
        </button>
      )}
    </div>
  );
}
