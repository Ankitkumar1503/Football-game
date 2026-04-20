import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import { useActiveSession } from "../../hooks/useActiveSession";
import { useCumulativeStats } from "../../hooks/useCumulativeStats";
import toucheDark from "../../assets/touche-dark.png";
import toucheLight from "../../assets/touche-light.png";
import touchesIntro from "../../assets/touches-intro.png";
import touchesIntro2 from "../../assets/touches-intro2.png";

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
    let profile = {
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
    };
    let career = {
      totalYearsPlaying: "",
      totalHoursTrained: "",
      totalSessions: "",
      totalGames: "",
      totalGoals: "",
      totalPenalties: "",
      totalCornerKicks: "",
      totalThrowIns: "",
    };

    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("playerProfile");
      const savedCareer = localStorage.getItem("playerCareerStats");
      if (savedProfile) {
        try {
          profile = { ...profile, ...JSON.parse(savedProfile) };
        } catch (e) {}
      }
      if (savedCareer) {
        try {
          career = { ...career, ...JSON.parse(savedCareer) };
        } catch (e) {}
      }
    }
    return { ...profile, ...career };
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (session.id && !isLoaded) {
      const savedProfile = localStorage.getItem("playerProfile");
      const savedCareer = localStorage.getItem("playerCareerStats");
      let data = {};
      if (savedProfile)
        try {
          data = { ...data, ...JSON.parse(savedProfile) };
        } catch (e) {}
      if (savedCareer)
        try {
          data = { ...data, ...JSON.parse(savedCareer) };
        } catch (e) {}

      if (Object.keys(data).length > 0) {
        setFormData((prev) => ({ ...prev, ...data }));
      }
      setIsLoaded(true);
    }
  }, [session, isLoaded]);

  const debouncedData = useDebounce(formData, 800);

  useEffect(() => {
    // Split the data back into two keys, but MERGE with existing to avoid destroying other fields
    const profileKeys = [
      "fullName",
      "dateOfBirth",
      "age",
      "cellPhone",
      "school",
      "academy",
      "club",
      "team",
      "position",
      "activeFooter",
    ];
    const careerKeys = [
      "totalYearsPlaying",
      "totalHoursTrained",
      "totalSessions",
      "totalGames",
      "totalGoals",
      "totalPenalties",
      "totalCornerKicks",
      "totalThrowIns",
    ];

    // Get existing to prevent wiping out data managed by other components
    let existingProfile = {};
    let existingCareer = {};
    try {
      const savedProfile = localStorage.getItem("playerProfile");
      if (savedProfile) existingProfile = JSON.parse(savedProfile);

      const savedCareer = localStorage.getItem("playerCareerStats");
      if (savedCareer) existingCareer = JSON.parse(savedCareer);
    } catch (e) {
      console.error("Error reading from localStorage in PlayerStats", e);
    }

    const profileData = { ...existingProfile };
    const careerData = { ...existingCareer };

    profileKeys.forEach((key) => (profileData[key] = formData[key]));
    careerKeys.forEach((key) => (careerData[key] = formData[key]));

    localStorage.setItem("playerProfile", JSON.stringify(profileData));
    localStorage.setItem("playerCareerStats", JSON.stringify(careerData));
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
  // const labelClass =
  //   "block text-[9px] font-black uppercase text-[var(--text-primary)] tracking-widest";

  // Change this line in your section components:
  const labelClass =
    "block text-[9px] font-black uppercase text-[var(--text-primary)] tracking-widest mb-1 relative z-10";

  const inputClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-input)] px-3 py-2 text-xs font-bold uppercase border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  const smallInputClass =
    "w-20 bg-[var(--bg-input)] text-[var(--text-input)] px-2 py-1 text-xs font-bold text-center border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  return (
    <div className="mb-8">
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-1 space-y-2">
          {/* ═══ PLAYER STATS Heading ═══ */}
          <h2 className="text-center text-2xl font-black uppercase text-[var(--text-primary)] tracking-widest border-b-2 border-[var(--text-primary)] pb-2 mb-1">
            Player Stats
          </h2>
          <p className="text-[7px] uppercase tracking-widest text-center text-[var(--text-secondary)] mb-2 font-bold opacity-70">
            ⚡ Stats auto-update every session
          </p>

          {/* Full Name */}
          <div className="">
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
          <div className="grid grid-cols-[1fr_auto]">
            <div className="">
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
            {/* <div className="">
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
            </div> */}
          </div>

          {/* Cell Phone */}
          <div className="">
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
          <div className="">
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
          <div className="">
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
          <div className="">
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
          <div className="">
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
          <div className="pb-2">
            <label className={`${labelClass} mb-1 block`}>Position:</label>
            <div
              className="flex justify-between items-center p-1"
              style={{ backgroundColor: "var(--bg-input)" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
                const isSelected = formData.position === num.toString();
                return (
                  <button
                    key={num}
                    onClick={() => handlePositionSelect(num)}
                    className="w-7 h-7 flex items-center justify-center text-xs font-black transition-colors"
                    style={{
                      color: isSelected
                        ? isLightTheme
                          ? "#FFFFFF"
                          : "var(--color-accent)"
                        : isLightTheme
                          ? "var(--text-input)"
                          : "var(--text-primary)",
                      backgroundColor: isSelected
                        ? isLightTheme
                          ? "#000000"
                          : "var(--bg-primary)"
                        : "transparent",
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right/Left Footer */}
          <div className="flex justify-between gap-8 pb-2 border-b-2 border-[var(--border-color)] mb-2">
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
                  // opacity: formData.activeFooter === "left" ? 1 : 0.4,
                  filter:
                    formData.activeFooter === "left"
                      ? isLightTheme
                        ? "brightness(0)"
                        : "none"
                      : "none",
                }}
              />
              <span
                className="font-black uppercase text-xs tracking-widest"
                style={{
                  color:
                    formData.activeFooter === "left"
                      ? isLightTheme
                        ? "#000000"
                        : "var(--text-primary)"
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
                    : touchesIntro2
                }
                alt="Right Footer"
                className="w-16 h-16 object-contain"
                style={{
                  transform:
                    formData.activeFooter === "right" ? "scaleX(-1)" : "none",
                  // opacity: formData.activeFooter === "right" ? 1 : 0.4,
                  filter:
                    formData.activeFooter === "right"
                      ? isLightTheme
                        ? "brightness(0)"
                        : "none"
                      : "none",
                }}
              />
              <span
                className="font-black uppercase text-xs tracking-widest"
                style={{
                  color:
                    formData.activeFooter === "right"
                      ? isLightTheme
                        ? "#000000"
                        : "var(--text-primary)"
                      : "var(--text-secondary)",
                }}
              >
                Right Footer
              </span>
            </button>
          </div>

          {/* ═══ PLAYER STATS Details Heading ═══ */}
          <div className="pt-2 pb-1 px-1">
            <h3 className="text-center text-lg font-black uppercase tracking-widest text-[var(--text-primary)]">
              Player Stats
            </h3>
            <div className="h-0.5 bg-[var(--text-primary)] w-full mt-1" />
          </div>

          {/* Stats */}
          <div className="">
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

            {/* Editable career stats */}
            {[
              { id: "totalSessions", label: "Number of Sessions" },
              { id: "totalGames", label: "Number of Games" },
              { id: "totalGoals", label: "Goals Scored" },
              { id: "totalPenalties", label: "Penalties Taken" },
              { id: "totalCornerKicks", label: "Corner Kicks" },
              { id: "totalThrowIns", label: "Throw-ins" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-1"
              >
                <label htmlFor={item.id} className={labelClass}>
                  {item.label}
                </label>
                <input
                  id={item.id}
                  type="number"
                  className={smallInputClass}
                  value={formData[item.id] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
