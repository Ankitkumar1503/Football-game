import React, { useState, useEffect } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { useCumulativeStats } from "../../hooks/useCumulativeStats";
import { SectionActionBar } from "../ui/SectionActionBar";
import { User, ShieldCheck, Footprints, Edit2, Trophy, Activity, Zap, Flame, Clock, Award } from "lucide-react";

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
      freeKicks: "",
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
    const careerKeys = ["totalYearsPlaying", "totalHoursTrained", "totalSessions", "totalGames", "totalGoals", "totalPenalties", "totalCornerKicks", "totalThrowIns", "shotsOnTarget", "tacklesMade", "headers", "yellowCards", "freeKicks"];

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
  const playerClub = formData.club || formData.team || "Club Unassigned";
  const activeFoot = (formData.activeFooter || session?.activeFooter || "RIGHT").toUpperCase();

  const liveTouches = cumulativeStats.totalTouches || 0;
  const liveSessions = cumulativeStats.totalSessions || 0;
  const liveGoals = cumulativeStats.totalGoals || 0;
  const liveHours = cumulativeStats.totalHoursTrained || 0;

  return (
    <div className="space-y-4 pb-4">
      
      {/* ── Title & On-Device Badge ── */}
      <div className="flex items-center justify-between py-1">
        <h2 className="text-xl font-black uppercase text-[#FF4422] tracking-wider text-glow">
          PLAYER STATS
        </h2>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase">
          <ShieldCheck size={12} />
          <span>ON-DEVICE LIFETIME DATA</span>
        </div>
      </div>

      {/* ── Player Header Card ── */}
      <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141720] via-[#10131B] to-[#0D0F16] space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4422] to-[#E03311] text-white flex items-center justify-center font-black text-xl shadow-lg border border-white/20">
            {playerName.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-0.5">
            <h3 className="text-lg font-black uppercase text-white leading-tight">
              {playerName}
            </h3>
            <p className="text-xs font-semibold text-white/60">
              {playerClub}
            </p>
          </div>
        </div>

        {/* Foot Preference Selector Pills */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
          <button
            type="button"
            onClick={() => handleFootSelect("LEFT")}
            className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeFoot === "LEFT"
                ? "bg-[#FF4422] text-white shadow-lg shadow-[#FF4422]/25"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
            }`}
          >
            <Footprints size={14} />
            <span>LEFT FOOTER</span>
          </button>

          <button
            type="button"
            onClick={() => handleFootSelect("RIGHT")}
            className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeFoot === "RIGHT"
                ? "bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/25"
                : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
            }`}
          >
            <Footprints size={14} />
            <span>RIGHT FOOTER</span>
          </button>
        </div>
      </div>

      {/* ── CAREER TOTALS ── */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            CAREER TOTALS — TAP TO EDIT
          </h3>
          <Edit2 size={12} className="text-white/40" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Touches */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">TOTAL TOUCHES (LIFETIME)</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#F59E0B]">{liveTouches}</span>
              <input
                id="totalTouches"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#F59E0B]"
                value={formData.totalTouches || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Goals Scored */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">GOALS SCORED</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#FF4422]">{liveGoals || formData.totalGoals || 0}</span>
              <input
                id="totalGoals"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#FF4422]"
                value={formData.totalGoals || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Total Games */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">TOTAL GAMES</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#00AEEF]">{formData.totalGames || 0}</span>
              <input
                id="totalGames"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#00AEEF]"
                value={formData.totalGames || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Shots on Target */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">SHOTS ON TARGET</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#F59E0B]">{formData.shotsOnTarget || 0}</span>
              <input
                id="shotsOnTarget"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#F59E0B]"
                value={formData.shotsOnTarget || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tackles Made */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">TACKLES MADE</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-white">{formData.tacklesMade || 0}</span>
              <input
                id="tacklesMade"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-white"
                value={formData.tacklesMade || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Penalties Taken */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">PENALTIES TAKEN</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#FF4422]">{formData.totalPenalties || 0}</span>
              <input
                id="totalPenalties"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#FF4422]"
                value={formData.totalPenalties || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Corner Kicks */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">CORNER KICKS</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#00AEEF]">{formData.totalCornerKicks || 0}</span>
              <input
                id="totalCornerKicks"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#00AEEF]"
                value={formData.totalCornerKicks || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Headers */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">HEADERS</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#F59E0B]">{formData.headers || 0}</span>
              <input
                id="headers"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#F59E0B]"
                value={formData.headers || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── DEVELOPMENT STATS ── */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70 px-1">
          DEVELOPMENT & TRAINING
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Years Playing */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">YEARS PLAYING</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#FF4422]">{formData.totalYearsPlaying || 0}</span>
              <input
                id="totalYearsPlaying"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#FF4422]"
                value={formData.totalYearsPlaying || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Hours Trained */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">HOURS TRAINED</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#00AEEF]">{liveHours || formData.totalHoursTrained || 0}</span>
              <input
                id="totalHoursTrained"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#00AEEF]"
                value={formData.totalHoursTrained || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Total Sessions */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">TOTAL SESSIONS</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-[#10B981]">{liveSessions || formData.totalSessions || 0}</span>
              <input
                id="totalSessions"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-[#10B981]"
                value={formData.totalSessions || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Free Kicks */}
          <div className="p-3 rounded-xl border border-white/10 bg-[#12151D] space-y-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-white/60">FREE KICKS</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-white">{formData.freeKicks || 0}</span>
              <input
                id="freeKicks"
                type="number"
                placeholder="0"
                className="w-14 bg-black/40 text-white text-xs font-bold text-center py-1 rounded-lg border border-white/15 focus:outline-none focus:border-white"
                value={formData.freeKicks || ""}
                onChange={handleChange}
              />
            </div>
          </div>
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
