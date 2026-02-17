import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
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

  // Local state with localStorage initialization
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
      players: {
        1: "", // Goalkeeper
        2: "", // Right Back
        3: "", // Left Center Back
        4: "", // Center Back
        5: "", // Right Center Back
        6: "", // Defensive Mid
        7: "", // Right Wing
        8: "", // Center Mid
        9: "", // Striker
        10: "", // Attacking Mid
        11: "", // Left Wing
      },
    };
  });

  // Sync with DB
  // useEffect(() => {
  //     if (reflection && reflection.formation) {
  //         setFormData(prev => {
  //             // Determine if we should overwrite local with DB
  //             // Logic: If DB has data and local differs, update local
  //             // But we must respect recent local edits if they are "newer" (simplified here by check)
  //             if (JSON.stringify(prev) !== JSON.stringify(reflection.formation)) {
  //                 return reflection.formation;
  //             }
  //             return prev;
  //         });
  //     }
  // }, [reflection]);

  useEffect(() => {
    if (!hydrated && reflection?.formation) {
      setFormData({
        teamName: reflection.formation.teamName ?? "",
        date: reflection.formation.date ?? "",
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("footballFormation", JSON.stringify(formData));
  }, [formData]);

  // Save to DB
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

  return (
    <Card className="mb-6 bg-white dark:bg-[#1A1A1A] border-none shadow-none">
      <CardContent className="p-4">
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl font-black uppercase text-center text-white mb-6">
            STARTING LINEUP
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <label className="text-sm font-bold uppercase text-white whitespace-nowrap">
                TEAM
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => handleInputChange("teamName", e.target.value)}
                className="w-full bg-white text-black px-2 py-1 text-sm font-bold border-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold uppercase text-white whitespace-nowrap">
                DATE
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="bg-white text-black px-2 py-1 text-sm font-bold border-none w-40"
              />
            </div>
          </div>
        </div>

        {/* Football Field */}
        <div className="mt-4 relative bg-green-600 dark:bg-green-800 aspect-[3/4] max-w-2xl mx-auto border-2 border-white">
          {/* Field markings */}
          <div className="absolute inset-0">
            {/* Center line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full"></div>

            {/* Goal boxes */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-t-2 border-white"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-b-2 border-white"></div>

            {/* Penalty boxes */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 border-2 border-t-2 border-white"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 border-2 border-b-2 border-white"></div>
          </div>

          {/* Player positions */}
          {/* Goalkeeper - 1 */}
          <PlayerPosition
            number={1}
            name={formData.players[1]}
            onChange={(val) => handlePlayerChange(1, val)}
            style={{ bottom: "5%", left: "50%", transform: "translateX(-50%)" }}
          />

          {/* Defenders */}
          <PlayerPosition
            number={2}
            name={formData.players[2]}
            onChange={(val) => handlePlayerChange(2, val)}
            style={{ bottom: "22%", right: "3%" }}
          />
          <PlayerPosition
            number={3}
            name={formData.players[3]}
            onChange={(val) => handlePlayerChange(3, val)}
            style={{ bottom: "22%", left: "3%" }}
          />
          <PlayerPosition
            number={4}
            name={formData.players[4]}
            onChange={(val) => handlePlayerChange(4, val)}
            style={{ bottom: "22%", right: "25%" }}
          />
          <PlayerPosition
            number={5}
            name={formData.players[5]}
            onChange={(val) => handlePlayerChange(5, val)}
            style={{ bottom: "22%", left: "25%" }}
          />

          {/* Midfielders */}
          <PlayerPosition
            number={6}
            name={formData.players[6]}
            onChange={(val) => handlePlayerChange(6, val)}
            style={{
              bottom: "42%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          <PlayerPosition
            number={7}
            name={formData.players[7]}
            onChange={(val) => handlePlayerChange(7, val)}
            style={{ bottom: "70%", right: "3%" }}
          />
          <PlayerPosition
            number={8}
            name={formData.players[8]}
            onChange={(val) => handlePlayerChange(8, val)}
            style={{ bottom: "55%", right: "19%" }}
          />
          <PlayerPosition
            number={10}
            name={formData.players[10]}
            onChange={(val) => handlePlayerChange(10, val)}
            style={{ bottom: "55%", left: "19%" }}
          />
          <PlayerPosition
            number={11}
            name={formData.players[11]}
            onChange={(val) => handlePlayerChange(11, val)}
            style={{ bottom: "70%", left: "3%" }}
          />

          {/* Striker */}
          <PlayerPosition
            number={9}
            name={formData.players[9]}
            onChange={(val) => handlePlayerChange(9, val)}
            style={{ top: "18%", left: "50%", transform: "translateX(-50%)" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Player Position Component
function PlayerPosition({ number, name, onChange, style }) {
  return (
    <div className="absolute" style={style}>
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-black dark:bg-white border-2 border-white dark:border-black flex items-center justify-center mb-1">
          <span className="text-white dark:text-black text-xs font-black">
            {number}
          </span>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 bg-white/90 dark:bg-black/90 text-black dark:text-white px-1 py-0.5 text-[10px] font-bold border border-white dark:border-black text-center focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
          placeholder="Name"
        />
      </div>
    </div>
  );
}
