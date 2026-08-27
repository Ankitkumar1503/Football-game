import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveSession } from "../../hooks/useActiveSession";
import { useCumulativeStats } from "../../hooks/useCumulativeStats";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/db";
import touchesLogo from "../../assets/touches.png";
import { InstallAppBanner } from "../InstallAppBanner";
import {
  Settings,
  Pointer,
  BarChart3,
  Brain,
  Star,
  LayoutGrid,
  Users,
  User,
  MessageSquare,
  ChevronRight,
  Zap,
  Activity,
  Trophy,
  Flame,
  Bot,
  Calendar,
} from "lucide-react";

export function PlayerDashboard() {
  const navigate = useNavigate();
  const { session } = useActiveSession();
  const { user } = useAuth();
  const cumulativeStats = useCumulativeStats();

  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [registryStats, setRegistryStats] = useState({
    totalOnline: 32064,
    leftCount: 12847,
    rightCount: 19204,
    leftPercent: 40,
    rightPercent: 60,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadLiveRegistry() {
      try {
        const allSessions = await db.sessions.toArray();
        let leftDbCount = 0;
        let rightDbCount = 0;

        allSessions.forEach((s) => {
          if ((s.activeFooter || s.footer || "").toUpperCase() === "LEFT") {
            leftDbCount++;
          } else {
            rightDbCount++;
          }
        });

        let savedProfile = {};
        try {
          savedProfile = JSON.parse(localStorage.getItem("playerProfile") || "{}");
        } catch (e) {}

        const userFoot = (
          savedProfile.activeFooter ||
          session.activeFooter ||
          "RIGHT"
        ).toUpperCase();

        if (userFoot === "LEFT") leftDbCount++;
        else rightDbCount++;

        const baseLeft = 12840 + leftDbCount;
        const baseRight = 19200 + rightDbCount;
        const total = baseLeft + baseRight;

        const leftPct = Math.round((baseLeft / total) * 100);
        const rightPct = 100 - leftPct;

        if (isMounted) {
          setRegistryStats({
            totalOnline: total,
            leftCount: baseLeft,
            rightCount: baseRight,
            leftPercent: leftPct,
            rightPercent: rightPct,
          });
        }
      } catch (err) {
        console.error("Error loading live registry DB stats:", err);
      }
    }

    loadLiveRegistry();
    return () => {
      isMounted = false;
    };
  }, [session.activeFooter, session.id]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentTimeStr(now.toLocaleString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("playerProfile") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const playerName =
    user?.name ||
    user?.firstName ||
    user?.fullName ||
    user?.playerName ||
    savedUser?.name ||
    savedUser?.firstName ||
    savedUser?.fullName ||
    savedUser?.playerName ||
    savedProfile?.fullName ||
    savedProfile?.name ||
    session?.playerName ||
    session?.fullName ||
    "Player";

  const activeFoot = (
    session?.activeFooter ||
    user?.footer ||
    savedProfile?.activeFooter ||
    "RIGHT"
  ).toUpperCase();
  const isRightFoot = activeFoot === "RIGHT";
  const playerInitial =
    playerName && playerName.trim().length > 0
      ? playerName.trim().charAt(0).toUpperCase()
      : "A";

  const totalTouches = cumulativeStats.totalTouches || 0;
  const totalSessions = cumulativeStats.totalSessions || 0;
  const totalGoals = cumulativeStats.totalGoals || 0;
  const totalHoursTrained = cumulativeStats.totalHoursTrained || 0;

  return (
    <div className="bg-[#07090E] text-football-text pb-6 pt-1 px-1 sm:px-2 space-y-3">
      {/* ════════════════════════════════
          1. CLEAN COMPACT HEADER BAR
      ════════════════════════════════ */}
      <div className="flex items-center justify-between py-2 px-1 border-b border-white/10">
        {/* Left: Yellow Ü Icon + Yellow TOUCHES Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <img
            src="/touches_icon.png"
            alt="TOUCHES Icon"
            className="h-8 sm:h-9 w-auto object-contain"
          />
          <img
            src="/touches_logo.png"
            alt="TOUCHES"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </div>

        {/* Right: Dynamic Foot Icon (Display only), Settings Gear, User Initial Avatar Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Dominant Foot Icon (No link, dynamic according to DB/state) */}
          <div className="flex items-center justify-center">
            <img
              src={isRightFoot ? "/right_foot.png" : "/left_foot.png"}
              alt={`${activeFoot} Foot Icon`}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>

          {/* Settings Gear */}
          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            className="p-1 text-white hover:text-yellow-400 transition-colors flex items-center justify-center"
          >
            <Settings size={24} strokeWidth={2} />
          </button>

          {/* Profile Initial Badge */}
          <button
            onClick={() => navigate("/account")}
            title={`Account (${playerName})`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FF4422] text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-white/20 hover:scale-105 transition-transform"
          >
            {playerInitial}
          </button>
        </div>
      </div>

      {/* PWA INSTALL APP BANNER */}
      <InstallAppBanner />

      {/* ════════════════════════════════
          2. GREEN STADIUM HERO BANNER
      ════════════════════════════════ */}
      <div className="relative rounded-2xl p-4 shadow-2xl overflow-hidden text-white space-y-3.5 border border-emerald-500/30 bg-gradient-to-b from-[#14532D] via-[#0F3E22] to-[#0A2916]">
        {/* Background Soccer Pitch Markings Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white"
          >
            <rect x="15" y="15" width="270" height="370" rx="6" />
            <line x1="15" y1="200" x2="285" y2="200" />
            <circle cx="150" cy="200" r="45" />
            <circle cx="150" cy="200" r="2" fill="currentColor" />
            <rect x="75" y="15" width="150" height="70" />
            <rect x="75" y="315" width="150" height="70" />
          </svg>
        </div>

        {/* Top Header Row: Welcome Text (Left) & Stick Figure Icon (Right) */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-emerald-300/90">
              Welcome back, player
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-none">
              {playerName}
            </h1>

            {/* Date Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-medium text-emerald-300 mt-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{currentTimeStr || "Fri, Jul 24, 2026 · 9:05:39 AM"}</span>
            </div>
          </div>

          {/* Top Right Stick Figure Icon (Circled in yellow in reference image) */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
            <img
              src={isRightFoot ? "/right_foot.png" : "/left_foot.png"}
              alt="Stick Figure Icon"
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
            />
          </div>
        </div>

        {/* 3 Top Stat Cards */}
        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">
              {totalTouches}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              TOUCHES
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">
              {totalSessions}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              SESSIONS
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">
              {totalGoals}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              GOALS
            </div>
          </div>
        </div>

        {/* LIVE REGISTRY & FOOTERS BREAKDOWN BLOCK (Circled in yellow in reference image) */}
        <div className="relative z-10 bg-black/45 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-lg">
          {/* Live Registry Title */}
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>FOOTBALLER ATHLETICS CLUB – LIVE REGISTRY</span>
          </div>

          {/* Players Online Now */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {registryStats.totalOnline.toLocaleString()}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-white/70">
              PLAYERS ONLINE NOW
            </span>
          </div>

          {/* Left vs Right Footers Stats */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-lg sm:text-xl font-black text-[#FF4422]">
                {registryStats.leftCount.toLocaleString()}
              </div>
              <div className="text-[8px] font-black uppercase tracking-wider text-[#FF4422]">
                LEFT FOOTERS
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg sm:text-xl font-black text-[#00AEEF]">
                {registryStats.rightCount.toLocaleString()}
              </div>
              <div className="text-[8px] font-black uppercase tracking-wider text-[#00AEEF]">
                RIGHT FOOTERS
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#FF4422] transition-all duration-500"
                style={{ width: `${registryStats.leftPercent}%` }}
              />
              <div
                className="h-full bg-[#00AEEF] transition-all duration-500"
                style={{ width: `${registryStats.rightPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[9px] font-semibold text-white/70">
              <span>{registryStats.leftPercent}% Left</span>
              <span>{registryStats.rightPercent}% Right</span>
            </div>
          </div>

          {/* Community Tagline */}
          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-[#00AEEF] pt-1">
            <Zap size={11} className="text-yellow-400 flex-shrink-0" />
            <span>
              YOU ARE 1 OF{" "}
              {(isRightFoot
                ? registryStats.rightCount
                : registryStats.leftCount
              ).toLocaleString()}{" "}
              {isRightFoot ? "RIGHT" : "LEFT"} FOOTERS IN THE TOUCHES™ COMMUNITY
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          3. COMPACT MATCHDAY TRACKER STRIP
      ════════════════════════════════ */}
      {/* <div className="rounded-xl p-2.5 border border-white/10 bg-[#121620] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF4422]/20 text-[#FF4422] flex items-center justify-center flex-shrink-0">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-wider text-white">
              MATCHDAY PERFORMANCE TRACKER
            </h3>
            <p className="text-[9px] text-white/60 font-medium">
              Log touches & analyze stats live
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/touch-counter")}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-[9px] uppercase tracking-wider border border-white/15 transition-all flex items-center gap-1 flex-shrink-0"
        >
          <span>START</span>
          <ChevronRight size={11} />
        </button>
      </div> */}

      {/* ════════════════════════════════
          4. YOUR TOOLS NAVIGATION SECTION (Compact)
      ════════════════════════════════ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
            YOUR TOOLS
          </h2>
        </div>

        {/* 2-Column Tools Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Touch Counter (First!) */}
          <button
            onClick={() => navigate("/touch-counter")}
            className="p-3 rounded-xl border-2 border-[#FF4422]/60 bg-[#12151D] hover:bg-[#FF4422]/10 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FF4422]/20 text-[#FF4422] flex items-center justify-center">
              <Pointer size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#FF4422] transition-colors">
                Touch Counter
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Track every action live
              </p>
            </div>
          </button>

          {/* Player Stats */}
          <button
            onClick={() => navigate("/stats")}
            className="p-3 rounded-xl border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00AEEF]/20 text-[#00AEEF] flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#00AEEF] transition-colors">
                Player Stats
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Lifetime totals
              </p>
            </div>
          </button>

          {/* Player Passport */}
          <button
            onClick={() => navigate("/passport")}
            className="p-3 rounded-xl border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8470A]/20 text-[#E8470A] flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E8470A] transition-colors">
                Player Passport
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Verified athlete ID
              </p>
            </div>
          </button>

          {/* 30-Day Challenge */}
          <button
            onClick={() => navigate("/challenge")}
            className="p-3 rounded-xl border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
              <Flame size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#10B981] transition-colors">
                30-Day Challenge
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Daily skills & drills
              </p>
            </div>
          </button>

          {/* Reflection */}
          <button
            onClick={() => navigate("/reflection")}
            className="p-3 rounded-xl border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
              <Brain size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#10B981] transition-colors">
                Reflection
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Post-match review
              </p>
            </div>
          </button>

          {/* Evaluation */}
          <button
            onClick={() => navigate("/evaluation")}
            className="p-3 rounded-xl border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
              <Star size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#F59E0B] transition-colors">
                Evaluation
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Grade your game
              </p>
            </div>
          </button>

          {/* Lineup */}
          <button
            onClick={() => navigate("/lineup")}
            className="p-3 rounded-xl border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center">
              <LayoutGrid size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#3B82F6] transition-colors">
                Lineup
              </h3>
              <p className="text-[9px] text-white/60 font-medium">Team sheet</p>
            </div>
          </button>

          {/* Roster */}
          <button
            onClick={() => navigate("/roster")}
            className="p-3 rounded-xl border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all text-left space-y-1.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#8B5CF6] transition-colors">
                Roster
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Grade all players
              </p>
            </div>
          </button>

          {/* AI Player Agent */}
          <button
            onClick={() => navigate("/ai-agent")}
            className="p-3 rounded-xl border border-yellow-500/40 bg-[#12151D] hover:bg-yellow-500/10 transition-all text-left space-y-1.5 group shadow-[0_0_8px_rgba(250,204,21,0.1)]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FF4422]/20 text-[#FF4422] flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 group-hover:text-yellow-300 transition-colors">
                AI Player Agent
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Personal football mentor
              </p>
            </div>
          </button>

          {/* Match Day Prep (Last!) */}
          <button
            onClick={() => navigate("/match-prep")}
            className="p-3 rounded-xl border border-yellow-500/40 bg-[#12151D] hover:bg-yellow-500/10 transition-all text-left space-y-1.5 group shadow-[0_0_8px_rgba(250,204,21,0.1)]"
          >
            <div className="w-9 h-9 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-yellow-400 group-hover:text-yellow-300 transition-colors">
                Match Day Prep
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Fixture & checklist
              </p>
            </div>
          </button>
        </div>

        {/* Note to Coach (Full Width) */}
        <button
          onClick={() => navigate("/note-to-coach")}
          className="w-full p-3 rounded-xl border border border-white/10 bg-[#12151D] hover:bg-white/5 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div className="text-left">
              <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#10B981] transition-colors">
                Note to Coach
              </h3>
              <p className="text-[9px] text-white/60 font-medium">
                Feedback & requests — direct
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-white/40 group-hover:text-white transition-colors"
          />
        </button>
      </div>

      {/* ════════════════════════════════
          5. CAREER STATS SECTION (Compact)
      ════════════════════════════════ */}
      <div className="space-y-2 pt-1">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70 px-0.5">
          CAREER STATS
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Goals */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/60">
                GOALS
              </p>
              <Trophy size={12} className="text-[#FF4422]/60" />
            </div>
            <p className="text-2xl font-black text-[#FF4422]">{totalGoals}</p>
          </div>

          {/* Hours Trained */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/60">
                HOURS TRAINED
              </p>
              <Flame size={12} className="text-[#00AEEF]/60" />
            </div>
            <p className="text-2xl font-black text-[#00AEEF]">
              {totalHoursTrained}
            </p>
          </div>

          {/* Sessions */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/60">
                SESSIONS
              </p>
              <Activity size={12} className="text-[#10B981]/60" />
            </div>
            <p className="text-2xl font-black text-[#10B981]">
              {totalSessions}
            </p>
          </div>

          {/* Total Touches */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/60">
                TOTAL TOUCHES
              </p>
              <Zap size={12} className="text-[#F59E0B]/60" />
            </div>
            <p className="text-2xl font-black text-[#F59E0B]">{totalTouches}</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          6. FOOTER BRAND CARD
      ════════════════════════════════ */}
      <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] flex items-center justify-between mt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#141720] border border-white/20 flex items-center justify-center">
            <span className="text-[6px] font-black tracking-tighter text-white/70">
              FA
            </span>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-white">
              FOOTBALLER ATHLETICS
            </h4>
            <p className="text-[8px] text-white/50 font-medium">
              Founded by Coach Clem Murdock • TOUCHES™ 2026
            </p>
          </div>
        </div>

        <div className="w-8 h-6 border border-white/15 rounded flex items-center justify-center opacity-40">
          <div className="w-3 h-3 border border-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
