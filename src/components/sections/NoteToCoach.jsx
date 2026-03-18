import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import { useActiveSession } from "../../hooks/useActiveSession";

const TEACH_ME_TAGS = [
  "PASS",
  "TACKLE",
  "ATTACK",
  "LEARN",
  "SHOOT",
  "HEAD",
  "SCAN",
  "PLAY",
  "DRIBBLE",
  "DEFEND",
  "IMPROVE",
  "RECOVER",
];

const GRADE_ITEMS = [
  { key: "coach", label: "GRADE  COACH" },
  { key: "assistantCoach", label: "GRADE  ASSISTANT COACH" },
  { key: "trainer", label: "GRADE  TRAINER" },
];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function NoteToCoach({ isPdf, pdfPart }) {
  const { updateReflection, reflection } = useActiveSession();
  const [hydrated, setHydrated] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noteToCoach");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing noteToCoach localStorage:", e);
        }
      }
    }
    return {
      name: "",
      date: "",
      club: "",
      team: "",
      whatILiked: "",
      whatIWouldChange: "",
      wouldLikeToDoMore: "",
      teachMeTags: [],
      grades: { coach: 5, assistantCoach: 5, trainer: 5 },
    };
  });

  // Hydrate from DB once
  useEffect(() => {
    if (!hydrated && reflection?.noteToCoach) {
      setFormData(reflection.noteToCoach);
      setHydrated(true);
    }
  }, [reflection, hydrated]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("noteToCoach", JSON.stringify(formData));
  }, [formData]);

  // Debounced DB sync
  const debouncedData = useDebounce(formData, 1000);
  useEffect(() => {
    if (debouncedData) {
      updateReflection({ noteToCoach: debouncedData });
    }
  }, [debouncedData, updateReflection]);

  // Handlers
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => {
      const tags = prev.teachMeTags.includes(tag)
        ? prev.teachMeTags.filter((t) => t !== tag)
        : [...prev.teachMeTags, tag];
      return { ...prev, teachMeTags: tags };
    });
  };

  const handleGradeChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      grades: { ...prev.grades, [key]: parseInt(value) },
    }));
  };

  // Shared styles
  const inputClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-primary)] px-3 py-1.5 text-sm font-bold border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  const labelClass =
    "block text-[10px] font-black uppercase text-[var(--text-primary)] mb-1 tracking-widest";

  const textareaClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-primary)] px-3 py-2 text-sm font-medium border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-none";

  return (
    <div className={!isPdf ? "mb-6" : ""}>
      {/* ── Header ── */}
      {(!isPdf || pdfPart === 1) && (
        <>
          <div className="text-center mb-4 border-b-2 border-[var(--text-primary)] pb-2">
            <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] tracking-widest">
              NOTE TO COACH
            </h2>
          </div>

          {/* ── NAME / DATE ── */}
          <div className="grid grid-cols-[1fr_120px] gap-3 mb-2">
            <div>
              <label className={labelClass}>NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>DATE</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* ── CLUB ── */}
          <div className="mb-2">
            <label className={labelClass}>CLUB</label>
            <input
              type="text"
              value={formData.club}
              onChange={(e) => handleChange("club", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* ── TEAM ── */}
          <div className="mb-4">
            <label className={labelClass}>TEAM</label>
            <input
              type="text"
              value={formData.team}
              onChange={(e) => handleChange("team", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* ── WHAT I LIKED ABOUT THE SESSION/GAME ── */}
          <div className="mb-4">
            <label className={labelClass}>
              WHAT I LIKED ABOUT THE SESSION/GAME
            </label>
            <textarea
              rows={3}
              value={formData.whatILiked}
              onChange={(e) => handleChange("whatILiked", e.target.value)}
              className={textareaClass}
            />
          </div>
        </>
      )}

      {(!isPdf || pdfPart === 2) && (
        <>
          {/* ── WHAT I WOULD CHANGE ── */}
          <div className="mb-4">
            <label className={labelClass}>WHAT I WOULD CHANGE</label>
            <textarea
              rows={3}
              value={formData.whatIWouldChange}
              onChange={(e) => handleChange("whatIWouldChange", e.target.value)}
              className={textareaClass}
            />
          </div>

          {/* ── I WOULD LIKE TO DO MORE ── */}
          <div className="mb-4">
            <label className={labelClass}>I WOULD LIKE TO DO MORE</label>
            <textarea
              rows={3}
              value={formData.wouldLikeToDoMore}
              onChange={(e) => handleChange("wouldLikeToDoMore", e.target.value)}
              className={textareaClass}
            />
          </div>
        </>
      )}

      {(!isPdf || pdfPart === 3) && (
        <>
          {/* ── TEACH ME HOW TO ── */}
          <div className="mb-6">
            <h3 className="text-[10px] font-black uppercase text-[var(--text-primary)] mb-3 tracking-widest">
              TEACH ME HOW TO:
            </h3>
            <div className="grid grid-cols-4 gap-x-2 gap-y-2">
              {TEACH_ME_TAGS.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <div
                    className="w-4 h-4 border-2 flex items-center justify-center transition-all shrink-0"
                    style={{
                      borderColor: "var(--text-primary)",
                      backgroundColor: formData.teachMeTags.includes(tag)
                        ? "var(--color-accent)"
                        : "transparent",
                    }}
                  >
                    {formData.teachMeTags.includes(tag) && (
                      <span className="text-white font-bold text-[10px]">✓</span>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.teachMeTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  <span className="text-[9px] font-bold uppercase text-[var(--text-primary)] leading-tight whitespace-nowrap">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── GRADE SLIDERS ── */}
          <div className="space-y-3">
            {GRADE_ITEMS.map(({ key, label }) => {
              const value = Number(formData.grades[key] || 5);
              const percent = ((value - 1) / 9) * 100;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase text-[var(--text-primary)] tracking-wider w-44 shrink-0 leading-tight">
                    {label}
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handleGradeChange(key, e.target.value)}
                    className="slider-thumb flex-1 h-1.5 rounded-full appearance-none cursor-pointer min-w-0"
                    style={{
                      background: `linear-gradient(to right,
                        var(--color-accent) 0%,
                        var(--color-accent) ${percent}%,
                        var(--bg-input) ${percent}%,
                        var(--bg-input) 100%)`,
                    }}
                  />
                  <span className="text-xs font-bold text-[var(--color-accent)] w-5 text-right shrink-0">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
