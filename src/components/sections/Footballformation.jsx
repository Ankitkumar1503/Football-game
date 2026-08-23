import React, { useState, useEffect } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";
import { SectionActionBar } from "../ui/SectionActionBar";
import { ShieldCheck, Calendar, Users, Trophy } from "lucide-react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const FORMATION_POSITIONS = [
  // ATTACK
  { number: 11, label: "L WING", group: "ATTACK" },
  { number: 9, label: "STRIKER", group: "ATTACK" },
  { number: 7, label: "R WING", group: "ATTACK" },

  // MIDFIELD
  { number: 10, label: "L MID", group: "MIDFIELD" },
  { number: 6, label: "CENTRE", group: "MIDFIELD" },
  { number: 8, label: "R MID", group: "MIDFIELD" },

  // DEFENCE
  { number: 3, label: "L BACK", group: "DEFENCE" },
  { number: 5, label: "CB", group: "DEFENCE" },
  { number: 4, label: "CB", group: "DEFENCE" },
  { number: 2, label: "R BACK", group: "DEFENCE" },

  // GOALKEEPER
  { number: 1, label: "GOALKEEPER", group: "GOALKEEPER" },
];

export function FootballFormation({ isPdf = false }) {
  const { reflection, updateReflection } = useActiveSession();
  const [hydrated, setHydrated] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("footballFormation");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
    }
    return {
      teamName: "",
      ageGroup: "U16",
      date: new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      opponent: "",
      players: {
        1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: ""
      },
    };
  });

  useEffect(() => {
    if (!hydrated && reflection?.formation) {
      setFormData({
        teamName: reflection.formation.teamName ?? "",
        ageGroup: reflection.formation.ageGroup ?? "U16",
        date: reflection.formation.date ?? "",
        opponent: reflection.formation.opponent ?? "",
        players: reflection.formation.players ?? {
          1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: ""
        },
      });
      setHydrated(true);
    }
  }, [reflection, hydrated]);

  const debouncedData = useDebounce(formData, 800);

  useEffect(() => {
    localStorage.setItem("footballFormation", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (debouncedData) {
      updateReflection({ formation: debouncedData });
    }
  }, [debouncedData, updateReflection]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlayerSlotChange = (posNumber, lineIndex, value) => {
    const rawVal = formData.players[posNumber] || "";
    const slots = rawVal.split(",");
    while (slots.length < 3) slots.push("");
    slots[lineIndex] = value;

    setFormData((prev) => ({
      ...prev,
      players: { ...prev.players, [posNumber]: slots.join(",") },
    }));
  };

  return (
    <div className="space-y-4 pb-4 select-none">
      {/* ── Title Bar ── */}
      <div className="flex items-center justify-between py-1">
        <h2 className="text-xl font-black uppercase text-[#FF4422] tracking-wider text-glow">
          STARTING LINEUP
        </h2>
        <span className="text-[10px] font-bold text-white/50 tracking-wider">
          TACTICAL SHEET
        </span>
      </div>

      {/* ── Match & Team Info Inputs ── */}
      <div className="p-3.5 rounded-2xl border border-white/10 bg-[#12151D] space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
              TEAM
            </label>
            <input
              type="text"
              placeholder="Club Name"
              value={formData.teamName}
              onChange={(e) => handleInputChange("teamName", e.target.value)}
              className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
              AGE GROUP
            </label>
            <input
              type="text"
              placeholder="U16"
              value={formData.ageGroup}
              onChange={(e) => handleInputChange("ageGroup", e.target.value)}
              className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
              DATE
            </label>
            <input
              type="text"
              placeholder="Date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-wider text-white/60 mb-1">
              OPPONENT
            </label>
            <input
              type="text"
              placeholder="Opponent"
              value={formData.opponent}
              onChange={(e) => handleInputChange("opponent", e.target.value)}
              className="w-full bg-black/40 text-white px-3 py-2 text-xs font-semibold rounded-xl border border-white/15 focus:outline-none focus:border-[#FF4422]"
            />
          </div>
        </div>
      </div>

      {/* ── Stadium Pitch Diagram ── */}
      <div className="relative rounded-2xl p-3 sm:p-4 border-2 border-emerald-500/40 bg-gradient-to-b from-[#0E4D2B] via-[#0B3D22] to-[#062916] space-y-4 shadow-2xl overflow-hidden">
        
        {/* Pitch Center Circle Line Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border-2 border-white/15 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/15 pointer-events-none" />

        {/* 1. ATTACK SECTION */}
        <div className="space-y-2 relative z-10">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 bg-black/40 px-3 py-0.5 rounded-full border border-white/10">
              ⚽ ATTACK
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {FORMATION_POSITIONS.filter((p) => p.group === "ATTACK").map((pos) => (
              <PositionCard
                key={pos.number}
                pos={pos}
                value={formData.players[pos.number]}
                onSlotChange={(idx, val) => handlePlayerSlotChange(pos.number, idx, val)}
              />
            ))}
          </div>
        </div>

        {/* 2. MIDFIELD SECTION */}
        <div className="space-y-2 relative z-10 pt-1">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 bg-black/40 px-3 py-0.5 rounded-full border border-white/10">
              🎯 MIDFIELD
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {FORMATION_POSITIONS.filter((p) => p.group === "MIDFIELD").map((pos) => (
              <PositionCard
                key={pos.number}
                pos={pos}
                value={formData.players[pos.number]}
                onSlotChange={(idx, val) => handlePlayerSlotChange(pos.number, idx, val)}
              />
            ))}
          </div>
        </div>

        {/* 3. DEFENCE SECTION */}
        <div className="space-y-2 relative z-10 pt-1">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 bg-black/40 px-3 py-0.5 rounded-full border border-white/10">
              🛡️ DEFENCE
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {FORMATION_POSITIONS.filter((p) => p.group === "DEFENCE").map((pos) => (
              <PositionCard
                key={pos.number}
                pos={pos}
                value={formData.players[pos.number]}
                onSlotChange={(idx, val) => handlePlayerSlotChange(pos.number, idx, val)}
                isCompact
              />
            ))}
          </div>
        </div>

        {/* 4. GOALKEEPER SECTION */}
        <div className="space-y-2 relative z-10 pt-1">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 bg-black/40 px-3 py-0.5 rounded-full border border-white/10">
              🧤 GOALKEEPER
            </span>
          </div>

          <div className="max-w-xs mx-auto">
            {FORMATION_POSITIONS.filter((p) => p.group === "GOALKEEPER").map((pos) => (
              <PositionCard
                key={pos.number}
                pos={pos}
                value={formData.players[pos.number]}
                onSlotChange={(idx, val) => handlePlayerSlotChange(pos.number, idx, val)}
                isGk
              />
            ))}
          </div>
        </div>

      </div>

      {/* ── Action Buttons Bar ── */}
      <SectionActionBar
        onReset={() => {
          if (confirm("Reset Starting Lineup formation?")) {
            localStorage.removeItem("footballFormation");
            window.location.reload();
          }
        }}
        onSave={() => updateReflection({ formation: formData })}
        sectionKey="lineup"
      />

    </div>
  );
}

function PositionCard({ pos, value, onSlotChange, isCompact = false, isGk = false }) {
  const slots = (value || ",,").split(",");
  const starter = slots[0] || "";
  const sub1 = slots[1] || "";
  const sub2 = slots[2] || "";

  return (
    <div className={`p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 flex flex-col items-center space-y-1.5 ${isGk ? "border-amber-400/50" : ""}`}>
      {/* Position Header & Number Badge */}
      <div className="flex items-center gap-1">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[9px] border ${isGk ? "bg-amber-500 text-black border-white" : "bg-black text-white border-white/40"}`}>
          {pos.number}
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider text-white">
          {pos.label}
        </span>
      </div>

      {/* 3 Input Slots */}
      <div className="w-full space-y-1">
        <input
          type="text"
          placeholder="Starter"
          value={starter}
          onChange={(e) => onSlotChange(0, e.target.value)}
          className="w-full bg-white/95 text-black px-1.5 py-1 text-[9px] font-bold rounded text-center border border-black/40 focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
        />

        <input
          type="text"
          placeholder="Sub 1"
          value={sub1}
          onChange={(e) => onSlotChange(1, e.target.value)}
          className="w-full bg-white/80 text-black px-1.5 py-1 text-[9px] font-bold rounded text-center border border-black/30 focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
        />

        <input
          type="text"
          placeholder="Sub 2"
          value={sub2}
          onChange={(e) => onSlotChange(2, e.target.value)}
          className="w-full bg-white/80 text-black px-1.5 py-1 text-[9px] font-bold rounded text-center border border-black/30 focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
        />
      </div>
    </div>
  );
}
