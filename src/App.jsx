import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { IntroSequence } from "./components/IntroSequence";
import { PlayerProfile } from "./components/sections/PlayerProfile";
import { LiveStats } from "./components/sections/LiveStats";
import { ActionWheel } from "./components/sections/ActionWheel";
import { PlayerReflection } from "./components/sections/ReflectionAndFooter";
import { PlayerEvaluation } from "./components/sections/PlayerEvaluation";
import { PlayerAttendanceGrade } from "./components/sections/PlayerAttendanceGrade";
import { FootballFormation } from "./components/sections/Footballformation";
import { UsagePolicy } from "./components/sections/UsagePolicy";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useActiveSession } from "./hooks/useActiveSession"; // Ensure session init happens

function TouchCounterPage() {
  return (
    <>
      <ActionWheel />
      <LiveStats />
    </>
  );
}

function AppContent() {
  useActiveSession(); // Initialize session at top level

  return (
    <Routes>
      <Route path="/" element={<Layout defaultMenuOpen={true} />}>
        <Route index element={<Navigate to="/register" replace />} />
        <Route path="register" element={<PlayerProfile />} />
        <Route path="stats" element={<PlayerProfile />} />{" "}
        {/* Reusing Profile for Stats for now */}
        <Route path="touch-counter" element={<TouchCounterPage />} />
        <Route path="reflection" element={<PlayerReflection />} />
        <Route path="evaluation" element={<PlayerEvaluation />} />
        <Route path="grade" element={<PlayerAttendanceGrade />} />
        <Route path="lineup" element={<FootballFormation />} />
        <Route path="policy" element={<UsagePolicy />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <ErrorBoundary>
      {showIntro ? (
        <IntroSequence onComplete={() => setShowIntro(false)} />
      ) : (
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      )}
    </ErrorBoundary>
  );
}

export default App;
