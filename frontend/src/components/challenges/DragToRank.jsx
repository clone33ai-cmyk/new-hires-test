import { useState, useRef } from "react";

export default function DragToRank({ challenge, onComplete }) {
  const [items, setItems] = useState(() =>
    [...challenge.items].sort(() => Math.random() - 0.5).map((text, i) => ({ id: i, text }))
  );
  const [dragIdx, setDragIdx] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const dragOver = useRef(null);

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragEnter = (idx) => { dragOver.current = idx; };

  const handleDragEnd = () => {
    if (dragIdx === null || dragOver.current === null || dragIdx === dragOver.current) {
      setDragIdx(null); dragOver.current = null; return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(dragOver.current, 0, moved);
    setItems(next);
    setDragIdx(null);
    dragOver.current = null;
  };

  // Touch support
  const touchStart = useRef(null);
  const handleTouchStart = (idx, e) => {
    touchStart.current = idx;
    setDragIdx(idx);
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemEl = el?.closest("[data-rank-idx]");
    if (itemEl) dragOver.current = parseInt(itemEl.dataset.rankIdx);
  };
  const handleTouchEnd = () => handleDragEnd();

  const handleSubmit = () => {
    const userOrder = items.map(i => i.text);
    const correct = challenge.correctOrder.every((text, i) => userOrder[i] === text);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const correctIndices = submitted
    ? items.map(item => challenge.correctOrder.indexOf(item.text))
    : [];

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--gray-700)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
        {challenge.instruction}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.25rem" }}>
        {items.map((item, idx) => {
          let bg = "var(--white)";
          let border = "2px solid var(--gray-200)";
          let color = "var(--gray-800)";
          if (submitted) {
            if (correctIndices[idx] === idx) {
              bg = "var(--green-light)"; border = "2px solid var(--green)"; color = "var(--green)";
            } else {
              bg = "var(--red-light)"; border = "2px solid var(--red)"; color = "var(--red)";
            }
          } else if (dragIdx === idx) {
            bg = "rgba(0,119,182,0.08)"; border = "2px dashed var(--pool-blue)";
          }

          return (
            <div
              key={item.id}
              data-rank-idx={idx}
              draggable={!submitted}
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onTouchStart={(e) => handleTouchStart(idx, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", background: bg, border, borderRadius: "var(--radius)",
                cursor: submitted ? "default" : "grab", color,
                transition: "all 0.15s ease", userSelect: "none",
              }}
            >
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 28, height: 28, borderRadius: "50%",
                background: submitted
                  ? (correctIndices[idx] === idx ? "var(--green)" : "var(--red)")
                  : "var(--gray-200)",
                color: submitted ? "white" : "var(--gray-500)",
                fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>
                {submitted
                  ? (correctIndices[idx] === idx ? "✓" : correctIndices[idx] + 1)
                  : idx + 1}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{item.text}</span>
              {!submitted && (
                <span style={{ fontSize: 18, color: "var(--gray-300)" }}>⠿</span>
              )}
            </div>
          );
        })}
      </div>

      {submitted && !isCorrect && (
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 8 }}>Correct order:</div>
          {challenge.correctOrder.map((text, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 12px", background: "var(--green-light)", borderRadius: "var(--radius)", marginBottom: 6, fontSize: 13, color: "var(--green)" }}>
              <span style={{ fontWeight: 700, minWidth: 20 }}>{i + 1}.</span> {text}
            </div>
          ))}
        </div>
      )}

      {submitted && (
        <div className="explanation-box" style={{ marginBottom: "1.25rem" }}>
          {isCorrect ? "✓ Perfect order!" : "✗ Not quite."} {challenge.explanation}
        </div>
      )}

      {!submitted ? (
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleSubmit}>
          Submit Order
        </button>
      ) : (
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete(isCorrect ? 100 : 40)}>
          Continue →
        </button>
      )}
    </div>
  );
}
