import React, { useState, useEffect } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { useCumulativeStats } from "../../hooks/useCumulativeStats";
import { SectionActionBar } from "../ui/SectionActionBar";
import { ShieldCheck, Edit2 } from "lucide-react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function PlayerStats() {
  const { session, updateSession } = useActiveSession();
  const cumulativeStats = useCumulativeStats();

  const [formData, setFormData] = useState(() => {
    let profile = {
      fullName: "",
      dateOfBirth: "",
      age: "",
      cellPhone: "",
      school: "",
      academy: "",
      club: "",
      team: "",
      position: "",
      activeFooter: "",
    };
    let career = {
      totalYearsPlaying: "",
      totalHoursTrained: "",
      totalSessions: "",
      totalGames: "",
      totalGoals: "",
      totalPenalties: "",
      totalCornerKicks: "",
      totalThrowIns: "",
      shotsOnTarget: "",
      tacklesMade: "",
      headers: "",
      yellowCards: "",
      redCards: "",
      subIn: "",
      subOut: "",
      injured: "",
      missedGames: "",
      freeKicks: "",
      recoveryDays: "",
    };

    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("playerProfile");
      const savedCareer = localStorage.getItem("playerCareerStats");
      if (savedProfile) {
        try { profile = { ...profile, ...JSON.parse(savedProfile) }; } catch (e) {}
      }
      if (savedCareer) {
        try { career = { ...career, ...JSON.parse(savedCareer) }; } catch (e) {}
      }
    }
    return { ...profile, ...career };
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (session.id && !isLoaded) {
      const savedProfile = localStorage.getItem("playerProfile");
      const savedCareer = localStorage.getItem("playerCareerStats");
      let data = {};
      if (savedProfile) try { data = { ...data, ...JSON.parse(savedProfile) }; } catch (e) {}
      if (savedCareer) try { data = { ...data, ...JSON.parse(savedCareer) }; } catch (e) {}

      if (Object.keys(data).length > 0) {
        setFormData((prev) => ({ ...prev, ...data }));
      }
      setIsLoaded(true);
    }
  }, [session, isLoaded]);

  const debouncedData = useDebounce(formData, 800);

  useEffect(() => {
    const profileKeys = ["fullName", "dateOfBirth", "age", "cellPhone", "school", "academy", "club", "team", "position", "activeFooter"];
    const careerKeys = [
      "totalYearsPlaying",
      "totalHoursTrained",
      "totalSessions",
      "totalGames",
      "totalGoals",
      "totalPenalties",
      "totalCornerKicks",
      "totalThrowIns",
      "shotsOnTarget",
      "tacklesMade",
      "headers",
      "yellowCards",
      "redCards",
      "subIn",
      "subOut",
      "injured",
      "missedGames",
      "freeKicks",
      "recoveryDays",
    ];

    let existingProfile = {};
    let existingCareer = {};
    try {
      const savedProfile = localStorage.getItem("playerProfile");
      if (savedProfile) existingProfile = JSON.parse(savedProfile);
      const savedCareer = localStorage.getItem("playerCareerStats");
      if (savedCareer) existingCareer = JSON.parse(savedCareer);
    } catch (e) {}

    const profileData = { ...existingProfile };
    const careerData = { ...existingCareer };

    profileKeys.forEach((key) => {
      if (debouncedData[key] !== undefined) profileData[key] = debouncedData[key];
    });
    careerKeys.forEach((key) => {
      if (debouncedData[key] !== undefined) careerData[key] = debouncedData[key];
    });

    localStorage.setItem("playerProfile", JSON.stringify(profileData));
    localStorage.setItem("playerCareerStats", JSON.stringify(careerData));

    if (session.id && isLoaded) {
      updateSession({
        playerName: profileData.fullName,
        position: profileData.position,
        club: profileData.club,
        team: profileData.team,
        age: profileData.age,
        totalYearsPlaying: careerData.totalYearsPlaying,
        totalHoursTrained: careerData.totalHoursTrained,
        activeFooter: profileData.activeFooter,
      });
    }
  }, [debouncedData, session.id, isLoaded]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFootSelect = (foot) => {
    setFormData((prev) => ({ ...prev, activeFooter: foot }));
  };

  const playerName = formData.fullName || session?.playerName || "PLAYER";
  const activeFoot = (formData.activeFooter || session?.activeFooter || "RIGHT").toUpperCase();
  const isRightFoot = activeFoot === "RIGHT";

  const liveTouches = cumulativeStats.totalTouches || 0;
  const liveSessions = cumulativeStats.totalSessions || 0;
  const liveGoals = cumulativeStats.totalGoals || 0;
  const liveHours = cumulativeStats.totalHoursTrained || 0;

  const todayStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const StatCard = ({ id, label, displayValue, rawValue, isYellow = false, colorClass = "text-white" }) => (
    <div
      className={`p-3 rounded-xl bg-[#12151D] space-y-1 flex flex-col justify-between ${
        isYellow
          ? "border border-yellow-400/50 shadow-[0_0_8px_rgba(250,204,21,0.12)]"
          : "border border-white/10"
      }`}
    >
      <span
        className={`text-[9px] font-black uppercase tracking-wider block ${
          isYellow ? "text-yellow-400" : "text-white/60"
        }`}
      >
        {label}
      </span>
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className={`text-2xl font-black ${isYellow ? "text-yellow-400" : colorClass}`}>
          {displayValue !== undefined && displayValue !== null ? displayValue : 0}
        </span>
        <input
          id={id}
          type="number"
          placeholder="0"
          className={`w-14 bg-black/40 text-xs font-bold text-center py-1 rounded-lg border focus:outline-none ${
            isYellow
              ? "text-yellow-400 border-yellow-400/30 focus:border-yellow-400"
              : "text-white border-white/15 focus:border-white"
          }`}
          value={rawValue || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pb-6">
      {/* ── Title Header ── */}
      <div className="flex items-center justify-between py-1">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider">
          PLAYER STATS
        </h2>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase">
          <ShieldCheck size={12} />
          <span>ON-DEVICE LIFETIME DATA</span>
        </div>
      </div>

      {/* ── GREEN STADIUM CARD ── */}
      <div className="relative rounded-2xl p-4 shadow-2xl overflow-hidden text-white space-y-3.5 border border-emerald-500/30 bg-gradient-to-b from-[#14532D] via-[#0F3E22] to-[#0A2916]">
        {/* Background Pitch Lines */}
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

        {/* Top Header Row: Name & Yellow Stick Figure Icon */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">
              PLAYER
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-none">
              {playerName}
            </h1>
            <p className="text-[11px] font-medium text-emerald-200/90 mt-1">
              {todayStr}
            </p>
          </div>

          {/* Yellow Stick Figure Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center">
            <img
              src={isRightFoot ? "/right_foot.png" : "/left_foot.png"}
              alt="Stick Figure Icon"
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
            />
          </div>
        </div>

        {/* 3 Middle Stat Boxes */}
        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">{liveTouches}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              TOUCHES
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">{liveSessions}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              SESSIONS
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-2.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-white">{liveGoals}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
              GOALS
            </div>
          </div>
        </div>

        {/* Foot Preference Selector Pills */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 relative z-10">
          <button
            type="button"
            onClick={() => handleFootSelect("LEFT")}
            className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
              activeFoot === "LEFT"
                ? "bg-white/20 text-white border-white/40 shadow-md backdrop-blur-md"
                : "bg-black/30 text-white/70 hover:bg-black/50 border-white/10"
            }`}
          >
            <div className="w-5 h-5 rounded-full border border-yellow-400 flex items-center justify-center p-0.5">
              <img src="/left_foot.png" alt="Left" className="w-full h-full object-contain" />
            </div>
            <span>LEFT FOOTER</span>
          </button>

          <button
            type="button"
            onClick={() => handleFootSelect("RIGHT")}
            className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
              activeFoot === "RIGHT"
                ? "bg-white/20 text-white border-white/40 shadow-md backdrop-blur-md"
                : "bg-black/30 text-white/70 hover:bg-black/50 border-white/10"
            }`}
          >
            <div className="w-5 h-5 rounded-full border border-yellow-400 flex items-center justify-center p-0.5">
              <img src="/right_foot.png" alt="Right" className="w-full h-full object-contain" />
            </div>
            <span>RIGHT FOOTER</span>
          </button>
        </div>

        {/* Community Footers Live Stats Breakdown */}
        <div className="space-y-2 pt-2 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black text-[#FF4422]">12,847</div>
              <div className="text-[8px] font-black uppercase tracking-wider text-[#FF4422]">
                LEFT FOOTERS
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-[#00AEEF]">19,204</div>
              <div className="text-[8px] font-black uppercase tracking-wider text-[#00AEEF]">
                RIGHT FOOTERS
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden flex">
            <div className="h-full bg-[#FF4422] w-[40%]" />
            <div className="h-full bg-[#00AEEF] w-[60%]" />
          </div>
        </div>
      </div>

      {/* ── QUICK STATS SECTION ── */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-sm font-black uppercase tracking-wider text-yellow-400 px-0.5">
          QUICK STATS
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-xl border border-yellow-400/30 bg-[#12151D] space-y-1 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
              TODAYS TOUCHES
            </span>
            <div className="text-3xl font-black text-[#FF4422]">
              {cumulativeStats.todayTouches || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#00AEEF]/30 bg-[#12151D] space-y-1 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
              TOUCHES THIS WEEK
            </span>
            <div className="text-3xl font-black text-[#00AEEF]">
              {cumulativeStats.weekTouches || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#10B981]/30 bg-[#12151D] space-y-1 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
              TOUCHES THIS MONTH
            </span>
            <div className="text-3xl font-black text-[#10B981]">
              {cumulativeStats.monthTouches || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#F59E0B]/30 bg-[#12151D] space-y-1 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400 block">
              TOUCHES THIS SEASON
            </span>
            <div className="text-3xl font-black text-[#F59E0B]">
              {liveTouches}
            </div>
          </div>
        </div>
      </div>

      {/* ── CAREER TOTALS — TAP A NUMBER TO EDIT ── */}
      <div className="space-y-2 pt-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            CAREER TOTALS — TAP A NUMBER TO EDIT
          </h3>
          <Edit2 size={12} className="text-white/40" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            id="totalTouches"
            label="TOTAL TOUCHES (LIFETIME)"
            displayValue={liveTouches}
            rawValue={formData.totalTouches}
            colorClass="text-[#F59E0B]"
          />
          <StatCard
            id="totalGoals"
            label="GOALS SCORED"
            displayValue={liveGoals || formData.totalGoals || 0}
            rawValue={formData.totalGoals}
            colorClass="text-[#FF4422]"
          />
          <StatCard
            id="totalGames"
            label="TOTAL GAMES"
            displayValue={formData.totalGames || 0}
            rawValue={formData.totalGames}
            colorClass="text-[#00AEEF]"
          />
          <StatCard
            id="shotsOnTarget"
            label="SHOTS ON TARGET"
            displayValue={formData.shotsOnTarget || 0}
            rawValue={formData.shotsOnTarget}
            colorClass="text-[#F59E0B]"
          />
          <StatCard
            id="tacklesMade"
            label="TACKLES MADE"
            displayValue={formData.tacklesMade || 0}
            rawValue={formData.tacklesMade}
            colorClass="text-white"
          />
          <StatCard
            id="totalPenalties"
            label="PENALTIES TAKEN"
            displayValue={formData.totalPenalties || 0}
            rawValue={formData.totalPenalties}
            colorClass="text-[#FF4422]"
          />
          <StatCard
            id="totalCornerKicks"
            label="CORNER KICKS"
            displayValue={formData.totalCornerKicks || 0}
            rawValue={formData.totalCornerKicks}
            colorClass="text-[#00AEEF]"
          />
          <StatCard
            id="headers"
            label="HEADERS"
            displayValue={formData.headers || 0}
            rawValue={formData.headers}
            colorClass="text-[#F59E0B]"
          />
          <StatCard
            id="totalThrowIns"
            label="THROW-INS"
            displayValue={formData.totalThrowIns || 0}
            rawValue={formData.totalThrowIns}
            colorClass="text-white"
          />
          <StatCard
            id="freeKicks"
            label="FREE KICKS"
            displayValue={formData.freeKicks || 0}
            rawValue={formData.freeKicks}
            colorClass="text-white"
          />

          {/* Yellow Bordered Cards (Yellow Card, Red Card, Sub In, Sub Out, Injured, Missed Game) */}
          <StatCard
            id="yellowCards"
            label="YELLOW CARD"
            displayValue={formData.yellowCards || 0}
            rawValue={formData.yellowCards}
            isYellow={true}
          />
          <StatCard
            id="redCards"
            label="RED CARD"
            displayValue={formData.redCards || 0}
            rawValue={formData.redCards}
            isYellow={true}
          />
          <StatCard
            id="subIn"
            label="SUB IN"
            displayValue={formData.subIn || 0}
            rawValue={formData.subIn}
            isYellow={true}
          />
          <StatCard
            id="subOut"
            label="SUB OUT"
            displayValue={formData.subOut || 0}
            rawValue={formData.subOut}
            isYellow={true}
          />
          <StatCard
            id="injured"
            label="INJURED"
            displayValue={formData.injured || 0}
            rawValue={formData.injured}
            isYellow={true}
          />
          <StatCard
            id="missedGames"
            label="MISSED GAME"
            displayValue={formData.missedGames || 0}
            rawValue={formData.missedGames}
            isYellow={true}
          />
        </div>
      </div>

      {/* ── DEVELOPMENT SECTION ── */}
      <div className="space-y-2 pt-3">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 px-1">
          DEVELOPMENT
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            id="totalYearsPlaying"
            label="YEARS PLAYING"
            displayValue={formData.totalYearsPlaying || 0}
            rawValue={formData.totalYearsPlaying}
            colorClass="text-white"
          />
          <StatCard
            id="totalHoursTrained"
            label="HOURS TRAINED"
            displayValue={liveHours || formData.totalHoursTrained || 0}
            rawValue={formData.totalHoursTrained}
            colorClass="text-white"
          />
          <StatCard
            id="totalSessions"
            label="TOTAL SESSIONS"
            displayValue={liveSessions || formData.totalSessions || 0}
            rawValue={formData.totalSessions}
            colorClass="text-white"
          />
          <StatCard
            id="recoveryDays"
            label="RECOVERY DAYS"
            displayValue={formData.recoveryDays || 0}
            rawValue={formData.recoveryDays}
            isYellow={true}
          />
        </div>
      </div>

      {/* ── Action Buttons Bar ── */}
      <SectionActionBar
        onReset={() => {
          if (confirm("Reset Player Stats?")) {
            localStorage.removeItem("playerCareerStats");
            window.location.reload();
          }
        }}
        sectionKey="stats"
      />
    </div>
  );
}
