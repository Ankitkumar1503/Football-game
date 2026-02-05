import React from "react";
import { ActionWheel } from "./sections/ActionWheel";
import { PlayerProfile } from "./sections/PlayerProfile";
import { LiveStats } from "./sections/LiveStats";
import { PlayerEvaluation } from "./sections/PlayerEvaluation";
import { PlayerReflection, BottomBar } from "./sections/ReflectionAndFooter";
import footballImage from "../assets/football.png";
import { useActiveSession } from "../hooks/useActiveSession";
import touches from "../assets/touches.png";
import touches2 from "../assets/touches2.png";
import { PlayerProfilesByPosition } from "./sections/PlayerProfilesByPosition";
import { PlayerAttendanceGrade } from "./sections/PlayerAttendanceGrade";
import { FootballFormation } from "./sections/Footballformation";
import { ActionWheelOld } from "./sections/ActionWheelOld";

export function Dashboard() {
  // Initialize the active session hook - this will create/load a session automatically
  useActiveSession();

  return (
    <div
      id="printable-dashboard"
      className="min-h-screen pb-20 bg-[#0A0A0A] text-white font-sans selection:bg-[#FF4422] selection:text-white"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b-2 border-[#FF4422]/40 shadow-[0_4px_20px_rgba(255,68,34,0.3)]">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <img
            src={touches}
            alt="Football"
            className="w-56 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,68,34,0.8)] flex-shrink-0"
          />
          <img
            src={touches2}
            alt="Football"
            className="w-16 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,68,34,0.8)] flex-shrink-0"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <PlayerProfile />
        <ActionWheel />
        {/* <ActionWheelOld /> */}
        <LiveStats />
        <PlayerEvaluation />
        <PlayerReflection />
        <PlayerProfilesByPosition />
        <PlayerAttendanceGrade />
        <FootballFormation />
      </main>

      {/* Sticky Bottom Bar */}
      <BottomBar />
    </div>
  );
}
