import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Intro from "./pages/Intro";
import Quiz from "./pages/Quiz";
import VoiceSimulation from "./pages/VoiceSimulation";
import Results from "./pages/Results";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intro/:role" element={<Intro />} />
      <Route path="/quiz/:role" element={<Quiz />} />
      <Route path="/voice-sim" element={<VoiceSimulation />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}
