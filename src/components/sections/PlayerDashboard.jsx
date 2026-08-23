import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveSession } from "../../hooks/useActiveSession";
import { useCumulativeStats } from "../../hooks/useCumulativeStats";
import { useAuth } from "../../contexts/AuthContext";
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
  MessageSquare,
  ChevronRight,
  Zap,
  Activity,
  Trophy,
  Flame
} from "lucide-react";

export function PlayerDashboard() {
  const navigate = useNavigate();
  const { session } = useActiveSession();
  const { user } = useAuth();
  const cumulativeStats = useCumulativeStats();

  const [currentTimeStr, setCurrentTimeStr] = useState("");

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

  const activeFoot = (session?.activeFooter || user?.footer || savedProfile?.activeFooter || "RIGHT").toUpperCase();
  const isRightFoot = activeFoot === "RIGHT";
  const playerInitial = playerName && playerName.trim().length > 0 ? playerName.trim().charAt(0).toUpperCase() : "A";


  const totalTouches = cumulativeStats.totalTouches || 0;
  const totalSessions = cumulativeStats.totalSessions || 0;
  const totalGoals = cumulativeStats.totalGoals || 0;
  const totalHoursTrained = cumulativeStats.totalHoursTrained || 0;

  return (
    <div className="bg-[#07090E] text-football-text pb-6 pt-1 px-1 sm:px-2 space-y-3">
      
      {/* ════════════════════════════════
          1. CLEAN COMPACT HEADER BAR
      ════════════════════════════════ */}
      <div className="flex items-center justify-between py-1 px-1 border-b border-white/10">
        {/* Left: TOUCHES Logo & FA Badge */}
        <div 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="py-1 px-2.5 rounded-lg bg-[#141720] border border-white/10 flex items-center justify-center">
            <img src={touchesLogo} alt="TOUCHES" className="h-4 w-auto object-contain" />
          </div>

          <div className="w-6 h-6 rounded-full bg-[#141720] border border-white/15 flex items-center justify-center">
            <span className="text-[7px] font-black tracking-tighter text-white/70">FA</span>
          </div>
        </div>

        {/* Right: Active Foot Pill, Settings & Profile */}
        <div className="flex items-center gap-2">
          {/* Active Foot Pill */}
          <div
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm ${
              isRightFoot
                ? "bg-[#00AEEF] text-white"
                : "bg-[#FF4422] text-white"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>{isRightFoot ? "RIGHT" : "LEFT"}</span>
          </div>

          {/* Settings Gear */}
          <button
            onClick={() => navigate("/settings")}
            className="p-1 text-white/70 hover:text-white transition-colors"
          >
            <Settings size={17} />
          </button>

          {/* Profile Badge */}
          <button
            onClick={() => navigate("/account")}
            className="w-7 h-7 rounded-full bg-[#FF4422] text-white font-black text-xs flex items-center justify-center shadow-md border border-white/20"
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
      <div className="relative rounded-2xl p-3.5 sm:p-4 shadow-xl overflow-hidden text-white space-y-3 border border-emerald-500/30 bg-gradient-to-br from-[#0E4D2B] via-[#0B3D22] to-[#062916]">
        
        {/* Background Grid Lines Overlay */}
        <div className="absolute top-0 right-0 w-28 h-28 opacity-15 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 0h100v100H0zM0 25h100M0 50h100M0 75h100M25 0v100M50 0v100M75 0v100" />
          </svg>
        </div>

        {/* Welcome Header */}
        <div className="space-y-0.5 relative z-10">
          <p className="text-[10px] font-medium text-white/80">Welcome back, player</p>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-none">
            {playerName}
          </h1>

          {/* Date Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 border border-white/10 text-[9px] font-medium text-white/90 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{currentTimeStr || "Fri, Aug 21, 2026"}</span>
          </div>
        </div>

        {/* 3 Top Stat Cards */}
        <div className="grid grid-cols-3 gap-2 relative z-10">
          <div className="bg-black/30 backdrop-blur-md border border-white/15 rounded-xl p-2 text-center">
            <div className="text-lg font-black text-white">{totalTouches}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">TOUCHES</div>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/15 rounded-xl p-2 text-center">
            <div className="text-lg font-black text-white">{totalSessions}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">SESSIONS</div>
          </div>

          <div className="bg-black/30 backdrop-blur-md border border-white/15 rounded-xl p-2 text-center">
            <div className="text-lg font-black text-white">{totalGoals}</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-emerald-400">GOALS</div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          3. COMPACT MATCHDAY TRACKER STRIP
      ════════════════════════════════ */}
      <div className="rounded-xl p-2.5 border border-white/10 bg-[#121620] flex items-center justify-between gap-2">
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
      </div>

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
          {/* Touch Counter */}
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
              <p className="text-[9px] text-white/60 font-medium">
                Team sheet
              </p>
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
          <ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
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
            <p className="text-2xl font-black text-[#FF4422]">
              {totalGoals}
            </p>
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
            <p className="text-2xl font-black text-[#F59E0B]">
              {totalTouches}
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          6. FOOTER BRAND CARD
      ════════════════════════════════ */}
      <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] flex items-center justify-between mt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#141720] border border-white/20 flex items-center justify-center">
            <span className="text-[6px] font-black tracking-tighter text-white/70">FA</span>
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
