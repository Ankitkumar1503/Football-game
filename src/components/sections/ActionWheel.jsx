import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveSession } from "../../hooks/useActiveSession";
import { db } from "../../lib/db";
import { SectionActionBar } from "../ui/SectionActionBar";
import {
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Target,
  Zap,
  Award,
  CircleDot,
  Shield,
  Flag,
  RotateCw,
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
  { id: "Penalty", label: "PENALTY", icon: Target },
  { id: "Keep-Up-Feet", label: "KEEP-UP-FEET", icon: Zap },
  { id: "Keep-Up-Head", label: "KEEP-UP-HEAD", icon: CircleDot },
];

const POSITIONS = [
  "Select Position",
  "Goalkeeper (GK)",
  "Center Back (CB)",
  "Left Back (LB)",
  "Right Back (RB)",
  "Defensive Midfielder (CDM)",
  "Central Midfielder (CM)",
  "Attacking Midfielder (CAM)",
  "Left Winger (LW)",
  "Right Winger (RW)",
  "Striker / Forward (ST)",
];

const MATCH_EVENTS_CONFIG = [
  { id: "Yellow Card", label: "YELLOW CARD", type: "yellow-card" },
  { id: "Red Card", label: "RED CARD", type: "red-card" },
  { id: "Missed Game", label: "MISSED GAME" },
  { id: "Sub In", label: "SUB IN" },
  { id: "Sub Out", label: "SUB OUT" },
  { id: "Injury", label: "INJURY" },
];

export function ActionWheel() {
  const navigate = useNavigate();
  const { stats, sessionId, addTouch, removeTouch, updateSession } = useActiveSession();
  const [selectedQuality, setSelectedQuality] = useState("Positive");
  const [lastLoggedAction, setLastLoggedAction] = useState(null);

  const getSavedProfile = () => {
    try {
      const raw = localStorage.getItem("playerProfile");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const initialProfile = getSavedProfile();

  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("touch_playerName") || initialProfile?.fullName || initialProfile?.playerName || "";
  });
  const [age, setAge] = useState(() => {
    return localStorage.getItem("touch_age") || (initialProfile?.age ? String(initialProfile.age) : "");
  });
  const [position, setPosition] = useState(() => {
    return localStorage.getItem("touch_position") || initialProfile?.position || "Select Position";
  });
  const [playerNumber, setPlayerNumber] = useState(() => {
    return localStorage.getItem("touch_number") || (initialProfile?.number || initialProfile?.jerseyNumber ? String(initialProfile?.number || initialProfile?.jerseyNumber) : "");
  });

  const [trainingLocation, setTrainingLocation] = useState(() => {
    return localStorage.getItem("trainingLocation") || "";
  });
  const [gameLocation, setGameLocation] = useState(() => {
    return localStorage.getItem("gameLocation") || "";
  });
  const [timeInTraining, setTimeInTraining] = useState(() => {
    return Number(localStorage.getItem("timeInTraining")) || 60;
  });
  const [minutesPlayed, setMinutesPlayed] = useState(() => {
    return Number(localStorage.getItem("minutesPlayed")) || 120;
  });

  useEffect(() => {
    localStorage.setItem("touch_playerName", playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem("touch_age", age);
  }, [age]);

  useEffect(() => {
    localStorage.setItem("touch_position", position);
  }, [position]);

  useEffect(() => {
    localStorage.setItem("touch_number", playerNumber);
  }, [playerNumber]);

  useEffect(() => {
    localStorage.setItem("trainingLocation", trainingLocation);
  }, [trainingLocation]);

  useEffect(() => {
    localStorage.setItem("gameLocation", gameLocation);
  }, [gameLocation]);

  useEffect(() => {
    localStorage.setItem("timeInTraining", timeInTraining);
  }, [timeInTraining]);

  useEffect(() => {
    localStorage.setItem("minutesPlayed", minutesPlayed);
  }, [minutesPlayed]);

  const handleActionTap = async (actionId) => {
    const isIndependent = [
      "Penalty",
      "Keep-Up-Feet",
      "Keep-Up-Head",
      "Yellow Card",
      "Red Card",
      "Missed Game",
      "Sub In",
      "Sub Out",
      "Injury",
    ].includes(actionId);

    const quality = isIndependent ? "Event" : selectedQuality;
    await addTouch(actionId, quality);
    setLastLoggedAction({ action: actionId, quality });
    setTimeout(() => setLastLoggedAction(null), 1200);
  };

  const handleEventTap = async (eventId) => {
    await addTouch(eventId, "Event");
    setLastLoggedAction({ action: eventId, quality: "Event" });
    setTimeout(() => setLastLoggedAction(null), 1200);
  };

  const handleEventDecrement = async (e, eventId) => {
    e.stopPropagation();
    if (removeTouch) {
      await removeTouch(eventId);
    }
  };

  const handleSaveSession = async () => {
    localStorage.setItem("touch_playerName", playerName);
    localStorage.setItem("touch_age", age);
    localStorage.setItem("touch_position", position);
    localStorage.setItem("touch_number", playerNumber);
    localStorage.setItem("trainingLocation", trainingLocation);
    localStorage.setItem("gameLocation", gameLocation);
    localStorage.setItem("timeInTraining", timeInTraining);
    localStorage.setItem("minutesPlayed", minutesPlayed);

    if (updateSession) {
      await updateSession({
        playerName,
        age,
        position,
        playerNumber,
        trainingLocation,
        gameLocation,
        timeInTraining,
        minutesPlayed,
      });
    }
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
    <div className="space-y-4 pb-6 select-none">
      {/* ── Page Header Bar ── */}
      <div className="flex items-center justify-between py-1">
        <h2 className="text-xl font-black uppercase text-white tracking-wider">
          TOUCH COUNTER
        </h2>

        <div className="px-2.5 py-0.5 rounded-full border border-red-500 text-red-500 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* ── GREEN SOCCER PITCH HERO CARD WITH YELLOW CIRCLE COUNTER ── */}
      <div className="relative rounded-2xl p-6 shadow-2xl overflow-hidden border border-emerald-500/30 bg-gradient-to-b from-[#14532D] via-[#0F3E22] to-[#0A2916] flex flex-col items-center justify-center min-h-[220px]">
        {/* Soccer Pitch Vector Markings */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 240"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white"
          >
            <rect x="15" y="15" width="370" height="210" rx="6" />
            <line x1="200" y1="15" x2="200" y2="225" />
            <circle cx="200" cy="120" r="45" />
            <circle cx="200" cy="120" r="2" fill="currentColor" />
            <rect x="15" y="60" width="70" height="120" />
            <rect x="315" y="60" width="70" height="120" />
          </svg>
        </div>

        {/* Central Yellow Ring Counter Gauge */}
        <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-yellow-400 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(250,204,21,0.3)] flex flex-col items-center justify-center space-y-0.5">
          <span className="text-4xl sm:text-5xl font-black text-yellow-400 tracking-tight drop-shadow-md">
            {total}
          </span>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/70">
            TOTAL TOUCHES
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-400">
            TOUCHES
          </span>

          {lastLoggedAction && (
            <div className="absolute -bottom-3 px-3 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#10B981] text-white shadow-lg animate-bounce">
              +{lastLoggedAction.action}
            </div>
          )}
        </div>
      </div>

      {/* ── POSITIVE vs NEGATIVE SUMMARY CARDS ── */}
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
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${positivePercent}%` }}
            />
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
            <div
              className="bg-rose-400 h-full transition-all duration-300"
              style={{ width: `${negativePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── QUALITY SELECTOR BANNER ── */}
      <div className="space-y-2 pt-1 text-center">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-yellow-400">
          HOW WAS THE PLAYERS FIRST TOUCH?
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
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
            <span>Positive</span>
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
            <span>Negative</span>
          </button>
        </div>
      </div>

      {/* ── 3-COLUMN MAIN ACTIONS GRID ── */}
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

      {/* ── 3-COLUMN INDEPENDENT EVENT COUNTERS GRID (CLEAN DARK/NEUTRAL CARDS) ── */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {MATCH_EVENTS_CONFIG.map((item) => {
          const count = stats[item.id] || 0;
          const isYellow = item.type === "yellow-card";
          const isRed = item.type === "red-card";

          return (
            <div
              key={item.id}
              onClick={() => handleEventTap(item.id)}
              className="group p-3 rounded-2xl border border-white/10 bg-[#12151D] hover:bg-white/[0.07] hover:border-white/20 active:scale-95 transition-all text-center flex flex-col items-center justify-between h-24 relative cursor-pointer select-none"
            >
              {/* Optional Decrement button when count > 0 */}
              {count > 0 && (
                <button
                  type="button"
                  title={`Decrease ${item.label}`}
                  onClick={(e) => handleEventDecrement(e, item.id)}
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-[10px] font-bold z-10 transition-colors"
                >
                  -
                </button>
              )}

              {/* Minimalist Icon / Badge */}
              {isYellow ? (
                <div className="w-5 h-5 rounded border border-yellow-400/80 bg-yellow-400/20 flex items-center justify-center">
                  <div className="w-2 h-2.5 bg-yellow-400 rounded-sm" />
                </div>
              ) : isRed ? (
                <div className="w-5 h-5 rounded border border-red-500/80 bg-red-500/20 flex items-center justify-center">
                  <div className="w-2 h-2.5 bg-red-500 rounded-sm" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded border border-white/20 bg-white/5 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-sm" />
                </div>
              )}

              <div className="space-y-0.5">
                <div
                  className={`text-base font-black ${
                    isYellow ? "text-yellow-400" : isRed ? "text-red-400" : "text-white"
                  }`}
                >
                  {count}
                </div>
                <div
                  className={`text-[8px] font-black uppercase tracking-wider ${
                    isYellow
                      ? "text-yellow-400/90"
                      : isRed
                      ? "text-red-400/90"
                      : "text-white/60 group-hover:text-white/90"
                  }`}
                >
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PLAYER & SESSION INFORMATION (4 NEW FIELDS + EXISTING LOCATIONS) ── */}
      <div className="space-y-3 pt-2">
        <div className="space-y-2">
          {/* Row 1: PLAYER NAME & AGE */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/70">
                PLAYER NAME
              </label>
              <input
                type="text"
                placeholder="Enter player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-yellow-400/70 placeholder:text-white/30"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/70">
                AGE
              </label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-yellow-400/70 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Row 2: PLAYER POSITION & NUMBER */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/70">
                PLAYER POSITION
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-[#12151D] border border-white/10 rounded-xl px-2.5 py-2 text-white text-xs font-semibold focus:outline-none focus:border-yellow-400/70"
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos} className="bg-[#12151D] text-white">
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-white/70">
                NUMBER
              </label>
              <input
                type="number"
                placeholder="Jersey Number"
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value)}
                className="w-full bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-yellow-400/70 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Row 3: TRAINING LOCATION (EXISTING) */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/70">
              TRAINING LOCATION
            </label>
            <input
              type="text"
              placeholder="Enter training location"
              value={trainingLocation}
              onChange={(e) => setTrainingLocation(e.target.value)}
              className="w-full bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-yellow-400/70 placeholder:text-white/30"
            />
          </div>

          {/* Row 4: GAME LOCATION (EXISTING) */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase tracking-wider text-white/70">
              GAME LOCATION
            </label>
            <input
              type="text"
              placeholder="Enter game location"
              value={gameLocation}
              onChange={(e) => setGameLocation(e.target.value)}
              className="w-full bg-[#12151D] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-yellow-400/70 placeholder:text-white/30"
            />
          </div>
        </div>

        {/* TIME IN TRAINING SLIDER */}
        {(() => {
          const timePercent = Math.min(100, Math.max(0, (timeInTraining / 180) * 100));
          const minutesPercent = Math.min(100, Math.max(0, (minutesPlayed / 180) * 100));
          return (
            <>
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-black uppercase tracking-wider text-white/70">
                  TIME IN TRAINING
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={timeInTraining}
                    onChange={(e) => setTimeInTraining(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #facc15 0%, #facc15 ${timePercent}%, rgba(255, 255, 255, 0.15) ${timePercent}%, rgba(255, 255, 255, 0.15) 100%)`,
                    }}
                    className="yellow-range-slider flex-1"
                  />
                  <span className="text-yellow-400 font-black text-sm whitespace-nowrap min-w-[85px] text-right">
                    {timeInTraining} Minutes
                  </span>
                </div>
              </div>

              {/* MINUTES PLAYED SLIDER */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-black uppercase tracking-wider text-white/70">
                  MINUTES PLAYED
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="5"
                    value={minutesPlayed}
                    onChange={(e) => setMinutesPlayed(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #facc15 0%, #facc15 ${minutesPercent}%, rgba(255, 255, 255, 0.15) ${minutesPercent}%, rgba(255, 255, 255, 0.15) 100%)`,
                    }}
                    className="yellow-range-slider flex-1"
                  />
                  <span className="text-yellow-400 font-black text-sm whitespace-nowrap min-w-[85px] text-right">
                    {minutesPlayed} Minutes
                  </span>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* ── Action Buttons Bar ── */}
      <SectionActionBar
        onReset={handleResetSessionTouches}
        onSave={handleSaveSession}
        sectionKey="touch-counter"
      />
    </div>
  );
}
