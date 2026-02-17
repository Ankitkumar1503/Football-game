import React, { useState, useEffect } from "react";
import { Footprints } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { useActiveSession } from "../../hooks/useActiveSession";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const LEVELS = [
  "FUN",
  "GRASSROOTS",
  "REC",
  "TRAINING",
  "TRYOUTS",
  "CLUB",
  "ACADEMY",
  "COLLEGE",
  "UNIVERSITY",
  "PRO",
];

export function PlayerProfile() {
  const { session, updateSession } = useActiveSession();

  // Local state with localStorage initialization
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("playerProfile");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
    }
    return {
      level: "",
      date: new Date().toISOString().split("T")[0],
      //   time: new Date().toLocaleTimeString([], {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   }),
      time: new Date().toTimeString().slice(0, 5),
      playerName: "",
      age: "",
      club: "",
      team: "",
      position: "",
      totalYearsPlaying: "",
      totalHoursTrained: "",
      totalSessions: "",
      gameNumber: "",
      totalGames: "",
      totalGoals: "",
      totalPenalties: "",
      yourPosition: "",
      rightFooter: "",
      leftFooter: "",
    };
  });

  // Track if we've handled the initial sync with DB
  const [isLoaded, setIsLoaded] = useState(false);

  // Load session data
  useEffect(() => {
    if (session.id) {
      // Check if we have meaningful local data
      const hasLocalData =
        formData.playerName || formData.club || formData.team;

      // If we haven't loaded yet
      if (!isLoaded) {
        // Only load from DB if we don't have local data, or if DB seems to have content we lack
        if (!hasLocalData) {
          setFormData({
            level: session.level || "",
            date: session.date || new Date().toISOString().split("T")[0],
            // time:
            //   session.time ||
            //   new Date().toLocaleTimeString([], {
            //     hour: "2-digit",
            //     minute: "2-digit",
            //   }),
            time: session.time || new Date().toTimeString().slice(0, 5),
            playerName: session.playerName || "",
            age: session.age || "",
            club: session.club || "",
            team: session.team || "",
            position: session.position || "",
            totalYearsPlaying: session.totalYearsPlaying || "",
            totalHoursTrained: session.totalHoursTrained || "",
            totalSessions: session.totalSessions || "",
            gameNumber: session.gameNumber || "",
            totalGames: session.totalGames || "",
            totalGoals: session.totalGoals || "",
            totalPenalties: session.totalPenalties || "",
            yourPosition: session.yourPosition || "",
            rightFooter: session.rightFooter || "",
            leftFooter: session.leftFooter || "",
          });
        }
        setIsLoaded(true);
      }
    }
  }, [session, isLoaded]); // Simplified dependencies

  const debouncedData = useDebounce(formData, 800);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("playerProfile", JSON.stringify(formData));
  }, [formData]);

  // Auto-save to DB
  useEffect(() => {
    if (session.id && isLoaded) {
      updateSession(debouncedData);
    } else if (
      session.id &&
      !isLoaded &&
      (formData.playerName || formData.club)
    ) {
      // If we have local data but haven't "loaded" from DB (meaning we are prioritizing Local),
      // we should still save to DB to ensure consistency.
      updateSession(debouncedData);
    }
  }, [debouncedData, session.id, updateSession, isLoaded]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLevelSelect = (level) => {
    setFormData((prev) => ({ ...prev, level }));
  };

  const handlePositionSelect = (num) => {
    setFormData((prev) => ({ ...prev, position: num.toString() }));
  };

  return (
    <div className="mb-8">
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-1 space-y-4">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="date"
                className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="time"
                className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200"
              >
                Time
              </label>
              <input
                id="time"
                type="time"
                className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Name & Age */}
          <div className="grid grid-cols-[1fr_80px] gap-4">
            <div className="space-y-1">
              <label
                htmlFor="playerName"
                className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200"
              >
                Name of Player
              </label>
              <input
                id="playerName"
                type="text"
                className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                value={formData.playerName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="age"
                className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200"
              >
                Age
              </label>
              <input
                id="age"
                type="number"
                className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Club */}
          <div className="space-y-1">
            <label
              htmlFor="club"
              className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200"
            >
              Club
            </label>
            <input
              id="club"
              type="text"
              className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
              value={formData.club}
              onChange={handleChange}
            />
          </div>

          {/* Team */}
          <div className="space-y-1">
            <label
              htmlFor="team"
              className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200"
            >
              Team
            </label>
            <input
              id="team"
              type="text"
              className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
              value={formData.team}
              onChange={handleChange}
            />
          </div>

          {/* Position Selector */}
          <div className="space-y-1 pb-4 border-b-2 border-white/10">
            <label className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200 mb-2">
              Position:
            </label>
            <div className="flex justify-between items-center bg-[#E5E5E5] p-1 rounded-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePositionSelect(num)}
                  className={`w-7 h-7 flex items-center justify-center text-sm font-black transition-colors ${
                    formData.position === num.toString()
                      ? "text-[#FF4422] bg-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Right/Left Footer */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b-2 border-white/10 mb-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="rightFooter"
                className="text-xs font-black uppercase text-gray-800 dark:text-gray-200"
              >
                Right Footer
              </label>
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <input
                  id="rightFooter"
                  type="text"
                  className="w-24 bg-[#E5E5E5] text-black px-2 py-1 text-sm font-bold rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                  value={formData.rightFooter}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="leftFooter"
                className="text-xs font-black uppercase text-gray-800 dark:text-gray-200"
              >
                Left Footer
              </label>
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <input
                  id="leftFooter"
                  type="text"
                  className="w-24 bg-[#E5E5E5] text-black px-2 py-1 text-sm font-bold rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                  value={formData.leftFooter}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Player Stats */}
          <div className="pt-2 scroll-mt-28" id="player-stats">
            <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-black/80 dark:border-white/80 pb-1">
              Player Stats
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="totalYearsPlaying"
                  className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400"
                >
                  Total Years Playing
                </label>
                <input
                  id="totalYearsPlaying"
                  type="number"
                  className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                  value={formData.totalYearsPlaying}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="totalHoursTrained"
                  className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400"
                >
                  Total Hours Trained
                </label>
                <input
                  id="totalHoursTrained"
                  type="number"
                  className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                  value={formData.totalHoursTrained}
                  onChange={handleChange}
                />
              </div>
              {/* Total Sessions */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="totalSessions"
                  className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400"
                >
                  Total Number of Sessions
                </label>
                <input
                  id="totalSessions"
                  type="number"
                  className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                  value={formData.totalSessions}
                  onChange={handleChange}
                />
              </div>

              {/* New Fields */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="totalGames"
                  className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400"
                >
                  Total Number of Games
                </label>
                <input
                  id="totalGames"
                  type="number"
                  className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                  value={formData.totalGames}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="totalGoals"
                  className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400"
                >
                  Total Goals Scored
                </label>
                <input
                  id="totalGoals"
                  type="number"
                  className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                  value={formData.totalGoals}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="totalPenalties"
                  className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400"
                >
                  Total Penalties Taken
                </label>
                <input
                  id="totalPenalties"
                  type="number"
                  className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                  value={formData.totalPenalties}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="yourPosition"
                  className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400"
                >
                  Your Position
                </label>
                <input
                  id="yourPosition"
                  type="text"
                  className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                  value={formData.yourPosition}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
