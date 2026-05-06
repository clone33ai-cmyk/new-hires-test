import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DragToRank from "../components/challenges/DragToRank";
import Hotspot from "../components/challenges/Hotspot";
import BranchingScenario from "../components/challenges/BranchingScenario";
import EstimateBuilder from "../components/challenges/EstimateBuilder";
import TextThread from "../components/challenges/TextThread";
import TimedPressure from "../components/challenges/TimedPressure";
import SymptomDiagnosis from "../components/challenges/SymptomDiagnosis";
import PreVisitChecklist from "../components/challenges/PreVisitChecklist";
import { dispatcherChallenges, technicianChallenges } from "../data/challengesData";

const TYPE_LABELS = {
  drag_rank: "Drag to Rank",
  hotspot: "Hotspot",
  branching: "Branching Scenario",
  estimate_builder: "Estimate Builder",
  text_thread: "Text Simulation",
  timed: "Timed Round ⚡",
  symptom_diagnosis: "Symptom Diagnosis",
  checklist: "Pre-Job Checklist",
};

const TYPE_COLORS = {
  drag_rank: { bg: "rgba(0,119,182,0.1)", color: "var(--pool-blue-dark)" },
  hotspot: { bg: "rgba(22,163,74,0.1)", color: "var(--green)" },
  branching: { bg: "rgba(217,119,6,0.1)", color: "var(--amber)" },
  estimate_builder: { bg: "rgba(2,62,138,0.12)", color: "var(--pool-blue-dark)" },
  text_thread: { bg: "rgba(22,163,74,0.1)", color: "var(--green)" },
  timed: { bg: "rgba(220,38,38,0.1)", color: "var(--red)" },
  symptom_diagnosis: { bg: "rgba(0,180,216,0.12)", color: "var(--pool-blue)" },
  checklist: { bg: "rgba(22,163,74,0.1)", color: "var(--green)" },
};

function ChallengeRenderer({ challenge, onComplete }) {
  switch (challenge.type) {
    case "drag_rank": return <DragToRank challenge={challenge} onComplete={onComplete} />;
    case "hotspot": return <Hotspot challenge={challenge} onComplete={onComplete} />;
    case "branching": return <BranchingScenario challenge={challenge} onComplete={onComplete} />;
    case "estimate_builder": return <EstimateBuilder challenge={challenge} onComplete={onComplete} />;
    case "text_thread": return <TextThread challenge={challenge} onComplete={onComplete} />;
    case "timed": return <TimedPressure challenge={challenge} onComplete={onComplete} />;
    case "symptom_diagnosis": return <SymptomDiagnosis challenge={challenge} onComplete={onComplete} />;
    case "checklist": return <PreVisitChecklist challenge={challenge} onComplete={onComplete} />;
    default: return <div>Unknown challenge type</div>;
  }
}

export default function Challenges() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("evalRole") || "technician";
  const isDispatcher = role === "dispatcher";
  const name = sessionStorage.getItem("evalName") || "Candidate";
  const challenges = isDispatcher ? dispatcherChallenges : technicianChallenges;

  const [phase, setPhase] = useState("intro"); // intro | challenge | complete
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [showingChallenge, setShowingChallenge] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("evalRole")) navigate("/");
  }, []);

  const handleComplete = (score) => {
    const newScores = [...scores, { id: challenges[currentIdx].id, score }];
    setScores(newScores);
    setShowingChallenge(false);

    if (currentIdx + 1 >= challenges.length) {
      sessionStorage.setItem("challengeScores", JSON.stringify(newScores));
      setPhase("complete");
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleStart = () => {
    setPhase("challenge");
    setShowingChallenge(true);
  };

  const handleNext = () => {
    navigate(isDispatcher ? "/voice-sim" : "/results");
  };

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((s, sc) => s + sc.score, 0) / scores.length)
    : 0;

  // Intro screen
  if (phase === "intro") {
    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm fade-in" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-header text-center">
              <div style={{ fontFamily: "var(--font-condensed)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
                Part 2 of 3
              </div>
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 28, fontWeight: 800 }}>
                Interactive Challenges
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>
                {challenges.length} challenges · Hands-on scenarios
              </p>
            </div>
            <div className="card-body">
              <p style={{ fontSize: 15, color: "var(--gray-600)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                Great work on the quiz, {name}! Now for the interactive section — these challenges simulate real situations you'll face on the job.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
                {challenges.map((c, i) => {
                  const colors = TYPE_COLORS[c.type] || { bg: "var(--gray-50)", color: "var(--gray-600)" };
                  return (
                    <div key={c.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", background: "var(--off-white)", borderRadius: "var(--radius)", border: "1px solid var(--gray-100)" }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{c.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--gray-800)" }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: "var(--gray-500)" }}>{c.subtitle}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: colors.bg, color: colors.color, flexShrink: 0 }}>
                        {TYPE_LABELS[c.type]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={handleStart}>
                Start Challenges →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete screen
  if (phase === "complete") {
    return (
      <div className="water-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="container-sm slide-up" style={{ width: "100%" }}>
          <div className="card">
            <div className="card-header text-center">
              <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 28, fontWeight: 800 }}>
                Challenges Complete! 🎉
              </h2>
            </div>
            <div className="card-body">
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-condensed)", fontSize: 56, fontWeight: 800, color: avgScore >= 80 ? "var(--green)" : avgScore >= 60 ? "var(--amber)" : "var(--red)" }}>
                  {avgScore}%
                </div>
                <div style={{ fontSize: 14, color: "var(--gray-500)" }}>Average across {challenges.length} challenges</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
                {scores.map((s, i) => {
                  const c = challenges[i];
                  const pct = s.score;
                  const color = pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)";
                  return (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--gray-700)", marginBottom: 4 }}>{c.title}</div>
                        <div className="progress-bar">
                          <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 1s ease" }} />
                        </div>
                      </div>
                      <span style={{ fontFamily: "var(--font-condensed)", fontSize: 16, fontWeight: 700, color, minWidth: 40, textAlign: "right" }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={handleNext}>
                {isDispatcher ? "Continue to Voice Simulation →" : "See Final Results →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active challenge
  const challenge = challenges[currentIdx];
  const colors = TYPE_COLORS[challenge.type] || { bg: "var(--gray-50)", color: "var(--gray-600)" };
  const progressPct = (currentIdx / challenges.length) * 100;

  return (
    <div className="water-bg" style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
      <div className="container" style={{ width: "100%" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{challenge.icon}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Interactive Challenges
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-condensed)", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
            {currentIdx + 1} / {challenges.length}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: "1.5rem" }}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="card fade-in" key={challenge.id}>
          <div className="card-body">
            {/* Challenge header */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: colors.bg, color: colors.color }}>
                    {TYPE_LABELS[challenge.type]}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: "var(--gray-100)", color: "var(--gray-500)" }}>
                    {challenge.section}
                  </span>
                </div>
                <h2 style={{ fontFamily: "var(--font-condensed)", fontSize: 22, fontWeight: 800, color: "var(--gray-900)", margin: "0 0 4px" }}>
                  {challenge.title}
                </h2>
                <p style={{ fontSize: 13, color: "var(--gray-500)", margin: 0 }}>{challenge.subtitle}</p>
              </div>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{challenge.icon}</span>
            </div>

            <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: "1.25rem" }}>
              <ChallengeRenderer challenge={challenge} onComplete={handleComplete} />
            </div>
          </div>
        </div>

        {/* Challenge dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
          {challenges.map((c, i) => (
            <div key={c.id} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i < currentIdx
                ? (scores[i]?.score >= 80 ? "#4ade80" : scores[i]?.score >= 60 ? "#fbbf24" : "#f87171")
                : i === currentIdx ? "var(--pool-cyan)" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s",
            }} title={c.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
