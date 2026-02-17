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
import { Navigation } from "./Navigation";

export function Dashboard() {
  // Initialize the active session hook - this will create/load a session automatically
  useActiveSession();

  return (
    <div
      id="printable-dashboard"
      className="min-h-screen pb-20 bg-[#0A0A0A] text-white font-sans selection:bg-[#FF4422] selection:text-white"
    >
      {/* Header */}
      <Navigation />
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b-2 border-gary-300">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <img
            src={touches}
            alt="Football"
            className="w-56 h-20 object-contain flex-shrink-0"
          />
          <img
            src={touches2}
            alt="Football"
            className="w-16 h-20 object-contain flex-shrink-0"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <div id="register" className="scroll-mt-28">
          <PlayerProfile />
        </div>
        <ActionWheel />
        {/* <ActionWheelOld /> */}
        <div id="touch-counter" className="scroll-mt-28">
          <LiveStats />
        </div>
        <div id="player-evaluation" className="scroll-mt-28">
          <PlayerEvaluation />
        </div>
        <div id="player-reflection" className="scroll-mt-28">
          <PlayerReflection />
        </div>
        {/* <PlayerProfilesByPosition /> */}
        <div id="player-grade" className="scroll-mt-28">
          <PlayerAttendanceGrade />
        </div>
        <div id="starting-lineup" className="scroll-mt-28">
          <FootballFormation />
        </div>

        {/* Usage Policy Placeholder */}
        <div
          id="usage-policy"
          className="mt-8 mb-4 p-4 border-2 border-zinc-800 rounded-lg scroll-mt-28"
        >
          <h2 className="text-xl font-black uppercase text-white mb-2">
            USAGE POLICY
          </h2>
          <p className="text-sm text-gray-400">
            This application is designed for tracking football performance
            stats. Data is stored locally on your device.
          </p>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <BottomBar />
    </div>
  );
}
