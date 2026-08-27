import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Flame, CircleDot, Trophy } from "lucide-react";
import { SectionActionBar } from "../ui/SectionActionBar";

const DRILLS_CONFIG = [
  { day: 1, title: "Toe Taps", reps: "100 REPS · both feet", description: "Alternate feet fast. Stay on your toes." },
  { day: 2, title: "Inside Foot Passes", reps: "100 REPS · alternate feet", description: "Firm pass against a wall, cushion back control." },
  { day: 3, title: "Juggles (Low & High)", reps: "50 REPS · keep ball up", description: "Focus on soft ankle touch and soft drops." },
  { day: 4, title: "Sole Rolls", reps: "80 REPS · left to right", description: "Roll ball across body with sole of shoe." },
  { day: 5, title: "Figure 8 Dribble", reps: "10 LAPS · tight spaces", description: "Weave around two cones using inside/outside foot." },
  { day: 6, title: "Cruyff Turn Practice", reps: "30 REPS · fake shot & turn", description: "Sell the shot fake, drag ball behind standing leg." },
  { day: 7, title: "Stepover Mastery", reps: "40 REPS · explosive exit", description: "Step over ball with outside foot, push into space." },
  { day: 8, title: "Wall Rebounds (1-Touch)", reps: "100 REPS · quick reaction", description: "Stay light on feet, quick 1-touch pass return." },
  { day: 9, title: "Header Control", reps: "30 REPS · forehead touch", description: "Keep eyes on ball, power through with forehead." },
  { day: 10, title: "Outside Foot Push", reps: "60 REPS · change direction", description: "Quick sharp cut using outside of foot." },
  { day: 11, title: "L-Drag Turn", reps: "40 REPS · drag & push", description: "Drag back with sole, push behind standing leg." },
  { day: 12, title: "Aerial Touch Drop", reps: "30 REPS · high toss", description: "Toss high, deaden ball on first touch with laces." },
  { day: 13, title: "Elastic / Scissors", reps: "40 REPS · trick move", description: "Push outside then snap inside quickly." },
  { day: 14, title: "Thigh to Foot Juggle", reps: "40 REPS · combo touch", description: "Bump with thigh, control on foot, alternate sides." },
  { day: 15, title: "Half-Way Sprint Touch", reps: "20 REPS · speed dribble", description: "Dribble at full sprint, stop dead on line." },
  { day: 16, title: "Double Stepover", reps: "30 REPS · double fake", description: "Right foot stepover, left foot stepover, explode." },
  { day: 17, title: "Wall Volley Cushion", reps: "50 REPS · air control", description: "Volley into wall, cushion on foot before ground." },
  { day: 18, title: "Maradona Roulette", reps: "25 REPS · 360 spin", description: "Sole drag onto ball, spin body around defender." },
  { day: 19, title: "Cone Slalom Fast", reps: "15 LAPS · speed agility", description: "Sprint through 5 cones as fast as possible." },
  { day: 20, title: "Weak Foot Only Passes", reps: "100 REPS · non-dominant", description: "Pure non-dominant foot wall passing." },
  { day: 21, title: "Corner Flicks", reps: "30 REPS · heel flick", description: "Flick ball up with heel over defender." },
  { day: 22, title: "Chest Control to Volley", reps: "30 REPS · chest & shoot", description: "Cushion on chest, hit half-volley before bounce." },
  { day: 23, title: "V-Cut Feint", reps: "40 REPS · pull & push", description: "Pull back with sole, push diagonally opposite." },
  { day: 24, title: "Speed Dribble Zig-Zag", reps: "12 LAPS · agility burst", description: "Sharp 45-degree angle cuts at max speed." },
  { day: 25, title: "Rabona Pass Drill", reps: "20 REPS · cross-leg pass", description: "Wrap kicking leg behind standing leg for pass." },
  { day: 26, title: "First Touch Turn", reps: "50 REPS · turn on receive", description: "Receive ball facing back, turn on first touch." },
  { day: 27, title: "Juggle Challenge (100)", reps: "100 JUGGLES · uninterrupted", description: "Reach 100 juggles without ball hitting ground." },
  { day: 28, title: "Chip Shot Touch", reps: "30 REPS · lofted touch", description: "Get toe under ball, chip softly over obstacle." },
  { day: 29, title: "Pro Combination Drill", reps: "50 REPS · 3-move combo", description: "Toe tap -> L-drag -> Stepover -> Explode." },
  { day: 30, title: "Mastery Test (All Moves)", reps: "FINAL TEST · complete set", description: "Run full 10-minute skill circuit at 100% effort." },
];

export function ThirtyDayChallenge() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(1);

  // Completed days list stored in localStorage
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("completedDays") || "[]");
    } catch (e) {
      return [];
    }
  });

  // Daily reflections stored in localStorage object { 1: "answer", 2: "answer" }
  const [reflections, setReflections] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("reflections") || "{}");
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("completedDays", JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem("reflections", JSON.stringify(reflections));
  }, [reflections]);

  const currentDrill = DRILLS_CONFIG.find((d) => d.day === activeDay) || DRILLS_CONFIG[0];
  const isCompleted = completedDays.includes(activeDay);
  const completedCount = completedDays.length;

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    for (let i = 1; i <= 30; i++) {
      if (completedDays.includes(i)) streak++;
      else break;
    }
    return streak;
  };
  const streakCount = calculateStreak();

  const toggleCompleteDay = () => {
    if (isCompleted) {
      setCompletedDays((prev) => prev.filter((d) => d !== activeDay));
    } else {
      setCompletedDays((prev) => [...prev, activeDay]);
    }
  };

  const handleReflectionChange = (e) => {
    setReflections((prev) => ({
      ...prev,
      [activeDay]: e.target.value,
    }));
  };

  return (
    <div className="space-y-4 pb-6 select-none">
      {/* ── Page Header Bar ── */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-xs font-bold text-[#FF4422] hover:text-[#FF6B35] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <h2 className="text-xl font-black uppercase text-white tracking-wider">
          30-DAY CHALLENGE
        </h2>

        <div className="px-3 py-1 rounded-full bg-[#FF4422] text-white text-[10px] font-black uppercase tracking-wider">
          DAY {activeDay}
        </div>
      </div>

      {/* ── SOCCER SKILLS CHALLENGE HEADER CARD ── */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#12151D] flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <CircleDot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              SOCCER SKILLS CHALLENGE
            </h3>
            <p className="text-[10px] font-semibold text-white/60">Player</p>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-black/40 text-white/40">
          <Trophy size={18} />
        </div>
      </div>

      {/* ── DAY COUNTER & STREAK ── */}
      <div className="text-center space-y-2 py-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">⚽</span>
          <span className="text-4xl font-black text-[#00AEEF]">{activeDay}</span>
          <span className="text-xs font-black text-white/60 uppercase">
            of 30 · {currentDrill.title}
          </span>
        </div>

        {/* Streak Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4422]/15 border border-[#FF4422]/30 text-[#FF4422] text-[10px] font-black uppercase">
          <Flame size={12} className="animate-pulse" />
          <span>
            {streakCount}-DAY STREAK · {completedCount}/30 DONE
          </span>
        </div>
      </div>

      {/* ── TODAY'S DRILL CARD ── */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#FF4422]/40 bg-[#141012] space-y-3 shadow-xl">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF4422] block">
          TODAY'S DRILL
        </span>

        <div>
          <h3 className="text-xl font-black text-white">{currentDrill.title}</h3>
          <p className="text-xs font-bold text-white/70 mt-0.5">
            {currentDrill.reps}
          </p>
        </div>

        <p className="text-xs text-white/80 leading-relaxed font-medium">
          {currentDrill.description}
        </p>

        <button
          type="button"
          onClick={toggleCompleteDay}
          className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            isCompleted
              ? "bg-[#10B981] text-white hover:bg-emerald-600 shadow-emerald-500/30"
              : "bg-[#FF4422] text-white hover:bg-[#FF6B35] shadow-[#FF4422]/30"
          }`}
        >
          <Check size={16} strokeWidth={3} />
          <span>
            {isCompleted ? `DAY ${activeDay} COMPLETED!` : `MARK DAY ${activeDay} COMPLETE`}
          </span>
        </button>
      </div>

      {/* ── REFLECT CARD ── */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#12151D] space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 block">
          REFLECT
        </label>
        <textarea
          rows={3}
          placeholder="Write your answer here..."
          value={reflections[activeDay] || ""}
          onChange={handleReflectionChange}
          className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-white text-xs font-medium focus:outline-none focus:border-[#00AEEF] placeholder:text-white/30 resize-none"
        />
      </div>

      {/* ── INSPIRATIONAL QUOTE CARD (Circled in yellow in reference image) ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#10B981] text-white space-y-1.5 shadow-xl border border-emerald-400/40">
        <p className="text-lg sm:text-xl font-black italic tracking-wide text-yellow-300 leading-snug">
          “Play like you always have the ball”
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100/90">
          — Coach Clem Murdock · Footballer Athletics™
        </p>
      </div>

      {/* ── YOUR 30-DAY PROGRESS GRID (5x6 Grid of 30 Days) ── */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 px-0.5">
          YOUR 30-DAY PROGRESS
        </h3>

        <div className="grid grid-cols-6 gap-2">
          {DRILLS_CONFIG.map((item) => {
            const isDone = completedDays.includes(item.day);
            const isActive = activeDay === item.day;

            return (
              <button
                key={item.day}
                type="button"
                onClick={() => setActiveDay(item.day)}
                className={`h-11 rounded-xl font-black text-xs transition-all flex flex-col items-center justify-center relative border ${
                  isDone
                    ? "bg-[#10B981] text-white border-emerald-400"
                    : isActive
                      ? "bg-[#12151D] text-[#FF4422] border-2 border-[#FF4422] shadow-lg shadow-[#FF4422]/20"
                      : "bg-[#12151D] text-white/60 border-white/10 hover:border-white/30"
                }`}
              >
                <span>{item.day}</span>
                {isDone && <Check size={10} strokeWidth={3} className="absolute bottom-1 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      <SectionActionBar sectionKey="challenge" />
    </div>
  );
}
