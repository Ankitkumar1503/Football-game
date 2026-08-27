import React, { useState, useEffect } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { SectionActionBar } from "../ui/SectionActionBar";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  Coffee,
  Brain,
  Award,
} from "lucide-react";

const DEFAULT_CHECKLIST = [
  { id: "cleats", label: "Clean Boots & Extra Studs Packed", category: "GEAR" },
  { id: "shinguards", label: "Shin Guards & Grip Socks In Bag", category: "GEAR" },
  { id: "water", label: "2L Water & Electrolytes Bottle Ready", category: "HYDRATION" },
  { id: "nutrition", label: "Pre-Match Meal 3 Hours Before Kickoff", category: "NUTRITION" },
  { id: "tactics", label: "Review Team Tactics & Individual Goals", category: "MINDSET" },
  { id: "visualization", label: "10-Min Match Visualization & Focus", category: "MINDSET" },
  { id: "warmup", label: "Dynamic Stretching & Ball Touch Activation", category: "PHYSICAL" },
];

export function MatchDayPrep() {
  const { session } = useActiveSession();

  const [opponent, setOpponent] = useState(() => {
    return localStorage.getItem("prep_opponent") || "";
  });
  const [kickoffTime, setKickoffTime] = useState(() => {
    return localStorage.getItem("prep_kickoffTime") || "10:30 AM";
  });
  const [venue, setVenue] = useState(() => {
    return localStorage.getItem("prep_venue") || "";
  });
  const [targetGoal, setTargetGoal] = useState(() => {
    return localStorage.getItem("prep_targetGoal") || "";
  });

  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("prep_checkedItems") || "[]");
    } catch (e) {
      return [];
    }
  });

  const [tacticalNotes, setTacticalNotes] = useState(() => {
    return localStorage.getItem("prep_tacticalNotes") || "";
  });

  useEffect(() => {
    localStorage.setItem("prep_opponent", opponent);
  }, [opponent]);

  useEffect(() => {
    localStorage.setItem("prep_kickoffTime", kickoffTime);
  }, [kickoffTime]);

  useEffect(() => {
    localStorage.setItem("prep_venue", venue);
  }, [venue]);

  useEffect(() => {
    localStorage.setItem("prep_targetGoal", targetGoal);
  }, [targetGoal]);

  useEffect(() => {
    localStorage.setItem("prep_checkedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem("prep_tacticalNotes", tacticalNotes);
  }, [tacticalNotes]);

  const toggleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((checkedItems.length / DEFAULT_CHECKLIST.length) * 100);
  const activeFoot = (session?.activeFooter || "RIGHT").toUpperCase();
  const isRightFoot = activeFoot === "RIGHT";

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* ── Title Header ── */}
      <div className="flex items-center justify-between py-1">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
          MATCH DAY PREP
        </h2>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[9px] font-black uppercase">
          <Zap size={12} />
          <span>READY TO WIN</span>
        </div>
      </div>

      {/* ── MATCHDAY HERO CARD ── */}
      <div className="relative rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden border border-yellow-500/40 bg-gradient-to-b from-[#1C1608] via-[#120F08] to-[#0A0905] text-white space-y-3.5">
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">
              NEXT FIXTURE PREPARATION
            </p>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white">
              {opponent ? `VS ${opponent}` : "OPPONENT NOT SET"}
            </h1>
            <p className="text-xs font-semibold text-white/70">
              {session?.playerName || "Player"} · {session?.position || "Position"} ({isRightFoot ? "Right Foot" : "Left Foot"})
            </p>
          </div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center">
            <img
              src={isRightFoot ? "/right_foot.png" : "/left_foot.png"}
              alt="Stick Figure Icon"
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
            />
          </div>
        </div>

        {/* Fixture Details Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 relative z-10">
          <div className="bg-black/50 border border-yellow-400/30 rounded-xl p-2.5 space-y-1">
            <label className="text-[9px] font-black uppercase text-yellow-400 block flex items-center gap-1">
              <ShieldCheck size={10} />
              <span>OPPONENT</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rival Academy"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              className="w-full bg-transparent text-white text-xs font-bold focus:outline-none placeholder:text-white/30"
            />
          </div>

          <div className="bg-black/50 border border-yellow-400/30 rounded-xl p-2.5 space-y-1">
            <label className="text-[9px] font-black uppercase text-yellow-400 block flex items-center gap-1">
              <Clock size={10} />
              <span>KICKOFF TIME</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 10:30 AM"
              value={kickoffTime}
              onChange={(e) => setKickoffTime(e.target.value)}
              className="w-full bg-transparent text-white text-xs font-bold focus:outline-none placeholder:text-white/30"
            />
          </div>

          <div className="bg-black/50 border border-yellow-400/30 rounded-xl p-2.5 space-y-1">
            <label className="text-[9px] font-black uppercase text-yellow-400 block flex items-center gap-1">
              <MapPin size={10} />
              <span>VENUE</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Main Pitch 1"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-transparent text-white text-xs font-bold focus:outline-none placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Readiness Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs font-black uppercase">
            <span className="text-yellow-400">PREPARATION READINESS</span>
            <span className="text-white">{progressPercent}% READY</span>
          </div>
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── PRE-MATCH CHECKLIST ── */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 px-0.5">
          PRE-MATCH CHECKLIST
        </h3>

        <div className="space-y-2">
          {DEFAULT_CHECKLIST.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                  isChecked
                    ? "bg-[#121A15] border-emerald-500/50 text-white"
                    : "bg-[#12151D] border-white/10 text-white/80 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                      isChecked
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : "border-white/30 bg-black/40"
                    }`}
                  >
                    {isChecked && <CheckCircle2 size={14} />}
                  </div>

                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isChecked ? "line-through text-white/60" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>

                <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/10">
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TACTICAL FOCUS & NOTES ── */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#12151D] space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400 block">
          TACTICAL FOCUS & COACH INSTRUCTIONS
        </label>
        <textarea
          rows={3}
          placeholder="Write your tactical role, 3 main objectives, and coach instructions..."
          value={tacticalNotes}
          onChange={(e) => setTacticalNotes(e.target.value)}
          className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-white text-xs font-medium focus:outline-none focus:border-yellow-400 placeholder:text-white/30 resize-none"
        />
      </div>

      {/* ── INSPIRATIONAL QUOTE BANNER ── */}
      <div className="p-4 rounded-2xl bg-[#10B981] text-white space-y-1 shadow-lg border border-emerald-400/40">
        <p className="text-base sm:text-lg font-black italic tracking-wide text-yellow-300">
          “Preparation is the bridge to peak performance.”
        </p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
          — Footballer Athletics™
        </p>
      </div>

      {/* Action Bar */}
      <SectionActionBar sectionKey="match-prep" />
    </div>
  );
}
