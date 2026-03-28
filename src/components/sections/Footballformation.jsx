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
    "w-full bg-[var(--bg-input)] text-[var(--text-input)] px-2 py-1 text-xs font-bold border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

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
      <div
        className="football-field relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden"
        style={{ backgroundColor: "var(--field-bg)", border: "2px solid var(--field-line)" }}
      >
        {/* ── Field Markings ── */}

        {/* Outer border */}
        <div className="absolute inset-[6px] pointer-events-none" style={{ border: "2px solid var(--field-line)" }} />

        {/* Center line */}
        <div className="absolute top-1/2 left-[6px] right-[6px] h-[2px] pointer-events-none" style={{ backgroundColor: "var(--field-line)" }} />

        {/* Center circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-0 pointer-events-none"
          style={{ paddingBottom: "22%" }}
        >
          <div className="absolute inset-0 rounded-full" style={{ border: "2px solid var(--field-line)" }} />
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none" style={{ backgroundColor: "var(--field-line)" }} />

        {/* Top penalty box */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[45%] h-[14%] pointer-events-none" style={{ border: "2px solid var(--field-line)", borderTop: "none" }}>
        </div>

        {/* Top goal box */}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[25%] h-[7%] pointer-events-none" style={{ border: "2px solid var(--field-line)", borderTop: "none" }} />

        {/* Bottom penalty box */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[45%] h-[14%] pointer-events-none" style={{ border: "2px solid var(--field-line)", borderBottom: "none" }}>
        </div>

        {/* Bottom goal box */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[25%] h-[7%] pointer-events-none" style={{ border: "2px solid var(--field-line)", borderBottom: "none" }} />

        {/* ── Player Positions ── */}
        <PlayerPosition
          number={9}
          name={formData.players[9]}
          onChange={(v) => handlePlayerChange(9, v)}
          style={{ top: "4%", left: "50%", transform: "translateX(-50%)" }}
        />
        <PlayerPosition
          number={11}
          name={formData.players[11]}
          onChange={(v) => handlePlayerChange(11, v)}
          style={{ top: "18%", left: "15%" }}
        />
        <PlayerPosition
          number={7}
          name={formData.players[7]}
          onChange={(v) => handlePlayerChange(7, v)}
          style={{ top: "18%", right: "15%" }}
        />
        <PlayerPosition
          number={10}
          name={formData.players[10]}
          onChange={(v) => handlePlayerChange(10, v)}
          style={{ top: "36%", left: "22%" }}
        />
        <PlayerPosition
          number={8}
          name={formData.players[8]}
          onChange={(v) => handlePlayerChange(8, v)}
          style={{ top: "36%", right: "22%" }}
        />
        <PlayerPosition
          number={6}
          name={formData.players[6]}
          onChange={(v) => handlePlayerChange(6, v)}
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <PlayerPosition
          number={3}
          name={formData.players[3]}
          onChange={(v) => handlePlayerChange(3, v)}
          style={{ top: "54%", left: "10%" }}
        />
        <PlayerPosition
          number={2}
          name={formData.players[2]}
          onChange={(v) => handlePlayerChange(2, v)}
          style={{ top: "54%", right: "10%" }}
        />
        <PlayerPosition
          number={5}
          name={formData.players[5]}
          onChange={(v) => handlePlayerChange(5, v)}
          style={{ top: "72%", left: "22%" }}
        />
        <PlayerPosition
          number={4}
          name={formData.players[4]}
          onChange={(v) => handlePlayerChange(4, v)}
          style={{ top: "72%", right: "22%" }}
        />
        <PlayerPosition
          number={1}
          name={formData.players[1]}
          onChange={(v) => handlePlayerChange(1, v)}
          style={{ bottom: "4%", left: "50%", transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}

function PlayerPosition({ number, name, onChange, style }) {
  const [line1, line2, line3] = (name || ",,").split(",");

  const handleLineChange = (lineIndex, value) => {
    const lines = (name || ",,").split(",");
    lines[lineIndex] = value;
    onChange(lines.join(","));
  };

  return (
    <div className="absolute z-10" style={style}>
      <div className="flex flex-col items-center gap-[1px]">
        {/* Number badge */}
        <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white bg-black mb-1">
          <span className="text-white text-[10px] font-black">{number}</span>
        </div>

        {/* 3 input lines */}
        {[line1, line2, line3].map((lineVal, i) => (
          <input
            key={i}
            type="text"
            value={lineVal || ""}
            onChange={(e) => handleLineChange(i, e.target.value)}
            className="w-20 bg-white/95 text-black px-1 py-[2px] text-[8px] font-black text-center focus:outline-none focus:ring-1 focus:ring-black h-4"
            style={{ border: "1px solid var(--field-line)" }}
            placeholder=""
          />
        ))}
      </div>
    </div>
  );
}
