import React, { useState } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { db } from "../../lib/db";
import { SectionActionBar } from "../ui/SectionActionBar";
import {
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Undo2,
  ArrowRight,
  Target,
  Zap,
  Award,
  CircleDot,
  Shield,
  Flag,
  RotateCw,
  AlertTriangle
} from "lucide-react";

const ACTIONS_CONFIG = [
  { id: "Pass", label: "PASS", icon: ArrowRight },
  { id: "Dribble", label: "DRIBBLE", icon: Zap },
  { id: "Shot", label: "SHOT", icon: Target },
  { id: "Goal", label: "GOAL", icon: Award },
  { id: "Header", label: "HEADER", icon: CircleDot },
  { id: "Tackle", label: "TACKLE", icon: Shield },
  { id: "Free Kick", label: "FREE KICK", icon: RotateCw },
  { id: "Corner Kick", label: "CORNER", icon: Flag },
  { id: "Throw-In", label: "THROW-IN", icon: ArrowRight },
  { id: "Penalty Kick", label: "PENALTY", icon: Target },
  { id: "Yellow Card", label: "YELLOW CARD", icon: AlertTriangle },
  { id: "Red Card", label: "RED CARD", icon: AlertTriangle },
];

export function ActionWheel() {
  const { stats, sessionId, addTouch, undoLastTouch } = useActiveSession();
  const [selectedQuality, setSelectedQuality] = useState("Positive");
  const [lastLoggedAction, setLastLoggedAction] = useState(null);

  const handleActionTap = async (actionId) => {
    await addTouch(actionId, selectedQuality);
    setLastLoggedAction({ action: actionId, quality: selectedQuality });
    setTimeout(() => setLastLoggedAction(null), 1200);
  };

  const handleResetSessionTouches = async () => {
    if (!sessionId) return;
    if (confirm("Are you sure you want to reset all touches for this session?")) {
      try {
        await db.touches.where("sessionId").equals(sessionId).delete();
      } catch (error) {
        console.error("Error resetting touches:", error);
      }
    }
  };

  const total = stats.total || 0;
  const positiveCount = stats.good || 0;
  const negativeCount = stats.bad || 0;

  const positivePercent = total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negativeCount / total) * 100) : 0;

  return (
    <div className="space-y-3 pb-1 select-none">
      
      {/* ── Page Title Bar ── */}
      <div className="flex items-center justify-between py-1">
        <h2 className="text-xl font-black uppercase text-[#FF4422] tracking-wider text-glow flex items-center gap-2">
          <span>TOUCH COUNTER</span>
        </h2>

        <div className="flex items-center gap-2">
          {/* Undo Button */}
          <button
            onClick={undoLastTouch}
            disabled={total === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all"
            title="Undo last touch"
          >
            <Undo2 size={14} />
            <span className="text-[10px] font-black uppercase">UNDO</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleResetSessionTouches}
            disabled={total === 0}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 text-white/60 disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Reset touches"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* ── Central Circular Gauge Counter ── */}
      <div className="relative py-2 flex flex-col items-center justify-center">
        <div className="relative w-44 h-44 rounded-full border-4 border-[#FF4422]/30 bg-gradient-to-b from-[#161922] to-[#0D0F16] shadow-2xl flex flex-col items-center justify-center space-y-0.5 border-t-[#FF4422] border-r-[#FF4422]/60">
          
          {/* Neon Ring Glow */}
          <div className="absolute inset-0 rounded-full border-2 border-[#FF4422]/20 blur-md pointer-events-none" />

          <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">
            {total}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF4422] pt-0.5">
            TOTAL TOUCHES
          </span>

          {lastLoggedAction && (
            <div className="absolute -bottom-3 px-3 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#10B981] text-white shadow-lg animate-bounce">
              +{lastLoggedAction.action}
            </div>
          )}
        </div>
      </div>

      {/* ── Positive vs Negative Summary Cards ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Positive Card */}
        <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-[#0E1A14] space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] font-black uppercase tracking-wider">POSITIVE</span>
            <ThumbsUp size={16} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{positiveCount}</span>
            <span className="text-[10px] font-bold text-emerald-400/80">{positivePercent}%</span>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${positivePercent}%` }} />
          </div>
        </div>

        {/* Negative Card */}
        <div className="p-3.5 rounded-2xl border border-rose-500/30 bg-[#1F1014] space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-[10px] font-black uppercase tracking-wider">NEGATIVE</span>
            <ThumbsDown size={16} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400">{negativeCount}</span>
            <span className="text-[10px] font-bold text-rose-400/80">{negativePercent}%</span>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-400 h-full transition-all duration-300" style={{ width: `${negativePercent}%` }} />
          </div>
        </div>
      </div>

      {/* ── Quality Selector Mode Buttons ── */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => setSelectedQuality("Positive")}
          className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            selectedQuality === "Positive"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]"
              : "bg-[#141720] text-white/60 border border-white/10 hover:bg-white/5"
          }`}
        >
          <ThumbsUp size={15} />
          <span>Positive Mode</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedQuality("Negative")}
          className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            selectedQuality === "Negative"
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-[1.02]"
              : "bg-[#141720] text-white/60 border border-white/10 hover:bg-white/5"
          }`}
        >
          <ThumbsDown size={15} />
          <span>Negative Mode</span>
        </button>
      </div>

      {/* ── 3-Column Action Grid ── */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {ACTIONS_CONFIG.map((item) => {
          const Icon = item.icon;
          const count = stats[item.id] || 0;

          return (
            <button
              key={item.id}
              onClick={() => handleActionTap(item.id)}
              className="group p-3 rounded-2xl border border-white/10 bg-[#12151D] hover:bg-white/10 active:scale-95 transition-all text-center flex flex-col items-center justify-between h-24 relative overflow-hidden"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-[#FF4422]/20 text-white/70 group-hover:text-[#FF4422] flex items-center justify-center transition-colors">
                <Icon size={16} />
              </div>

              <div className="space-y-0.5">
                <div className="text-base font-black text-white">{count}</div>
                <div className="text-[8px] font-black uppercase tracking-wider text-white/60 group-hover:text-white">
                  {item.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Action Buttons Bar ── */}
      <SectionActionBar
        onReset={handleResetSessionTouches}
        sectionKey="touch-counter"
      />

    </div>
  );
}
