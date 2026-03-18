// UPDATED: Full theme-aware version
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

export function PlayerAttendanceGrade({ isPdf, pdfPart }) {
  const { reflection, updateReflection } = useActiveSession();
  const [hydrated, setHydrated] = useState(false);

  const [fullData, setFullData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("playerAttendance");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return {
              metadata: {
                date: "",
                time: "",
                team: "",
                age: "",
                sessionType: "",
              },
              records: parsed,
            };
          }
          return parsed;
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      }
    }
    return {
      metadata: {
        date: "",
        time: "",
        team: "",
        age: "",
        sessionType: "",
      },
      records: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: "",
        age: "",
        position: "",
        grades: { A: false, B: false, C: false },
      })),
    };
  });

  useEffect(() => {
    if (!hydrated && reflection?.attendance) {
      setFullData({
        metadata: {
          date: reflection.attendance.metadata?.date ?? "",
          time: reflection.attendance.metadata?.time ?? "",
          team: reflection.attendance.metadata?.team ?? "",
          age: reflection.attendance.metadata?.age ?? "",
          sessionType: reflection.attendance.metadata?.sessionType ?? "",
        },
        records: (reflection.attendance.records ?? []).map((r) => ({
          ...r,
          // support old data that had firstName/lastName
          name: r.name ?? `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim(),
        })),
      });
      setHydrated(true);
    }
  }, [reflection, hydrated]);

  const debouncedData = useDebounce(fullData, 1000);

  useEffect(() => {
    localStorage.setItem("playerAttendance", JSON.stringify(fullData));
  }, [fullData]);

  useEffect(() => {
    if (debouncedData) {
      updateReflection({ attendance: debouncedData });
    }
  }, [debouncedData, updateReflection]);

  const handleMetadataChange = (field, value) => {
    setFullData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }));
  };

  const handleRecordChange = (id, field, value) => {
    setFullData((prev) => ({
      ...prev,
      records: prev.records.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleGradeToggle = (id, grade) => {
    setFullData((prev) => ({
      ...prev,
      records: prev.records.map((item) =>
        item.id === id
          ? {
              ...item,
              grades: {
                A: false,
                B: false,
                C: false,
                [grade]: !item.grades[grade],
              },
            }
          : item,
      ),
    }));
  };

  // Shared input style
  const inputClass =
    "w-full bg-[var(--bg-input)] text-[var(--text-primary)] px-2 py-1 text-xs font-bold border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]";

  const labelClass =
    "block text-[9px] font-black uppercase text-[var(--text-primary)] mb-1 tracking-widest";

  let recordsToRender = fullData.records;
  if (isPdf) {
    if (pdfPart === 1) recordsToRender = recordsToRender.slice(0, 7);
    else if (pdfPart === 2) recordsToRender = recordsToRender.slice(7, 14);
    else if (pdfPart === 3) recordsToRender = recordsToRender.slice(14, 20);
    else if (pdfPart === 4) recordsToRender = recordsToRender.slice(20, 25);
  }

  return (
    <div className={!isPdf ? "mb-6" : ""}>
      {(!isPdf || pdfPart === 1) && (
        <>
          {/* ── Header ── */}
          <div className="text-center mb-4 border-b-2 border-[var(--text-primary)] pb-2">
            <h2 className="text-2xl font-black uppercase text-[var(--text-primary)] tracking-widest">
              GRADE
            </h2>
          </div>

          {/* ── DATE / TIME ── */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className={labelClass}>DATE</label>
              <input
                type="date"
                value={fullData.metadata?.date ?? ""}
                onChange={(e) => handleMetadataChange("date", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>TIME</label>
              <input
                type="time"
                value={fullData.metadata?.time ?? ""}
                onChange={(e) => handleMetadataChange("time", e.target.value)}
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
                value={fullData.metadata?.team ?? ""}
                onChange={(e) => handleMetadataChange("team", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>AGE</label>
              <input
                type="text"
                value={fullData.metadata?.age ?? ""}
                onChange={(e) => handleMetadataChange("age", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* ── Session Type Radio Buttons ── */}
          <div className="flex items-center justify-between mb-4 border-t border-b border-[var(--border-color)] py-2">
            {["GAME", "TRAINING", "TRYOUT", "EVALUATION"].map((type) => (
              <label
                key={type}
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => handleMetadataChange("sessionType", type)}
              >
                {/* Radio circle */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: "var(--text-primary)",
                    backgroundColor:
                      fullData.metadata?.sessionType === type
                        ? "var(--color-accent)"
                        : "transparent",
                  }}
                >
                  {fullData.metadata?.sessionType === type && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[9px] font-black uppercase text-[var(--text-primary)] tracking-wider">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      {/* ── Attendance Table ── */}
      <div className="overflow-x-auto">
        <table
          className="w-full"
          style={{ borderCollapse: "separate", borderSpacing: "4px 2px" }}
        >
          <thead>
            <tr>
              {/* Row # */}
              <th className="p-1 text-[9px] font-black uppercase text-[var(--text-primary)] text-left w-[24px]" />
              <th className="p-1 pr-3 text-[9px] font-black uppercase text-[var(--text-primary)] text-left min-w-[120px]">
                NAME
              </th>
              <th className="px-2 py-1 text-[9px] font-black uppercase text-[var(--text-primary)] text-center w-[50px]">
                AGE
              </th>
              <th className="px-2 py-1 text-[9px] font-black uppercase text-[var(--text-primary)] text-center w-[65px]">
                POSITION
              </th>
              {["A", "B", "C"].map((g) => (
                <th
                  key={g}
                  className="p-1 text-[9px] font-black uppercase text-[var(--text-primary)] text-center w-[30px]"
                >
                  {g}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recordsToRender.map((row, idx) => (
              <tr key={row.id}>
                {/* Row number */}
                <td
                  className="p-1 text-center text-[9px] font-bold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {row.id}
                </td>

                {/* Name */}
                <td
                  className="p-1"
                  style={{ backgroundColor: "var(--bg-input)" }}
                >
                  <input
                    type="text"
                    value={row.name || ""}
                    onChange={(e) =>
                      handleRecordChange(row.id, "name", e.target.value)
                    }
                    className="w-full bg-transparent text-[var(--text-primary)] px-1 py-[2px] text-[9px] font-bold border-b border-[var(--border-color)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </td>

                {/* Age */}
                <td
                  className="px-2 py-1"
                  style={{ backgroundColor: "var(--bg-input)" }}
                >
                  <input
                    type="text"
                    value={row.age || ""}
                    onChange={(e) =>
                      handleRecordChange(row.id, "age", e.target.value)
                    }
                    className="w-full bg-transparent text-[var(--text-primary)] px-1 py-[2px] text-[9px] font-bold border-b border-[var(--border-color)] text-center focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </td>

                {/* Position */}
                <td
                  className="px-2 py-1"
                  style={{ backgroundColor: "var(--bg-input)" }}
                >
                  <input
                    type="text"
                    value={row.position || ""}
                    onChange={(e) =>
                      handleRecordChange(row.id, "position", e.target.value)
                    }
                    className="w-full bg-transparent text-[var(--text-primary)] px-1 py-[2px] text-[9px] font-bold border-b border-[var(--border-color)] text-center focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </td>

                {/* Grade circles A / B / C */}
                {["A", "B", "C"].map((grade) => (
                  <td key={grade} className="p-1 text-center">
                    <label className="flex justify-center items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={row.grades[grade]}
                        onChange={() => handleGradeToggle(row.id, grade)}
                        className="sr-only peer"
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 transition-colors"
                        style={{
                          borderColor: row.grades[grade]
                            ? "var(--color-accent)"
                            : "var(--text-secondary)",
                          backgroundColor: row.grades[grade]
                            ? "var(--color-accent)"
                            : "transparent",
                        }}
                      />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
