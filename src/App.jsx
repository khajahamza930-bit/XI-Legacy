import { useState } from "react";
import StartScreen from "./pages/StartScreen";
import Draft from "./pages/Draft";

export default function App() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");

  if (!started) {
    return <StartScreen difficulty={difficulty} setDifficulty={setDifficulty} onStart={() => setStarted(true)} />;
  }

  return <Draft difficulty={difficulty} onExit={() => setStarted(false)} />;
}
