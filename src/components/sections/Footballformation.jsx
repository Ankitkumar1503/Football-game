import React, { useState, useEffect } from "react";
import { useActiveSession } from "../../hooks/useActiveSession";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function FootballFormation() {
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
      date: "",
      time: "",
      age: "",
      players: {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
        10: "",
        11: "",
      },
    };
  });

  useEffect(() => {
    if (!hydrated && reflection?.formation) {
      setFormData({
        teamName: reflection.formation.teamName ?? "",
        date: reflection.formation.date ?? "",
        time: reflection.formation.time ?? "",
        age: reflection.formation.age ?? "",
        players: reflection.formation.players ?? {
          1: "",
          2: "",
          3: "",
          4: "",
          5: "",
          6: "",
          7: "",
          8: "",
          9: "",
          10: "",
          11: "",
        },
      });
      setHydrated(true);
    }
  }, [reflection, hydrated]);

  const debouncedData = useDebounce(formData, 1000);

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

  const handlePlayerChange = (position, value) => {
    setFormData((prev) => ({
      ...prev,
      players: { ...prev.players, [position]: value },
    }));
  };

  const labelClass =
    "block text-[9px] font-black uppercase text-[var(--text-primary)] mb-1 tracking-widest";

  const inputClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-primary)] px-2 py-1 text-xs font-bold border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  return (
    <div className="mb-6">
      {/* ── Header ── */}
      <div className="text-center mb-4 border-b-2 border-[var(--text-primary)] pb-2">
        <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] tracking-widest">
          STARTING LINEUP
        </h2>
      </div>

      {/* ── DATE / TIME ── */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className={labelClass}>DATE</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>TIME</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── TEAM / AGE ── */}
      <div className="grid grid-cols-[1fr_80px] gap-3 mb-4">
        <div>
          <label className={labelClass}>TEAM</label>
          <input
            type="text"
            value={formData.teamName}
            onChange={(e) => handleInputChange("teamName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>AGE</label>
          <input
            type="text"
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Football Field ── */}
      {/* 
        Light mode: --color-accent = #06B6D4 (cyan) → field is cyan
        Dark mode:  --color-accent = #FF4422 (red)  → field is red/orange
        We use a slightly transparent version for the field body.
      */}
      <div
        className="relative aspect-[3/4] w-full max-w-md mx-auto border-2 border-white overflow-hidden"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        {/* ── Field Markings (all white) ── */}

        {/* Outer border */}
        <div className="absolute inset-[6px] border-2 border-white pointer-events-none" />

        {/* Center line */}
        <div className="absolute top-1/2 left-[6px] right-[6px] h-[2px] bg-white pointer-events-none" />

        {/* Center circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-0 pointer-events-none"
          style={{ paddingBottom: "22%" }}
        >
          <div className="absolute inset-0 border-2 border-white rounded-full" />
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full pointer-events-none" />

        {/* Top penalty box */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[45%] h-[14%] border-2 border-t-0 border-white pointer-events-none" />

        {/* Top goal box */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[25%] h-[7%] border-2 border-t-0 border-white pointer-events-none" />

        {/* Bottom penalty box */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[45%] h-[14%] border-2 border-b-0 border-white pointer-events-none" />

        {/* Bottom goal box */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[25%] h-[7%] border-2 border-b-0 border-white pointer-events-none" />

        {/* ── Player Positions ── */}

        {/* #9 — Striker — top center */}
        <PlayerPosition
          number={9}
          name={formData.players[9]}
          onChange={(v) => handlePlayerChange(9, v)}
          style={{ top: "5%", left: "50%", transform: "translateX(-50%)" }}
        />

        {/* #11 — Left Wing — upper left */}
        <PlayerPosition
          number={11}
          name={formData.players[11]}
          onChange={(v) => handlePlayerChange(11, v)}
          style={{ top: "14%", left: "13%" }}
        />

        {/* #7 — Right Wing — upper right */}
        <PlayerPosition
          number={7}
          name={formData.players[7]}
          onChange={(v) => handlePlayerChange(7, v)}
          style={{ top: "14%", right: "13%" }}
        />

        {/* #10 — Attacking Mid Left */}
        <PlayerPosition
          number={10}
          name={formData.players[10]}
          onChange={(v) => handlePlayerChange(10, v)}
          style={{ top: "31%", left: "23%" }}
        />

        {/* #8 — Attacking Mid Right */}
        <PlayerPosition
          number={8}
          name={formData.players[8]}
          onChange={(v) => handlePlayerChange(8, v)}
          style={{ top: "31%", right: "23%" }}
        />

        {/* #6 — Defensive Mid — center */}
        <PlayerPosition
          number={6}
          name={formData.players[6]}
          onChange={(v) => handlePlayerChange(6, v)}
          style={{
            top: "54%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* #3 — Left Back */}
        <PlayerPosition
          number={3}
          name={formData.players[3]}
          onChange={(v) => handlePlayerChange(3, v)}
          style={{ top: "51%", left: "9%" }}
        />

        {/* #2 — Right Back */}
        <PlayerPosition
          number={2}
          name={formData.players[2]}
          onChange={(v) => handlePlayerChange(2, v)}
          style={{ top: "51%", right: "9%" }}
        />

        {/* #5 — Left Center Back */}
        <PlayerPosition
          number={5}
          name={formData.players[5]}
          onChange={(v) => handlePlayerChange(5, v)}
          style={{ top: "69%", left: "23%" }}
        />

        {/* #4 — Right Center Back */}
        <PlayerPosition
          number={4}
          name={formData.players[4]}
          onChange={(v) => handlePlayerChange(4, v)}
          style={{ top: "69%", right: "23%" }}
        />

        {/* #1 — Goalkeeper — bottom center */}
        <PlayerPosition
          number={1}
          name={formData.players[1]}
          onChange={(v) => handlePlayerChange(1, v)}
          style={{ top: "84%", left: "50%", transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}

// ── Player Position Component ──────────────────────────────────────────────
// function PlayerPosition({ number, name, onChange, style }) {
//   return (
//     <div className="absolute" style={style}>
//       <div className="flex flex-col items-center gap-[2px]">
//         {/* Number badge */}
//         <div
//           className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shrink-0"
//           style={{ backgroundColor: "#111111" }}
//         >
//           <span className="text-white text-[9px] font-black leading-none">
//             {number}
//           </span>
//         </div>
//         {/* Name inputs — 3 stacked lines like the target image */}
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-20 bg-white/90 text-black px-1 py-[2px] text-[8px] font-bold border-none text-center focus:outline-none focus:ring-1 focus:ring-black"
//           placeholder=""
//         />
//         {/* Extra visual lines to match the "3 lines" look in the target */}
//         <div className="w-20 h-[2px] bg-white/70" />
//         <div className="w-20 h-[2px] bg-white/70" />
//       </div>
//     </div>
//   );
// }

function PlayerPosition({ number, name, onChange, style }) {
  const [line1, line2, line3] = (name || ",,").split(",");

  const handleLineChange = (lineIndex, value) => {
    const lines = (name || ",,").split(",");
    lines[lineIndex] = value;
    onChange(lines.join(","));
  };

  return (
    <div className="absolute" style={style}>
      <div className="flex flex-col items-center gap-[2px]">
        {/* Number badge */}
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shrink-0"
          style={{ backgroundColor: "#111111" }}
        >
          <span className="text-white text-[9px] font-black leading-none">
            {number}
          </span>
        </div>

        {/* 3 input lines */}
        {[line1, line2, line3].map((lineVal, i) => (
          <input
            key={i}
            type="text"
            value={lineVal || ""}
            onChange={(e) => handleLineChange(i, e.target.value)}
            className="w-20 bg-white/90 text-black px-1 py-[2px] text-[8px] font-bold border-none text-center focus:outline-none focus:ring-1 focus:ring-black"
            placeholder=""
          />
        ))}
      </div>
    </div>
  );
}
