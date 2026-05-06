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
          strokeDasharray={circ} strokeDashoffset={circ - fill} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-condensed)", fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 10, color: "var(--gray-400)" }}>/ 100</span>
      </div>
    </div>
  );
}

function StatusIcon({ status }) {
  if (status === "hit") return <span style={{ fontSize: 18 }}>✅</span>;
  if (status === "partial") return <span style={{ fontSize: 18 }}>🟡</span>;
  return <span style={{ fontSize: 18 }}>❌</span>;
}

export default function Results() {
  const navigate = useNavigate();
  const [quizEval, setQuizEval] = useState(null);
  const [voiceEval, setVoiceEval] = useState(null);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [challengeScores, setChallengeScores] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const name = sessionStorage.getItem("evalName") || "Candidate";
  const role = sessionStorage.getItem("evalRole") || "dispatcher";
  const isDispatcher = role === "dispatcher";

  useEffect(() => {
    const answers = JSON.parse(sessionStorage.getItem("quizAnswers") || "[]");
    const voice = JSON.parse(sessionStorage.getItem("voiceEval") || "null");
    const transcript = sessionStorage.getItem("voiceTranscript") || "";
    const challenges = JSON.parse(sessionStorage.getItem("challengeScores") || "[]");
    setQuizAnswers(answers);
    setVoiceEval(voice);
    setVoiceTranscript(transcript);
    setChallengeScores(challenges);

    if (answers.length > 0) {
      const sections = {};
      answers.forEach(a => {
        if (!sections[a.section]) sections[a.section] = { correct: 0, total: 0 };
        sections[a.section].total++;
        if (a.isCorrect) sections[a.section].correct++;
      });
      const totalCorrect = answers.filter(a => a.isCorrect).length;
      const pct = Math.round((totalCorrect / answers.length) * 100);
      const missedTopics = [...new Set(answers.filter(a => !a.isCorrect).map(a => a.section))];
      setQuizEval({ sectionScores: sections, totalCorrect, totalQuestions: answers.length, percentage: pct, missedTopics });
    }
  }, []);

  const quizScore = quizEval?.percentage || 0;
  const voiceScore = voiceEval?.totalScore ?? null;
  const challengeAvg = challengeScores.length > 0
    ? Math.round(challengeScores.reduce((s, c) => s + c.score, 0) / challengeScores.length)
    : null;

  const combinedScore = (() => {
    if (voiceScore !== null && challengeAvg !== null) return Math.round(quizScore * 0.5 + challengeAvg * 0.3 + voiceScore * 0.2);
    if (challengeAvg !== null) return Math.round(quizScore * 0.6 + challengeAvg * 0.4);
    if (voiceScore !== null) return Math.round(quizScore * 0.6 + voiceScore * 0.4);
    return quizScore;
  })();

  const recommendation = combinedScore >= 85 ? "STRONG HIRE" : combinedScore >= 65 ? "CONSIDER" : "NOT RECOMMENDED";
  const recColor = recommendation === "STRONG HIRE" ? "var(--green)" : recommendation === "CONSIDER" ? "var(--amber)" : "var(--red)";
  const recBg = recommendation === "STRONG HIRE" ? "var(--green-light)" : recommendation === "CONSIDER" ? "var(--amber-light)" : "var(--red-light)";
  const recIcon = recommendation === "STRONG HIRE" ? "🎉" : recommendation === "CONSIDER" ? "🤔" : "❌";

  // Parse transcript lines for display
  const transcriptLines = voiceTranscript
    ? voiceTranscript.split("\n").filter(l => l.trim())
    : [];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "quiz", label: "Quiz Results" },
    ...(voiceEval ? [{ id: "call", label: "Call Grading" }] : []),
    { id: "coaching", label: "Coaching Notes" },
  ];

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
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ background: recBg, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 36 }}>{recIcon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: recColor, opacity: 0.8 }}>Hire Recommendation</div>
                <div style={{ fontFamily: "var(--font-condensed)", fontSize: 28, fontWeight: 800, color: recColor }}>{recommendation}</div>
              </div>
            </div>
            <ScoreRing score={combinedScore} size={90} />
          </div>
        </div>

        {/* Score breakdown cards */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${[quizScore, challengeAvg, voiceScore].filter(v => v !== null).length}, 1fr)`, gap: "0.75rem", marginBottom: "1rem" }}>
          <div className="card">
            <div style={{ padding: "1rem 1.25rem" }}>
              <div className="section-label" style={{ marginBottom: 8 }}>Quiz</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ScoreRing score={quizScore} size={64} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{quizEval?.totalCorrect}/{quizEval?.totalQuestions} correct</div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)" }}>Knowledge test</div>
                </div>
              </div>
            </div>
          </div>
          {challengeAvg !== null && (
            <div className="card">
              <div style={{ padding: "1rem 1.25rem" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>Challenges</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ScoreRing score={challengeAvg} size={64} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{challengeScores.length} completed</div>
                    <div style={{ fontSize: 12, color: "var(--gray-500)" }}>Interactive</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {voiceScore !== null && (
            <div className="card">
              <div style={{ padding: "1rem 1.25rem" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>Voice Call</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ScoreRing score={voiceScore} size={64} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{voiceEval?.recommendation}</div>
                    <div style={{ fontSize: 12, color: "var(--gray-500)" }}>Call simulation</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: "1rem", background: "rgba(255,255,255,0.06)", padding: 4, borderRadius: "var(--radius)" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: activeTab === tab.id ? "var(--white)" : "transparent",
              color: activeTab === tab.id ? "var(--pool-blue-dark)" : "rgba(255,255,255,0.6)",
              fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 13,
              fontFamily: "var(--font)", transition: "all 0.15s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="card fade-in">
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="section-label">Quiz — Section Breakdown</div>
            </div>
            <div style={{ padding: "1rem 1.5rem" }}>
              {quizEval?.sectionScores && Object.entries(quizEval.sectionScores).map(([section, data]) => {
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

        {/* TAB: QUIZ DETAIL */}
        {activeTab === "quiz" && (
          <div className="card fade-in">
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="section-label">Missed Questions Review</div>
            </div>
            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
              {quizAnswers.filter(a => !a.isCorrect).length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--green)", fontWeight: 600 }}>
                  🎉 Perfect score — no missed questions!
                </div>
              ) : (
                quizAnswers.filter(a => !a.isCorrect).map((a, i) => (
                  <div key={i} style={{ padding: "12px 14px", background: "var(--red-light)", borderRadius: "var(--radius)", borderLeft: "3px solid var(--red)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--red)", opacity: 0.7, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{a.section}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--gray-800)", marginBottom: 6 }}>{a.question}</div>
                    <div style={{ fontSize: 13, color: "var(--red)" }}>Your answer: {a.given}</div>
                    <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>Correct: {a.correct}</div>
                    {a.explanation && <div style={{ fontSize: 12, color: "var(--gray-600)", marginTop: 6, lineHeight: 1.5 }}>{a.explanation}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB: CALL GRADING */}
        {activeTab === "call" && voiceEval && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Summary */}
            <div className="card">
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
                <div className="section-label">Call Summary</div>
              </div>
              <div style={{ padding: "1rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
                  <ScoreRing score={voiceEval.totalScore} size={80} />
                  <div>
                    <div className={`badge ${voiceEval.recommendation === "STRONG HIRE" ? "badge-green" : voiceEval.recommendation === "CONSIDER" ? "badge-amber" : "badge-red"}`} style={{ marginBottom: 8 }}>
                      {voiceEval.recommendation}
                    </div>
                    <p style={{ fontSize: 14, color: "var(--gray-600)", margin: 0, lineHeight: 1.6 }}>{voiceEval.summary}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rubric line by line */}
            {voiceEval.rubricResults && voiceEval.rubricResults.length > 0 && (
              <div className="card">
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
                  <div className="section-label">Script Rubric — Line by Line</div>
                </div>
                <div style={{ padding: "0.5rem 1.5rem" }}>
                  {voiceEval.rubricResults.map((r, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0",
                      borderBottom: i < voiceEval.rubricResults.length - 1 ? "1px solid var(--gray-100)" : "none"
                    }}>
                      <StatusIcon status={r.status} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-800)", marginBottom: 2 }}>{r.item}</div>
                        {r.note && <div style={{ fontSize: 13, color: "var(--gray-500)", lineHeight: 1.5 }}>{r.note}</div>}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-condensed)", fontSize: 15, fontWeight: 800, flexShrink: 0,
                        color: r.points === r.maxPoints ? "var(--green)" : r.points > 0 ? "var(--amber)" : "var(--red)"
                      }}>
                        {r.points}/{r.maxPoints}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "1rem 1.5rem", background: "var(--gray-50)", borderTop: "1px solid var(--gray-100)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Total Score</span>
                  <span style={{ fontFamily: "var(--font-condensed)", fontSize: 22, fontWeight: 800, color: voiceEval.totalScore >= 85 ? "var(--green)" : voiceEval.totalScore >= 65 ? "var(--amber)" : "var(--red)" }}>
                    {voiceEval.totalScore} / 100
                  </span>
                </div>
              </div>
            )}

            {/* Full transcript */}
            {transcriptLines.length > 0 && (
              <div className="card">
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
                  <div className="section-label">Full Call Transcript</div>
                </div>
                <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 10, maxHeight: 500, overflowY: "auto" }}>
                  {transcriptLines.map((line, i) => {
                    const isDispatcherLine = line.startsWith(name) || line.includes("(Dispatcher)");
                    return (
                      <div key={i} style={{ display: "flex", justifyContent: isDispatcherLine ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "80%", padding: "8px 14px", fontSize: 13, lineHeight: 1.5,
                          background: isDispatcherLine ? "var(--pool-blue)" : "var(--gray-100)",
                          color: isDispatcherLine ? "white" : "var(--gray-800)",
                          borderRadius: isDispatcherLine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        }}>
                          <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.65, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {isDispatcherLine ? name : "Mike — Customer"}
                          </div>
                          {line.replace(/^[^:]+:\s*/, "")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: COACHING */}
        {activeTab === "coaching" && (
          <div className="card fade-in">
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div className="section-label">Coaching Notes & Areas to Improve</div>
            </div>
            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
              {voiceEval?.coachingNotes?.map((note, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", background: "var(--off-white)", borderRadius: "var(--radius)", fontSize: 14, color: "var(--gray-700)", lineHeight: 1.6, borderLeft: "3px solid var(--pool-blue)" }}>
                  <span style={{ color: "var(--pool-blue)", flexShrink: 0, fontWeight: 700 }}>💡</span>
                  <span>{note}</span>
                </div>
              ))}
              {quizEval?.missedTopics?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-600)", marginBottom: 8 }}>Quiz — weak topic areas to study:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {quizEval.missedTopics.map(t => (
                      <span key={t} className="badge badge-amber">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {!voiceEval?.coachingNotes?.length && !quizEval?.missedTopics?.length && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--green)", fontWeight: 600 }}>
                  🎉 No major coaching notes — strong performance!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => window.print()} style={{ flex: 1, minWidth: 140 }}>
            🖨️ Print / Save PDF
          </button>
          <button onClick={() => { sessionStorage.clear(); navigate("/"); }}
            style={{ flex: 1, minWidth: 140, background: "rgba(255,255,255,0.1)", color: "white", border: "2px solid rgba(255,255,255,0.2)", borderRadius: "var(--radius)", fontFamily: "var(--font)", fontWeight: 600, fontSize: 15, cursor: "pointer", padding: "12px 24px" }}>
            ↩ New Evaluation
          </button>
        </div>

      </div>
    </div>
  );
}
