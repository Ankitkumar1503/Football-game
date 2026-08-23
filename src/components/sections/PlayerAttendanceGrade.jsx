import React, { useState, useEffect } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { SectionActionBar } from "../ui/SectionActionBar";
import { Users, Calendar, Award } from "lucide-react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const GRADE_OPTIONS = [
  { id: "P", label: "P", full: "Poor", color: "bg-rose-500 text-white border-rose-400" },
  { id: "A", label: "A", full: "Average", color: "bg-[#F59E0B] text-white border-[#F59E0B]" },
  { id: "G", label: "G", full: "Good", color: "bg-[#00AEEF] text-white border-[#00AEEF]" },
  { id: "VG", label: "VG", full: "Very Good", color: "bg-emerald-500 text-white border-emerald-400" },
];

export function PlayerAttendanceGrade({ isPdf, pdfPart }) {
  const { reflection, updateReflection } = useActiveSession();
  const [hydrated, setHydrated] = useState(false);

  const [fullData, setFullData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("playerAttendance");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
    }
    return {
      metadata: {
        team: "",
        date: new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      },
      records: Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        name: `Player ${i + 1}`,
        grade: "G",
      })),
    };
  });

  useEffect(() => {
    if (!hydrated && reflection?.attendance) {
      setFullData({
        metadata: {
          team: reflection.attendance.metadata?.team ?? "",
          date: reflection.attendance.metadata?.date ?? "",
        },
        records: (reflection.attendance.records ?? []).map((r, i) => ({
          id: r.id || i + 1,
          name: r.name || `Player ${i + 1}`,
          grade: r.grade || (r.grades?.A ? "VG" : r.grades?.B ? "G" : r.grades?.C ? "A" : "G"),
        })),
      });
      setHydrated(true);
    }
  }, [reflection, hydrated]);

  const debouncedData = useDebounce(fullData, 800);

  useEffect(() => {
    localStorage.setItem("playerAttendance", JSON.stringify(fullData));
  }, [fullData]);

  useEffect(() => {
    if (debouncedData) {
      updateReflection({ attendance: debouncedData });
    }
  }, [debouncedData, updateReflection]);

  const handleMetadataChange = (field, value) => {
    setFullData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }));
  };

  const handlePlayerNameChange = (id, value) => {
    setFullData((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r.id === id ? { ...r, name: value } : r)),
    }));
  };

  const handleGradeSelect = (id, gradeId) => {
    setFullData((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r.id === id ? { ...r, grade: gradeId } : r)),
    }));
  };

  const handleReset = () => {
    if (confirm("Reset roster ratings?")) {
      setFullData((prev) => ({
        ...prev,
        records: prev.records.map((r) => ({ ...r, grade: "G" })),
      }));
    }
  };

  return (
    <div className="space-y-3 pb-1 select-none">
      {/* ── Title Bar ── */}
      <div className="flex items-center justify-between py-1">
        <h2 className="text-xl font-black uppercase text-[#FF4422] tracking-wider text-glow">
          TEAM ROSTER
        </h2>
        <span className="text-[10px] font-bold text-white/50 tracking-wider">
          SQUAD GRADING
        </span>
      </div>

      {/* ── Team & Date Header Inputs ── */}
      <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl border border-white/10 bg-[#12151D]">
        <div>
          <label className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
            TEAM
          </label>
          <input
            type="text"
            placeholder="Team Name"
            value={fullData.metadata.team}
            onChange={(e) => handleMetadataChange("team", e.target.value)}
            className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
            DATE
          </label>
          <input
            type="text"
            placeholder="Date"
            value={fullData.metadata.date}
            onChange={(e) => handleMetadataChange("date", e.target.value)}
            className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
          />
        </div>
      </div>

      {/* ── Grade Legend ── */}
      <div className="p-2.5 rounded-xl border border-white/10 bg-black/30 flex items-center justify-around">
        <span className="text-[9px] font-black uppercase text-white/60">GRADE:</span>
        <span className="text-[9px] font-black uppercase text-rose-400">P = Poor</span>
        <span className="text-[9px] font-black uppercase text-[#F59E0B]">A = Average</span>
        <span className="text-[9px] font-black uppercase text-[#00AEEF]">G = Good</span>
        <span className="text-[9px] font-black uppercase text-emerald-400">VG = Very Good</span>
      </div>

      {/* ── Player Roster List ── */}
      <div className="space-y-2">
        {fullData.records.slice(0, 16).map((player, idx) => (
          <div
            key={player.id}
            className="p-2.5 rounded-xl border border-white/10 bg-[#12151D] flex items-center justify-between gap-2"
          >
            {/* Player Index Badge & Name Input */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/15 text-white/70 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                {idx + 1}
              </span>
              <input
                type="text"
                value={player.name}
                onChange={(e) => handlePlayerNameChange(player.id, e.target.value)}
                className="w-full bg-transparent text-white text-xs font-bold border-none focus:outline-none focus:text-[#FF4422] truncate"
                placeholder={`Player ${idx + 1}`}
              />
            </div>

            {/* 4 Grade Buttons */}
            <div className="grid grid-cols-4 gap-1 flex-shrink-0">
              {GRADE_OPTIONS.map((opt) => {
                const isSelected = player.grade === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleGradeSelect(player.id, opt.id)}
                    className={`w-7 h-7 rounded-lg text-[9px] font-black uppercase transition-all duration-150 flex items-center justify-center ${
                      isSelected
                        ? `${opt.color} shadow-md scale-105`
                        : "bg-black/30 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Action Buttons Bar ── */}
      <SectionActionBar
        onReset={handleReset}
        onSave={() => updateReflection({ attendance: fullData })}
        sectionKey="roster"
      />
    </div>
  );
}
