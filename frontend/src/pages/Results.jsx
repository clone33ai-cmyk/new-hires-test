import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ScoreRing({ score, size = 100 }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? "var(--green)" : score >= 65 ? "var(--amber)" : "var(--red)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--gray-100)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={circ - fill} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-condensed)", fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 10, color: "var(--gray-400)" }}>/ 100</span>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizEval, setQuizEval] = useState(null);
  const [voiceEval, setVoiceEval] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);

  const name = sessionStorage.getItem("evalName") || "Candidate";
  const role = sessionStorage.getItem("evalRole") || "dispatcher";
  const isDispatcher = role === "dispatcher";

  useEffect(() => {
    const answers = JSON.parse(sessionStorage.getItem("quizAnswers") || "[]");
    const voice = JSON.parse(sessionStorage.getItem("voiceEval") || "null");
    setQuizAnswers(answers);
    setVoiceEval(voice);

    // Compute quiz results locally
    if (answers.length > 0) {
      const sections = {};
      answers.forEach(a => {
        if (!sections[a.section]) sections[a.section] = { correct: 0, total: 0 };
        sections[a.section].total++;
        if (a.isCorrect) sections[a.section].correct++;
      });

      const totalCorrect = answers.filter(a => a.isCorrect).length;
      const pct = Math.round((totalCorrect / answers.length) * 100);
      const missed = answers.filter(a => !a.isCorrect).map(a => a.section);
      const missedTopics = [...new Set(missed)];

      setQuizEval({ sectionScores: sections, totalCorrect, totalQuestions: answers.length, percentage: pct, missedTopics });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 16 }}>Loading results...</div>
      </div>
    );
  }

  // Combined score
  const quizScore = quizEval?.percentage || 0;
  const voiceScore = voiceEval?.totalScore || null;
  const combinedScore = voiceScore !== null
    ? Math.round(quizScore * 0.6 + voiceScore * 0.4)
    : quizScore;

  const recommendation = combinedScore >= 85 ? "STRONG HIRE" : combinedScore >= 65 ? "CONSIDER" : "NOT RECOMMENDED";
  const recColor = recommendation === "STRONG HIRE" ? "var(--green)" : recommendation === "CONSIDER" ? "var(--amber)" : "var(--red)";
  const recBg = recommendation === "STRONG HIRE" ? "var(--green-light)" : recommendation === "CONSIDER" ? "var(--amber-light)" : "var(--red-light)";
  const recIcon = recommendation === "STRONG HIRE" ? "🎉" : recommendation === "CONSIDER" ? "🤔" : "❌";

  const handlePrint = () => window.print();

  const handleRestart = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="container" style={{ width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--font-condensed)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--pool-cyan)", marginBottom: 4 }}>
            Evaluation Complete
          </div>
          <h1 style={{ fontFamily: "var(--font-condensed)", fontSize: 32, fontWeight: 800, color: "white" }}>
            {name}'s Results
          </h1>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
            {isDispatcher ? "Dispatcher" : "Technician"} Assessment · Mr. Pool Leak Repair
          </div>
        </div>

        {/* Hire recommendation banner */}
        <div className="card" style={{ marginBottom: "1rem", overflow: "hidden" }}>
          <div style={{ background: recBg, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 36 }}>{recIcon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: recColor, opacity: 0.8 }}>
                  Hire Recommendation
                </div>
                <div style={{ fontFamily: "var(--font-condensed)", fontSize: 28, fontWeight: 800, color: recColor }}>
                  {recommendation}
                </div>
              </div>
            </div>
            <ScoreRing score={combinedScore} size={90} />
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: voiceScore !== null ? "1fr 1fr" : "1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div className="card">
            <div style={{ padding: "1rem 1.5rem" }}>
              <div className="section-label" style={{ marginBottom: 8 }}>Knowledge Quiz</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ScoreRing score={quizScore} size={72} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{quizEval?.totalCorrect} / {quizEval?.totalQuestions} correct</div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)" }}>60% of total score</div>
                </div>
              </div>
            </div>
          </div>

          {voiceScore !== null && (
            <div className="card">
              <div style={{ padding: "1rem 1.5rem" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>Voice Call Simulation</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ScoreRing score={voiceScore} size={72} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{voiceEval?.recommendation}</div>
                    <div style={{ fontSize: 13, color: "var(--gray-500)" }}>40% of total score</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section breakdown */}
        {quizEval?.sectionScores && (
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="section-label">Quiz — Section Breakdown</div>
            </div>
            <div style={{ padding: "1rem 1.5rem" }}>
              {Object.entries(quizEval.sectionScores).map(([section, data]) => {
                const pct = Math.round((data.correct / data.total) * 100);
                const color = pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)";
                return (
                  <div key={section} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{section}</span>
                      <span style={{ fontWeight: 700, color }}>{data.correct}/{data.total} ({pct}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Voice rubric breakdown */}
        {voiceEval?.rubricResults && (
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="section-label">Call Simulation — Rubric Breakdown</div>
            </div>
            <div style={{ padding: "1rem 1.5rem" }}>
              {voiceEval.rubricResults.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < voiceEval.rubricResults.length - 1 ? "1px solid var(--gray-100)" : "none" }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                    {r.status === "hit" ? "✅" : r.status === "partial" ? "🟡" : "❌"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{r.item}</div>
                    {r.note && <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>{r.note}</div>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: r.points > 0 ? "var(--green)" : "var(--red)", flexShrink: 0 }}>
                    {r.points}/{r.maxPoints}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coaching notes */}
        {(voiceEval?.coachingNotes || quizEval?.missedTopics) && (
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="section-label">Coaching Notes & Areas to Improve</div>
            </div>
            <div style={{ padding: "1rem 1.5rem" }}>
              {voiceEval?.coachingNotes?.map((note, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: "var(--off-white)", borderRadius: "var(--radius)", marginBottom: 8, fontSize: 14, color: "var(--gray-700)" }}>
                  <span style={{ color: "var(--pool-blue)", flexShrink: 0 }}>💡</span>
                  <span>{note}</span>
                </div>
              ))}
              {quizEval?.missedTopics?.length > 0 && (
                <div style={{ marginTop: voiceEval?.coachingNotes ? 8 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 6 }}>Quiz — weak topic areas:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {quizEval.missedTopics.map(t => (
                      <span key={t} className="badge badge-amber">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Missed questions review */}
        {quizAnswers.filter(a => !a.isCorrect).length > 0 && (
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="section-label">Missed Questions Review</div>
            </div>
            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
              {quizAnswers.filter(a => !a.isCorrect).map((a, i) => (
                <div key={i} style={{ padding: "12px 14px", background: "var(--red-light)", borderRadius: "var(--radius)", borderLeft: "3px solid var(--red)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--red)", opacity: 0.7, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{a.section}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-800)", marginBottom: 6 }}>{a.question}</div>
                  <div style={{ fontSize: 13, color: "var(--red)" }}>You answered: {a.given}</div>
                  <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Correct: {a.correct}</div>
                  {a.explanation && (
                    <div style={{ fontSize: 12, color: "var(--gray-600)", marginTop: 6, lineHeight: 1.5 }}>{a.explanation}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: "3rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={handlePrint} style={{ flex: 1, minWidth: 140 }}>
            🖨️ Print / Save PDF
          </button>
          <button className="btn btn-outline" style={{ background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.3)", flex: 1, minWidth: 140 }} onClick={handleRestart}>
            ↩ New Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}
