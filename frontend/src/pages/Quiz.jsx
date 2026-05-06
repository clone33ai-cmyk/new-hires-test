import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dispatcherQuestions, dispatcherSections } from "../data/dispatcherQuestions";
import { technicianQuestions, technicianSections } from "../data/technicianQuestions";

export default function Quiz() {
  const { role } = useParams();
  const navigate = useNavigate();
  const isDispatcher = role === "dispatcher";
  const questions = isDispatcher ? dispatcherQuestions : technicianQuestions;
  const sections = isDispatcher ? dispatcherSections : technicianSections;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // { question, given, correct, isCorrect }
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showSectionBreak, setShowSectionBreak] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());
  const topRef = useRef(null);

  const name = sessionStorage.getItem("evalName") || "Candidate";
  const q = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  // Redirect if no session
  useEffect(() => {
    if (!sessionStorage.getItem("evalRole")) navigate("/");
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentIdx, showSectionBreak]);

  const handleSelect = (optionIdx) => {
    if (revealed) return;
    setSelected(optionIdx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const handleNext = () => {
    // Save answer
    const isCorrect = selected === q.correct;
    const newAnswer = {
      question: q.question,
      section: q.section,
      given: q.options ? q.options[selected] : (selected ? "True" : "False"),
      correct: q.options ? q.options[q.correct] : (q.correct ? "True" : "False"),
      isCorrect,
      explanation: q.explanation,
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSelected(null);
    setRevealed(false);

    const nextIdx = currentIdx + 1;

    // Check if entering a new section
    if (nextIdx < questions.length) {
      const currentSection = q.section;
      const nextSection = questions[nextIdx].section;
      if (nextSection !== currentSection && !completedSections.has(currentSection)) {
        setCompletedSections(prev => new Set([...prev, currentSection]));
        setShowSectionBreak({ from: currentSection, to: nextSection, answersSnapshot: newAnswers });
        return;
      }
    }

    if (nextIdx >= questions.length) {
      // Done — for dispatchers go to voice sim, for technicians go straight to results
      sessionStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
      if (isDispatcher) {
        navigate("/voice-sim");
      } else {
        navigate("/results");
      }
    } else {
      setCurrentIdx(nextIdx);
    }
  };

  const handleSectionContinue = () => {
    setShowSectionBreak(false);
    setCurrentIdx(currentIdx + 1);
  };

  // Section break screen
  if (showSectionBreak) {
    const { from, to, answersSnapshot } = showSectionBreak;
    const sectionAnswers = answersSnapshot.filter(a => a.section === from);
    const sectionCorrect = sectionAnswers.filter(a => a.isCorrect).length;
    const pct = Math.round((sectionCorrect / sectionAnswers.length) * 100);

    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm slide-up" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-header text-center">
              <div style={{ fontFamily: "var(--font-condensed)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
                Section Complete
              </div>
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 26, fontWeight: 800 }}>{from}</h2>
            </div>
            <div className="card-body text-center">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "var(--font-condensed)", color: pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)" }}>
                    {pct}%
                  </div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)" }}>{sectionCorrect} of {sectionAnswers.length} correct</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: 4 }}>Next up:</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "var(--pool-blue-dark)" }}>{to}</div>
                  <div style={{ fontSize: 13, color: "var(--gray-500)" }}>
                    {questions.filter(q2 => q2.section === to).length} questions
                  </div>
                </div>
              </div>

              {/* Mini review of missed */}
              {sectionAnswers.filter(a => !a.isCorrect).length > 0 && (
                <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                  <div className="section-label" style={{ marginBottom: 8 }}>Missed in this section</div>
                  {sectionAnswers.filter(a => !a.isCorrect).map((a, i) => (
                    <div key={i} style={{ padding: "8px 12px", background: "var(--red-light)", borderRadius: "var(--radius)", marginBottom: 6, fontSize: 13, color: "var(--red)" }}>
                      ✗ {a.question.length > 70 ? a.question.slice(0, 70) + "…" : a.question}
                    </div>
                  ))}
                </div>
              )}

              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={handleSectionContinue}>
                Continue to {to} →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // True/false options
  const options = q.type === "true_false"
    ? ["True", "False"]
    : q.options;

  const getOptionClass = (idx) => {
    const actualIdx = q.type === "true_false" ? (idx === 0 ? true : false) : idx;
    if (!revealed) return selected === idx ? "option-btn selected" : "option-btn";
    if (q.type === "true_false") {
      if (idx === 0 && q.correct === true) return "option-btn correct";
      if (idx === 1 && q.correct === false) return "option-btn correct";
      if (selected === idx && (idx === 0 ? q.correct !== true : q.correct !== false)) return "option-btn wrong";
      return "option-btn";
    }
    if (idx === q.correct) return "option-btn correct";
    if (selected === idx && idx !== q.correct) return "option-btn wrong";
    return "option-btn";
  };

  const sectionQuestions = questions.filter(q2 => q2.section === q.section);
  const sectionIdx = sectionQuestions.findIndex(q2 => q2.id === q.id) + 1;

  return (
    <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }} ref={topRef}>
      <div className="container" style={{ width: "100%" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{isDispatcher ? "📞" : "🔧"}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {isDispatcher ? "Dispatcher" : "Technician"} Eval
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-condensed)", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
            {currentIdx + 1} / {questions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: "1.5rem" }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="card fade-in" key={currentIdx}>
          <div className="card-body">
            {/* Section + type badges */}
            <div style={{ display: "flex", gap: 6, marginBottom: "1rem", flexWrap: "wrap" }}>
              <span className="badge badge-blue">{q.section}</span>
              <span className="badge" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }}>
                {q.type === "true_false" ? "True / False" : q.type === "scenario" ? "Scenario" : "Multiple Choice"}
              </span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gray-400)" }}>
                Q{sectionIdx} of {sectionQuestions.length} in this section
              </span>
            </div>

            {/* Question */}
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--gray-900)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              {q.question}
            </h2>

            {/* Options */}
            <div>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  className={getOptionClass(idx)}
                  onClick={() => handleSelect(idx)}
                  disabled={revealed}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 700, flexShrink: 0,
                      background: selected === idx ? "var(--pool-blue)" : "var(--gray-200)",
                      color: selected === idx ? "white" : "var(--gray-500)",
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {revealed && (
              <div className="explanation-box fade-in">
                <strong>{selected === q.correct || (q.type === "true_false" && ((selected === 0) === q.correct)) ? "✓ Correct!" : "✗ Incorrect."}</strong>{" "}
                {q.explanation}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: "1.5rem" }}>
              {!revealed ? (
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleCheck}
                  disabled={selected === null}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleNext}
                >
                  {currentIdx + 1 >= questions.length
                    ? isDispatcher ? "Continue to Voice Simulation →" : "See Results →"
                    : "Next Question →"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section map */}
        <div style={{ marginTop: "1.5rem", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {sections.map((sec) => {
            const isActive = sec === q.section;
            const isDone = completedSections.has(sec);
            return (
              <div key={sec} style={{
                padding: "4px 10px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                background: isDone ? "rgba(22,163,74,0.2)" : isActive ? "rgba(0,119,182,0.3)" : "rgba(255,255,255,0.08)",
                color: isDone ? "#4ade80" : isActive ? "var(--pool-cyan)" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s",
              }}>
                {isDone ? "✓ " : ""}{sec}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
