import React, { useEffect, useState } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { db } from "../../lib/db";
import { RotateCcw } from "lucide-react";

export function LiveStats({ isPdf }) {
  const { stats, sessionId } = useActiveSession();

  const handleReset = async () => {
    if (!sessionId) return;
    if (confirm("Are you sure you want to reset the touches for this session?")) {
      try {
        await db.touches.where("sessionId").equals(sessionId).delete();
      } catch (error) {
        console.error("Error resetting touches:", error);
      }
    }
  };

  const statList = [
    { label: "PASS", value: stats.Pass || 0 },
    { label: "DRIBBLE", value: stats.Dribble || 0 },
    { label: "SHOT", value: stats.Shot || 0 },
    { label: "CROSS", value: stats.Cross || 0 },
    { label: "GOAL", value: stats.Goal || 0 },
    { label: "HEADER", value: stats.Header || 0 },
    { label: "TACKLE", value: stats.Tackle || 0 },
    { label: "THROW-IN", value: stats["Throw-In"] || 0 },
    { label: "CORNER KICK", value: stats["Corner Kick"] || 0 },
    { label: "FREE KICK", value: stats["Free Kick"] || 0 },
    { label: "PENALTY KICK", value: stats["Penalty Kick"] || 0 },
    { label: "POSITIVE TOUCHES", value: stats.good || 0, color: "text-emerald-400" },
    { label: "NEGATIVE TOUCHES", value: stats.bad || 0, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
          SESSION TOUCH SUMMARY
        </h3>
        <button
          onClick={handleReset}
          className="text-[9px] font-black uppercase text-football-text/50 hover:text-football-accent transition-colors flex items-center gap-1"
        >
          <RotateCcw size={12} />
          <span>RESET SESSION</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {statList.map((item) => (
          <div
            key={item.label}
            className="p-2.5 rounded-xl border border-white/10 bg-[#12151D] flex items-center justify-between"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-white/70">
              {item.label}
            </span>
            <span className={`text-sm font-black ${item.color || "text-white"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
