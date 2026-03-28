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
    if (pdfPart === 1) categoriesToRender = categoriesToRender.slice(0, 1); // Technique
    else if (pdfPart === 2) categoriesToRender = categoriesToRender.slice(1, 3); // Physical Attr, Tactical
    else if (pdfPart === 3) categoriesToRender = categoriesToRender.slice(3, 4); // Co-ordination
    else if (pdfPart === 4) categoriesToRender = categoriesToRender.slice(4, 5); // Mental Strengths
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
      <div className="flex flex-wrap justify-between items-center mb-2 py-1 border-t border-b border-[var(--border-color)]">
        <span className="text-[9px] font-black uppercase text-[var(--text-primary)] tracking-wider">
          EVALUATION:
        </span>
        <div className="flex gap-3">
          {["1 : VERY GOOD", "2 : GOOD", "3 : AVERAGE", "4 : POOR"].map(
            (label) => (
              <span
                key={label}
                className="text-[8px] font-bold uppercase text-[var(--text-primary)]"
              >
                {label}
              </span>
            ),
          )}
        </div>
      </div>

      {/* ── Column Headers ── */}
      <div className="grid grid-cols-[1fr_28px_28px_28px_28px] gap-[2px] mb-[2px]">
        <div />
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="text-center text-[10px] font-black text-[var(--text-primary)] bg-[var(--bg-input)] py-1"
          >
            {n}
          </div>
        ))}
      </div>

      {/* ── Categories & Skills ── */}
      <div className="space-y-[2px]">
        {categoriesToRender.map(([category, skills]) => (
          <div key={category}>
            {/* Category header — solid accent background */}
            <div
              className="bg-[var(--text-primary)] dark:bg-[var(--text-primary)] px-2 py-[3px]"
              style={{ backgroundColor: "var(--category-header-bg)" }}
            >
              <span
                className="text-[10px] font-black uppercase tracking-wider"
                style={{ color: "var(--category-header-text)" }}
              >
                {category}
              </span>
            </div>

            {/* Skill rows */}
            {skills.map((skill, idx) => {
              const currentRating = ratings[category]?.[skill];
              return (
                <div
                  key={skill}
                  className="grid grid-cols-[1fr_28px_28px_28px_28px] gap-[2px] items-center"
                  style={{
                    backgroundColor:
                      idx % 2 === 0 ? "var(--bg-card)" : "var(--bg-input)",
                  }}
                >
                  <span className="text-[9px] font-bold uppercase text-[var(--text-primary)] px-2 py-[3px] leading-tight">
                    {skill}
                  </span>
                  {[1, 2, 3, 4].map((rating) => (
                    <label
                      key={rating}
                      className="flex justify-center items-center cursor-pointer py-[3px]"
                    >
                      <input
                        type="radio"
                        name={`${category}-${skill}`}
                        value={rating}
                        checked={currentRating === rating}
                        onChange={() =>
                          handleRatingChange(category, skill, rating)
                        }
                        className="peer sr-only"
                      />
                      <div
                        className="w-4 h-4 border transition-colors"
                        style={{
                          backgroundColor:
                            currentRating === rating
                              ? "var(--color-accent)"
                              : "transparent",
                          borderColor:
                            currentRating === rating
                              ? "var(--color-accent)"
                              : "var(--text-secondary)",
                        }}
                      />
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
