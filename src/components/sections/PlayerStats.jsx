import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import { useActiveSession } from "../../hooks/useActiveSession";
import { useCumulativeStats } from "../../hooks/useCumulativeStats";
import toucheDark from "../../assets/touche-dark.png";
import toucheLight from "../../assets/touche-light.png";
import touchesIntro from "../../assets/touches-intro.png";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function PlayerStats() {
  const { session, updateSession } = useActiveSession();
  const cumulativeStats = useCumulativeStats();

  const [isLightTheme, setIsLightTheme] = useState(
    document.documentElement.classList.contains("theme-light"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightTheme(
        document.documentElement.classList.contains("theme-light"),
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
      fullName: "",
      dateOfBirth: "",
      age: "",
      cellPhone: "",
      school: "",
      academy: "",
      club: "",
      team: "",
      position: "",
      activeFooter: "",
      totalYearsPlaying: "",
      totalHoursTrained: "",
    };
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (session.id && !isLoaded) {
      const saved = localStorage.getItem("playerProfile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
      setIsLoaded(true);
    }
  }, [session, isLoaded]);

  const debouncedData = useDebounce(formData, 800);

  useEffect(() => {
    // Merge into the shared localStorage key
    const existing = localStorage.getItem("playerProfile");
    let merged = {};
    if (existing) {
      try {
        merged = JSON.parse(existing);
      } catch (e) {}
    }
    localStorage.setItem(
      "playerProfile",
      JSON.stringify({ ...merged, ...formData }),
    );
  }, [formData]);

  useEffect(() => {
    if (session.id && isLoaded) {
      updateSession(debouncedData);
    }
  }, [debouncedData, session.id, updateSession, isLoaded]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePositionSelect = (num) => {
    setFormData((prev) => ({ ...prev, position: num.toString() }));
  };

  // ── Shared style strings ──
  const labelClass =
    "block text-[9px] font-black uppercase text-[var(--text-primary)] tracking-widest";

  const inputClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-primary)] px-3 py-2 text-xs font-bold uppercase border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  const smallInputClass =
    "w-20 bg-[var(--bg-input)] text-[var(--text-primary)] px-2 py-1 text-xs font-bold text-center border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  return (
    <div className="mb-8">
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-1 space-y-4">
          {/* ═══ PLAYER STATS Heading ═══ */}
          <h2 className="text-center text-2xl font-black uppercase text-[var(--text-primary)] tracking-widest border-b-2 border-[var(--text-primary)] pb-2 mb-2">
            Player Stats
          </h2>
          <p className="text-[7px] uppercase tracking-widest text-center text-[var(--text-secondary)] mb-3 font-bold opacity-70">
            ⚡ Stats auto-update every session
          </p>

          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="fullName" className={labelClass}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className={inputClass}
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Date of Birth & Age */}
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="space-y-1">
              <label htmlFor="dateOfBirth" className={labelClass}>
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className={inputClass}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="age" className={labelClass}>
                Age
              </label>
              <input
                id="age"
                type="number"
                className={`${inputClass} w-16 text-center`}
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cell Phone */}
          <div className="space-y-1">
            <label htmlFor="cellPhone" className={labelClass}>
              Cell Phone
            </label>
            <input
              id="cellPhone"
              type="tel"
              className={inputClass}
              value={formData.cellPhone}
              onChange={handleChange}
            />
          </div>

          {/* School */}
          <div className="space-y-1">
            <label htmlFor="school" className={labelClass}>
              School
            </label>
            <input
              id="school"
              type="text"
              className={inputClass}
              value={formData.school}
              onChange={handleChange}
            />
          </div>

          {/* Academy */}
          <div className="space-y-1">
            <label htmlFor="academy" className={labelClass}>
              Academy
            </label>
            <input
              id="academy"
              type="text"
              className={inputClass}
              value={formData.academy}
              onChange={handleChange}
            />
          </div>

          {/* Club */}
          <div className="space-y-1">
            <label htmlFor="club" className={labelClass}>
              Club
            </label>
            <input
              id="club"
              type="text"
              className={inputClass}
              value={formData.club}
              onChange={handleChange}
            />
          </div>

          {/* Team */}
          <div className="space-y-1">
            <label htmlFor="team" className={labelClass}>
              Team
            </label>
            <input
              id="team"
              type="text"
              className={inputClass}
              value={formData.team}
              onChange={handleChange}
            />
          </div>

          {/* Position Selector */}
          <div className="space-y-1 pb-4 border-b-2 border-[var(--border-color)]">
            <label className={`${labelClass} mb-2 block`}>Position:</label>
            <div
              className="flex justify-between items-center p-1"
              style={{ backgroundColor: "var(--bg-input)" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePositionSelect(num)}
                  className="w-7 h-7 flex items-center justify-center text-xs font-black transition-colors"
                  style={{
                    color:
                      formData.position === num.toString()
                        ? "var(--color-accent)"
                        : "var(--text-primary)",
                    backgroundColor:
                      formData.position === num.toString()
                        ? "var(--bg-primary)"
                        : "transparent",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Right/Left Footer */}
          <div className="flex justify-between gap-8 pb-4 border-b-2 border-[var(--border-color)] mb-4">
            <button
              onClick={() =>
                setFormData((prev) => ({ ...prev, activeFooter: "left" }))
              }
              className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              <img
                src={
                  formData.activeFooter === "left"
                    ? isLightTheme
                      ? toucheLight
                      : toucheDark
                    : touchesIntro
                }
                alt="Left Footer"
                className="w-16 h-16 object-contain"
                style={{
                  opacity: formData.activeFooter === "left" ? 1 : 0.5,
                  filter:
                    formData.activeFooter === "left"
                      ? "none"
                      : isLightTheme
                        ? "invert(1) grayscale(100%)"
                        : "grayscale(100%)",
                }}
              />
              <span
                className="font-black uppercase text-xs tracking-widest"
                style={{
                  color:
                    formData.activeFooter === "left"
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                }}
              >
                Left Footer
              </span>
            </button>
            <button
              onClick={() =>
                setFormData((prev) => ({ ...prev, activeFooter: "right" }))
              }
              className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              <img
                src={
                  formData.activeFooter === "right"
                    ? isLightTheme
                      ? toucheLight
                      : toucheDark
                    : touchesIntro
                }
                alt="Right Footer"
                className="w-16 h-16 object-contain"
                style={{
                  opacity: formData.activeFooter === "right" ? 1 : 0.5,
                  filter:
                    formData.activeFooter === "right"
                      ? "none"
                      : isLightTheme
                        ? "invert(1) grayscale(100%)"
                        : "grayscale(100%)",
                }}
              />
              <span
                className="font-black uppercase text-xs tracking-widest"
                style={{
                  color:
                    formData.activeFooter === "right"
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                }}
              >
                Right Footer
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="space-y-1">
            {/* Editable: Years Playing */}
            <div className="flex items-center justify-between py-1">
              <label htmlFor="totalYearsPlaying" className={labelClass}>
                Years Playing
              </label>
              <input
                id="totalYearsPlaying"
                type="number"
                className={smallInputClass}
                value={formData.totalYearsPlaying}
                onChange={handleChange}
              />
            </div>

            {/* Editable: Hours Trained */}
            <div className="flex items-center justify-between py-1">
              <label htmlFor="totalHoursTrained" className={labelClass}>
                Hours Trained
              </label>
              <input
                id="totalHoursTrained"
                type="number"
                className={smallInputClass}
                value={formData.totalHoursTrained}
                onChange={handleChange}
              />
            </div>

            {/* Auto-computed stats */}
            {[
              {
                label: "Number of Sessions",
                value: cumulativeStats.totalSessions,
              },
              { label: "Number of Games", value: cumulativeStats.totalGames },
              { label: "Goals Scored", value: cumulativeStats.totalGoals },
              {
                label: "Penalties Taken",
                value: cumulativeStats.totalPenalties,
              },
              {
                label: "Corner Kicks",
                value: cumulativeStats.totalCornerKicks ?? 0,
              },
              {
                label: "Throw-ins",
                value: cumulativeStats.totalThrowIns ?? 0,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-1"
              >
                <span className={labelClass}>{item.label}</span>
                <div className="w-20 px-2 py-1 text-xs font-black text-center text-[var(--color-accent)] bg-[var(--bg-input)] border border-[var(--color-accent)]/30">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
