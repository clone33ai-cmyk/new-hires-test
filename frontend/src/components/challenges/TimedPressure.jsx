import { useState, useEffect, useRef } from "react";

export default function TimedPressure({ challenge, onComplete }) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(challenge.timeSeconds || 60);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !done) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); finishRound(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, done]);

  const finishRound = () => {
    setDone(true);
    clearInterval(timerRef.current);
  };

  const handleAnswer = (optIdx) => {
    if (done || selected !== null) return;
    setSelected(optIdx);
    const q = challenge.questions[currentQ];
    const isCorrect = optIdx === q.correct;
    const newAnswers = [...answers, { question: q.question, isCorrect, given: q.options[optIdx], correct: q.options[q.correct] }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelected(null);
      if (currentQ + 1 >= challenge.questions.length) {
        finishRound();
      } else {
        setCurrentQ(currentQ + 1);
      }
    }, 600);
  };

  const correct = answers.filter(a => a.isCorrect).length;
  const pct = answers.length > 0 ? Math.round((correct / challenge.questions.length) * 100) : 0;

  const timerColor = timeLeft > 20 ? "var(--green)" : timeLeft > 10 ? "var(--amber)" : "var(--red)";
  const timerBg = timeLeft > 20 ? "var(--green-light)" : timeLeft > 10 ? "var(--amber-light)" : "var(--red-light)";

  if (!started) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: "1rem" }}>⚡</div>
        <h3 style={{ fontFamily: "var(--font-condensed)", fontSize: 28, fontWeight: 800, color: "var(--gray-900)", marginBottom: 8 }}>
          Rapid Fire Round
        </h3>
        <p style={{ fontSize: 15, color: "var(--gray-600)", marginBottom: "0.5rem" }}>
          {challenge.questions.length} questions · {challenge.timeSeconds} seconds
        </p>
        <p style={{ fontSize: 14, color: "var(--gray-500)", marginBottom: "2rem", lineHeight: 1.6 }}>
          Answer as many as you can before the clock runs out. Click fast — hesitation costs you!
        </p>
        <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => setStarted(true)}>
          Start the Clock ⚡
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--font-condensed)", fontSize: 56, fontWeight: 800, color: pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)" }}>
            {correct}/{challenge.questions.length}
          </div>
          <div style={{ fontSize: 15, color: "var(--gray-500)" }}>
            {pct}% · {timeLeft > 0 ? `${timeLeft}s remaining` : "Time's up!"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
          {answers.map((a, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px",
              background: a.isCorrect ? "var(--green-light)" : "var(--red-light)",
              borderRadius: "var(--radius)", fontSize: 13,
            }}>
              <span style={{ flexShrink: 0 }}>{a.isCorrect ? "✅" : "❌"}</span>
              <div>
                <div style={{ fontWeight: 500, color: "var(--gray-800)", marginBottom: 2 }}>{a.question}</div>
                {!a.isCorrect && (
                  <div style={{ color: "var(--green)", fontSize: 12 }}>Correct: {a.correct}</div>
                )}
              </div>
            </div>
          ))}
          {/* Unanswered questions */}
          {challenge.questions.slice(answers.length).map((q, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "center", padding: "8px 12px",
              background: "var(--gray-50)", borderRadius: "var(--radius)", fontSize: 13, color: "var(--gray-500)",
            }}>
              <span>⏱️</span>
              <div>
                <div style={{ fontWeight: 500 }}>{q.question}</div>
                <div style={{ color: "var(--green)", fontSize: 12 }}>Answer: {q.options[q.correct]}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => onComplete(pct)}>
          Continue →
        </button>
      </div>
    );
  }

  const q = challenge.questions[currentQ];
  const progressPct = (currentQ / challenge.questions.length) * 100;

  return (
    <div>
      {/* Timer + progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
          background: timerBg, borderRadius: 99, border: `2px solid ${timerColor}`,
          fontFamily: "var(--font-condensed)", fontSize: 22, fontWeight: 800, color: timerColor,
          minWidth: 80, justifyContent: "center",
          animation: timeLeft <= 5 ? "pulse 0.5s ease-in-out infinite" : "none",
        }}>
          ⏱ {timeLeft}s
        </div>
        <div style={{ flex: 1 }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 4 }}>
            Question {currentQ + 1} of {challenge.questions.length} · {correct} correct
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>

      {/* Question */}
      <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--gray-900)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
        {q.question}
      </h3>

      {/* Fast-tap options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {q.options.map((opt, idx) => {
          let bg = "var(--off-white)";
          let border = "2px solid var(--gray-100)";
          if (selected === idx) {
            bg = idx === q.correct ? "var(--green-light)" : "var(--red-light)";
            border = `2px solid ${idx === q.correct ? "var(--green)" : "var(--red)"}`;
          }
          return (
            <button key={idx} onClick={() => handleAnswer(idx)} style={{
              padding: "14px 12px", background: bg, border, borderRadius: "var(--radius)",
              fontSize: 14, fontWeight: 500, color: "var(--gray-800)",
              cursor: "pointer", textAlign: "center", fontFamily: "var(--font)",
              transition: "all 0.1s ease", lineHeight: 1.3,
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
