import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import { IntroSequence } from "./components/IntroSequence";
import { PlayerProfile } from "./components/sections/PlayerProfile";
import { PlayerStats } from "./components/sections/PlayerStats";
import { LiveStats } from "./components/sections/LiveStats";
import { ActionWheel } from "./components/sections/ActionWheel";
import { PlayerReflection } from "./components/sections/ReflectionAndFooter";
import { PlayerEvaluation } from "./components/sections/PlayerEvaluation";
import { PlayerAttendanceGrade } from "./components/sections/PlayerAttendanceGrade";
import { FootballFormation } from "./components/sections/Footballformation";
import { NoteToCoach } from "./components/sections/NoteToCoach";
import { UsagePolicy } from "./components/sections/UsagePolicy";
import { Settings } from "./components/sections/Settings";
import { Account } from "./components/sections/Account";
import { PdfReportPage } from "./components/sections/PdfReportPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useActiveSession } from "./hooks/useActiveSession";

function TouchCounterPage() {
  return (
    <>
      <ActionWheel />
      <LiveStats />
    </>
  );
}

function AppContent() {
  useActiveSession();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/register" replace />} />
        <Route path="register" element={<PlayerProfile />} />
        <Route path="stats" element={<PlayerStats />} />
        <Route path="touch-counter" element={<TouchCounterPage />} />
        <Route path="reflection" element={<PlayerReflection />} />
        <Route path="evaluation" element={<PlayerEvaluation />} />
        <Route path="roster" element={<PlayerAttendanceGrade />} />
        <Route path="lineup" element={<FootballFormation />} />
        <Route path="note-to-coach" element={<NoteToCoach />} />
        <Route path="policy" element={<UsagePolicy />} />
        <Route path="settings" element={<Settings />} />
        <Route path="account" element={<Account />} />
        <Route path="pdf-report" element={<PdfReportPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <ErrorBoundary>
      {/* ThemeProvider wraps everything — all components share the same theme state */}
      <ThemeProvider>
        {showIntro ? (
          <IntroSequence onComplete={() => setShowIntro(false)} />
        ) : (
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
