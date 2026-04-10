import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import { useActiveSession } from "../../hooks/useActiveSession";

const EVALUATION_CATEGORIES = {
  TECHNIQUE: [
    "Ability to play with both feet",
    "Passing",
    "Controlling and releasing",
    "Feinting and dribbling",
    "Shooting finishing",
    "Heading",
    "Tackling",
    "Playing without the ball",
  ],
  "PHYSICAL ATTRIBUTES": [
    "Strength (Explosiveness)",
    "Speed",
    "Endurance",
    "Suppleness (Mobility)",
    "Core Muscles",
  ],
  "TACTICAL AWARENESS SKILLS": [
    "Reading the game",
    "Attacking one-on-one",
    "Defending one-on-one",
    "Technique under pressure",
  ],
  "CO-ORDINATION": [
    "Orientation",
    "Endurance",
    "Rhythm",
    "Differentiation",
    "Reaction",
    "Balance",
  ],
  "MENTAL STRENGTHS": [
    "Concentration",
    "Willpower will to win",
    "Perseverance",
    "Confidence",
    "Willingness to take risks",
    "Creativity",
    "Aggression",
  ],
  "SOCIAL SKILLS": [
    "Communication",
    "Behavior positive attitude",
    "Charisma / Personality",
    "Conscientiousness",
    "Team Player",
  ],
  "PHYSICAL STATE": ["General state of health"],
};

export function PlayerEvaluation({ isPdf, pdfPart }) {
  const { reflection, updateReflection } = useActiveSession();

  const [evaluatedBy, setEvaluatedBy] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("playerEvaluationBy") || "";
    }
    return "";
  });

  const [playerName, setPlayerName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("playerEvaluationName") || "";
    }
    return "";
  });

  const [playerAge, setPlayerAge] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("playerEvaluationAge") || "";
    }
    return "";
  });

  const [evaluationDate, setEvaluationDate] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("playerEvaluationDate") || "";
    }
    return "";
  });

  const [ratings, setRatings] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("playerEvaluation");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
    }
    return {};
  });

  useEffect(() => {
    if (reflection) {
      if (reflection.detailedEvaluation)
        setRatings(reflection.detailedEvaluation);
      if (reflection.evaluatedBy) setEvaluatedBy(reflection.evaluatedBy);
      if (reflection.playerEvaluationName)
        setPlayerName(reflection.playerEvaluationName);
      if (reflection.playerEvaluationAge)
        setPlayerAge(reflection.playerEvaluationAge);
      if (reflection.playerEvaluationDate)
        setEvaluationDate(reflection.playerEvaluationDate);
    }
  }, [reflection]);

  useEffect(() => {
    localStorage.setItem("playerEvaluation", JSON.stringify(ratings));
  }, [ratings]);
  useEffect(() => {
    localStorage.setItem("playerEvaluationBy", evaluatedBy);
  }, [evaluatedBy]);
  useEffect(() => {
    localStorage.setItem("playerEvaluationName", playerName);
  }, [playerName]);
  useEffect(() => {
    localStorage.setItem("playerEvaluationAge", playerAge);
  }, [playerAge]);
  useEffect(() => {
    localStorage.setItem("playerEvaluationDate", evaluationDate);
  }, [evaluationDate]);

  const handleRatingChange = async (category, skill, rating) => {
    const newRatings = {
      ...ratings,
      [category]: { ...(ratings[category] || {}), [skill]: rating },
    };
    setRatings(newRatings);
    await updateReflection({ detailedEvaluation: newRatings });
  };

  const handleEvaluatedByChange = async (e) => {
    setEvaluatedBy(e.target.value);
    await updateReflection({ evaluatedBy: e.target.value });
  };

  const handleNameChange = async (e) => {
    setPlayerName(e.target.value);
    await updateReflection({ playerEvaluationName: e.target.value });
  };

  const handleAgeChange = async (e) => {
    setPlayerAge(e.target.value);
    await updateReflection({ playerEvaluationAge: e.target.value });
  };

  const handleDateChange = async (e) => {
    setEvaluationDate(e.target.value);
    await updateReflection({ playerEvaluationDate: e.target.value });
  };

  // Shared input style — theme-aware
  const inputClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-input)] px-2 py-1 text-xs font-bold uppercase border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  let categoriesToRender = Object.entries(EVALUATION_CATEGORIES);
  if (isPdf) {
    if (pdfPart === 1)
      categoriesToRender = categoriesToRender.slice(0, 1); // Technique
    else if (pdfPart === 2)
      categoriesToRender = categoriesToRender.slice(1, 3); // Physical Attr, Tactical
    else if (pdfPart === 3)
      categoriesToRender = categoriesToRender.slice(3, 4); // Co-ordination
    else if (pdfPart === 4)
      categoriesToRender = categoriesToRender.slice(4, 5); // Mental Strengths
    else if (pdfPart === 5) categoriesToRender = categoriesToRender.slice(5, 7); // Social, Physical State
  }

  return (
    <div className={!isPdf ? "mb-6" : ""}>
      {(!isPdf || !pdfPart || pdfPart === 1) && (
        <>
          {/* ── Header ── */}
          <div className="text-center mb-4 border-b-2 border-[var(--text-primary)] pb-2">
            <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] tracking-widest">
              PLAYER EVALUATION
            </h2>
          </div>

          {/* ── Name / Age row ── */}
          <div className="grid grid-cols-[1fr_auto] gap-3 mb-2">
            <div>
              <label className="block text-[9px] font-black uppercase text-[var(--text-primary)] mb-1 tracking-widest">
                NAME
              </label>
              <input
                type="text"
                value={playerName}
                onChange={handleNameChange}
                className={inputClass}
              />
            </div>
            <div className="w-16">
              <label className="block text-[9px] font-black uppercase text-[var(--text-primary)] mb-1 tracking-widest">
                AGE
              </label>
              <input
                type="text"
                value={playerAge}
                onChange={handleAgeChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* ── Evaluation By / Date row ── */}
          <div className="grid grid-cols-[1fr_auto] gap-3 mb-4">
            <div>
              <label className="block text-[9px] font-black uppercase text-[var(--text-primary)] mb-1 tracking-widest">
                EVALUATION BY
              </label>
              <input
                type="text"
                value={evaluatedBy}
                onChange={handleEvaluatedByChange}
                className={inputClass}
              />
            </div>
            <div className="w-24">
              <label className="block text-[9px] font-black uppercase text-[var(--text-primary)] mb-1 tracking-widest">
                DATE
              </label>
              <input
                type="date"
                value={evaluationDate}
                onChange={handleDateChange}
                className={inputClass}
              />
            </div>
          </div>
        </>
      )}

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-end gap-[8px] mb-[16px] mt-[4px] justify-between">
        <span className="text-[16px] font-black text-[var(--text-primary)] tracking-wider">
          EVALUATION:
        </span>
        <div className="flex gap-[12px] pb-[1px]">
          {["1 : VERY GOOD", "2 : GOOD", "3 : AVERAGE", "4 : POOR"].map(
            (label) => (
              <span
                key={label}
                className="text-[12px] font-bold uppercase text-[var(--text-primary)]"
              >
                {label}
              </span>
            ),
          )}
        </div>
      </div>

      {/* ── Categories & Skills ── */}
      <div className="space-y-[16px]">
        {categoriesToRender.map(([category, skills], catIdx) => (
          <div key={category} className="space-y-[6px]">
            {/* Category header */}
            <div className="flex justify-between items-end pb-[2px] border-b-[1.5px] border-[var(--text-primary)]">
              <span className="text-[14px] font-black uppercase tracking-wider text-[var(--text-primary)] pl-1">
                {category}
              </span>
              {catIdx === 0 && (
                <div className="flex justify-between w-[116px] mr-[24px] pr-[1px]">
                  <span className="text-[13px] font-black text-[var(--text-primary)] w-4 text-center">
                    1
                  </span>
                  <span className="text-[13px] font-black text-[var(--text-primary)] w-4 text-center">
                    2
                  </span>
                  <span className="text-[13px] font-black text-[var(--text-primary)] w-4 text-center">
                    3
                  </span>
                  <span className="text-[13px] font-black text-[var(--text-primary)] w-4 text-center">
                    4
                  </span>
                </div>
              )}
            </div>

            {/* Skill rows */}
            <div className="space-y-[6px]">
              {skills.map((skill) => {
                const currentRating = ratings[category]?.[skill];
                const value = currentRating || 4; // Used only for rendering width
                const percent = ((value - 1) / 3) * 100;

                return (
                  <div
                    key={skill}
                    className="flex justify-between items-center px-1"
                  >
                    <span className="text-[12px] font-bold uppercase text-[var(--text-primary)] pr-2 leading-tight flex-1">
                      {skill}
                    </span>

                    <div className="flex items-center gap-[4px] w-[140px] shrink-0">
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={value}
                        onChange={(e) =>
                          handleRatingChange(
                            category,
                            skill,
                            Number(e.target.value),
                          )
                        }
                        className="slider-thumb w-[116px] h-2.5 rounded-full appearance-none cursor-pointer shrink-0"
                        style={{
                          background: `linear-gradient(to right,
                            var(--slider-filled) 0%,
                            var(--slider-filled) ${percent}%,
                            var(--slider-unfilled) ${percent}%,
                            var(--slider-unfilled) 100%)`,
                        }}
                      />
                      <span className="text-[13px] font-black text-[var(--text-primary)] w-[20px] text-right shrink-0">
                        {currentRating || ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
