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

const GAME_TYPES = ["GRASSROOTS", "4V4", "7V7", "9V9", "11V11"];

export function PlayerProfile() {
  const { session, updateSession } = useActiveSession();

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
      // Existing fields
      level: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      position: "",
      activeFooter: "",
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

      // Personal Information
      fullName: "",
      dateOfBirth: "",
      age: "",
      placeOfBirth: "",
      address: "",
      zipCode: "",
      city: "",
      country: "",

      // Contact & Social Media
      email: "",
      cellPhone: "",
      website: "",
      instagram: "",
      tiktok: "",
      facebook: "",

      // Favorites
      favoriteTeam: "",
      favoritePlayer: "",

      // Game Type toggles
      gameTypes: [],

      // Education
      middleSchool: "",
      middleSchoolGrade: "",
      highSchool: "",
      highSchoolGrade: "",
      college: "",
      collegeYear: "",
      university: "",
      universityYear: "",

      // Professional
      academy: "",
      academyLevel: "",
      pro: "",
      proLeague: "",
      club: "",
      team: "",
    };
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (session.id) {
      const hasLocalData =
        formData.fullName ||
        formData.playerName ||
        formData.club ||
        formData.team;
      if (!isLoaded) {
        if (!hasLocalData) {
          setFormData((prev) => ({
            ...prev,
            level: session.level || "",
            date: session.date || new Date().toISOString().split("T")[0],
            time: session.time || new Date().toTimeString().slice(0, 5),
            fullName: session.fullName || session.playerName || "",
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
          }));
        }
        setIsLoaded(true);
      }
    }
  }, [session, isLoaded]);

  const debouncedData = useDebounce(formData, 800);

  useEffect(() => {
    localStorage.setItem("playerProfile", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (session.id && isLoaded) {
      // Map fullName to playerName for backward compatibility
      const dataToSave = {
        ...debouncedData,
        playerName: debouncedData.fullName,
      };
      updateSession(dataToSave);
    } else if (
      session.id &&
      !isLoaded &&
      (formData.fullName || formData.playerName || formData.club)
    ) {
      const dataToSave = {
        ...debouncedData,
        playerName: debouncedData.fullName,
      };
      updateSession(dataToSave);
    }
  }, [debouncedData, session.id, updateSession, isLoaded]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGameTypeToggle = (type) => {
    setFormData((prev) => {
      const current = prev.gameTypes || [];
      if (current.includes(type)) {
        return { ...prev, gameTypes: current.filter((t) => t !== type) };
      } else {
        return { ...prev, gameTypes: [...current, type] };
      }
    });
  };

  // ── Shared style strings ──
  const labelClass =
    "block text-[9px] font-black uppercase text-[var(--text-primary)] tracking-widest";

  const inputClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-primary)] px-3 py-2 text-xs font-bold uppercase border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  return (
    <div className="mb-8">
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-1 space-y-4">
          {/* ═══ REGISTER Heading ═══ */}
          <h2 className="text-center text-2xl font-black uppercase text-[var(--text-primary)] tracking-widest border-b-2 border-[var(--text-primary)] pb-2 mb-2">
            Register
          </h2>

          {/* ═══ PERSONAL INFORMATION ═══ */}

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

          {/* Date of Birth + Age */}
          <div className="grid grid-cols-[1fr_80px] gap-4">
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
                className={inputClass}
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Place of Birth */}
          <div className="space-y-1">
            <label htmlFor="placeOfBirth" className={labelClass}>
              Place of Birth
            </label>
            <input
              id="placeOfBirth"
              type="text"
              className={inputClass}
              value={formData.placeOfBirth}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              id="address"
              type="text"
              className={inputClass}
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Zip Code / Postal Code */}
          <div className="space-y-1">
            <label htmlFor="zipCode" className={labelClass}>
              Zip Code/Postal Code
            </label>
            <input
              id="zipCode"
              type="text"
              className={inputClass}
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>

          {/* City + Country */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="city" className={labelClass}>
                City
              </label>
              <input
                id="city"
                type="text"
                className={inputClass}
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="country" className={labelClass}>
                Country
              </label>
              <input
                id="country"
                type="text"
                className={inputClass}
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ═══ CONTACT & SOCIAL MEDIA ═══ */}

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClass}
              value={formData.email}
              onChange={handleChange}
            />
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

          {/* Website */}
          <div className="space-y-1">
            <label htmlFor="website" className={labelClass}>
              Website
            </label>
            <input
              id="website"
              type="url"
              className={inputClass}
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          {/* Instagram */}
          <div className="space-y-1">
            <label htmlFor="instagram" className={labelClass}>
              Instagram
            </label>
            <input
              id="instagram"
              type="text"
              className={inputClass}
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>

          {/* TikTok */}
          <div className="space-y-1">
            <label htmlFor="tiktok" className={labelClass}>
              TikTok
            </label>
            <input
              id="tiktok"
              type="text"
              className={inputClass}
              value={formData.tiktok}
              onChange={handleChange}
            />
          </div>

          {/* Facebook */}
          <div className="space-y-1">
            <label htmlFor="facebook" className={labelClass}>
              Facebook
            </label>
            <input
              id="facebook"
              type="text"
              className={inputClass}
              value={formData.facebook}
              onChange={handleChange}
            />
          </div>

          {/* ═══ FAVORITES ═══ */}

          {/* Favorite Team */}
          <div className="space-y-1">
            <label htmlFor="favoriteTeam" className={labelClass}>
              Favorite Team
            </label>
            <input
              id="favoriteTeam"
              type="text"
              className={inputClass}
              value={formData.favoriteTeam}
              onChange={handleChange}
            />
          </div>

          {/* Favorite Player */}
          <div className="space-y-1">
            <label htmlFor="favoritePlayer" className={labelClass}>
              Favorite Player
            </label>
            <input
              id="favoritePlayer"
              type="text"
              className={inputClass}
              value={formData.favoritePlayer}
              onChange={handleChange}
            />
          </div>

          {/* ═══ GAME TYPE ═══ */}
          <div className="space-y-1 pb-4 border-b-2 border-[var(--border-color)]">
            <div
              className="flex justify-between items-center p-1"
              style={{ backgroundColor: "var(--bg-input)" }}
            >
              {GAME_TYPES.map((type) => {
                const isSelected = (formData.gameTypes || []).includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handleGameTypeToggle(type)}
                    className="px-2 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors"
                    style={{
                      color: isSelected
                        ? "var(--color-accent)"
                        : "var(--text-primary)",
                      backgroundColor: isSelected
                        ? "var(--bg-primary)"
                        : "transparent",
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══ EDUCATION ═══ */}

          {/* Middle School + Grade */}
          <div className="grid grid-cols-[1fr_100px] gap-4">
            <div className="space-y-1">
              <label htmlFor="middleSchool" className={labelClass}>
                Middle School
              </label>
              <input
                id="middleSchool"
                type="text"
                className={inputClass}
                value={formData.middleSchool}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="middleSchoolGrade" className={labelClass}>
                Grade
              </label>
              <input
                id="middleSchoolGrade"
                type="text"
                className={inputClass}
                value={formData.middleSchoolGrade}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* High School + Grade */}
          <div className="grid grid-cols-[1fr_100px] gap-4">
            <div className="space-y-1">
              <label htmlFor="highSchool" className={labelClass}>
                High School
              </label>
              <input
                id="highSchool"
                type="text"
                className={inputClass}
                value={formData.highSchool}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="highSchoolGrade" className={labelClass}>
                Grade
              </label>
              <input
                id="highSchoolGrade"
                type="text"
                className={inputClass}
                value={formData.highSchoolGrade}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* College + Year */}
          <div className="grid grid-cols-[1fr_100px] gap-4">
            <div className="space-y-1">
              <label htmlFor="college" className={labelClass}>
                College
              </label>
              <input
                id="college"
                type="text"
                className={inputClass}
                value={formData.college}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="collegeYear" className={labelClass}>
                Year
              </label>
              <input
                id="collegeYear"
                type="text"
                className={inputClass}
                value={formData.collegeYear}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* University + Year */}
          <div className="grid grid-cols-[1fr_100px] gap-4">
            <div className="space-y-1">
              <label htmlFor="university" className={labelClass}>
                University
              </label>
              <input
                id="university"
                type="text"
                className={inputClass}
                value={formData.university}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="universityYear" className={labelClass}>
                Year
              </label>
              <input
                id="universityYear"
                type="text"
                className={inputClass}
                value={formData.universityYear}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ═══ PROFESSIONAL ═══ */}

          {/* Academy + Level */}
          <div className="grid grid-cols-[1fr_100px] gap-4">
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
            <div className="space-y-1">
              <label htmlFor="academyLevel" className={labelClass}>
                Level
              </label>
              <input
                id="academyLevel"
                type="text"
                className={inputClass}
                value={formData.academyLevel}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pro + League */}
          <div className="grid grid-cols-[1fr_100px] gap-4">
            <div className="space-y-1">
              <label htmlFor="pro" className={labelClass}>
                Pro
              </label>
              <input
                id="pro"
                type="text"
                className={inputClass}
                value={formData.pro}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="proLeague" className={labelClass}>
                League
              </label>
              <input
                id="proLeague"
                type="text"
                className={inputClass}
                value={formData.proLeague}
                onChange={handleChange}
              />
            </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
