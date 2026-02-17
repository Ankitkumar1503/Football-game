import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import { Trophy } from "lucide-react";
import { useActiveSession } from "../../hooks/useActiveSession";

const EVALUATION_CATEGORIES = {
  TECHNIQUE: [
    "Ability to play with both feet",
    "Passing",
    "Controlling and releasing the ball",
    "Feinting and dribbling",
    "Shooting at goal finishing technique",
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
  "TACTICAL AWARENESS / COGNITIVE SKILLS": [
    "Reading the game",
    "Attacking play attacking one-on-one",
    "Defensive play defending one-on-one",
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
  "SOCIAL SKILLS AND ATTRIBUTES": [
    "Communication",
    "Behavior positive attitude",
    "Charisma / Personality",
  ],
};

export function PlayerEvaluation() {
  const { reflection, updateReflection } = useActiveSession();

  // Local state for ratings
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
      if (reflection.detailedEvaluation) {
        setRatings(reflection.detailedEvaluation);
      }
      if (reflection.evaluatedBy) {
        setEvaluatedBy(reflection.evaluatedBy);
      }
      if (reflection.playerEvaluationName) {
        setPlayerName(reflection.playerEvaluationName);
      }
      if (reflection.playerEvaluationAge) {
        setPlayerAge(reflection.playerEvaluationAge);
      }
    }
  }, [reflection]);

  // Save ratings to localStorage
  useEffect(() => {
    localStorage.setItem("playerEvaluation", JSON.stringify(ratings));
  }, [ratings]);

  // Save evaluatedBy to localStorage
  useEffect(() => {
    localStorage.setItem("playerEvaluationBy", evaluatedBy);
  }, [evaluatedBy]);

  useEffect(() => {
    localStorage.setItem("playerEvaluationName", playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem("playerEvaluationAge", playerAge);
  }, [playerAge]);

  const handleRatingChange = async (category, skill, rating) => {
    const newRatings = {
      ...ratings,
      [category]: {
        ...(ratings[category] || {}),
        [skill]: rating,
      },
    };
    setRatings(newRatings);

    // Save to database
    await updateReflection({
      detailedEvaluation: newRatings,
    });
  };

  const handleEvaluatedByChange = async (e) => {
    const value = e.target.value;
    setEvaluatedBy(value);
    // We might want to debounce this, but for now simple update
    await updateReflection({
      evaluatedBy: value,
    });
  };

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setPlayerName(value);
    await updateReflection({
      playerEvaluationName: value,
    });
  };

  const handleAgeChange = async (e) => {
    const value = e.target.value;
    setPlayerAge(value);
    await updateReflection({
      playerEvaluationAge: value,
    });
  };

  return (
    <Card className="mb-[24px] bg-white dark:bg-[#1A1A1A] border-none shadow-none">
      <CardContent className="p-2">
        <div className="flex items-center gap-2 mb-4 border-b-2 border-black dark:border-white pb-2">
          <h2 className="text-2xl font-black uppercase text-black dark:text-white">
            PLAYER EVALUATIONS
          </h2>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1 flex items-center gap-3">
            <label
              htmlFor="playerName"
              className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 whitespace-nowrap"
            >
              NAME:
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={handleNameChange}
              className="w-full bg-[#E5E5E5] text-black px-3 py-[4px] text-sm font-bold uppercase rounded-sm border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
            />
          </div>
          <div className="w-1/3 flex items-center gap-3">
            <label
              htmlFor="playerAge"
              className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 whitespace-nowrap"
            >
              AGE:
            </label>
            <input
              id="playerAge"
              type="text"
              value={playerAge}
              onChange={handleAgeChange}
              className="w-full bg-[#E5E5E5] text-black px-3 py-[4px] text-sm font-bold uppercase rounded-sm border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
            />
          </div>
        </div>

        <div className="py-3 mb-4 flex items-center gap-3">
          <label
            htmlFor="evaluatedBy"
            className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 whitespace-nowrap"
          >
            PLAYER EVALUATION BY:
          </label>
          <input
            id="evaluatedBy"
            type="text"
            value={evaluatedBy}
            onChange={handleEvaluatedByChange}
            className="flex-1 bg-[#E5E5E5] text-black px-3 py-[4px] text-sm font-bold uppercase rounded-sm border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
            placeholder=""
          />
        </div>

        <div className="flex justify-between items-center text-[10px] sm:text-xs font-black uppercase mb-2 px-1">
          <span>EVALUATION:</span>
          <div className="flex gap-2">
            <span>1 : VERY GOOD</span>
            <span>2 : GOOD</span>
            <span>3 : AVERAGE</span>
            <span>4 : POOR</span>
          </div>
        </div>

        {/* Header Row for Grid */}
        <div className="grid grid-cols-[1fr_repeat(4,30px)] gap-1 mb-2 px-1">
          <div></div>
          <div className="text-center font-bold text-xs border border-black/20">
            1
          </div>
          <div className="text-center font-bold text-xs border border-black/20">
            2
          </div>
          <div className="text-center font-bold text-xs border border-black/20">
            3
          </div>
          <div className="text-center font-bold text-xs border border-black/20">
            4
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(EVALUATION_CATEGORIES).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-sm font-black uppercase mb-1 px-1 border-b-[1px] border-gray-200 dark:text-gray-200">
                {category}
              </h3>
              <div className="space-y-[1px]">
                {skills.map((skill) => {
                  const currentRating = ratings[category]?.[skill];
                  return (
                    <div
                      key={skill}
                      className="grid grid-cols-[1fr_repeat(4,30px)] gap-1 items-center bg-white dark:bg-[#202020] p-1"
                    >
                      <span className="text-[10px] md:text-xs font-bold uppercase text-gray-800 dark:text-gray-300 leading-tight pr-2">
                        {skill}
                      </span>
                      {[1, 2, 3, 4].map((rating) => (
                        <label
                          key={rating}
                          className="flex justify-center cursor-pointer h-full"
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
                          <div className="w-5 h-5 rounded-sm border border-gray-300 peer-checked:bg-[#FF4422] peer-checked:border-[#FF4422] transistion-colors"></div>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
