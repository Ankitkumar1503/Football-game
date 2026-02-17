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

export function PlayerAttendanceGrade() {
  const { reflection, updateReflection } = useActiveSession();
  const [hydrated, setHydrated] = useState(false);

  // Local state with localStorage initialization
  const [fullData, setFullData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("playerAttendance");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Check if it's the old array format or new object format
          if (Array.isArray(parsed)) {
            return {
              metadata: {
                date: parsed.metadata?.date ?? "",
                game: parsed.metadata?.game ?? "",
                training: parsed.metadata?.training ?? "",
                tryout: parsed.metadata?.tryout ?? "",
                evaluation: parsed.metadata?.evaluation ?? "",
                team: parsed.metadata?.team ?? "",
              },
              records: parsed.records ?? [],
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
        game: "",
        training: "",
        tryout: "",
        evaluation: "",
        team: "",
        sessionType: "", // Added for radio selection persistence
      },
      records: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        lastName: "",
        firstName: "",
        age: "",
        position: "",
        grades: {
          A: false,
          B: false,
          C: false,
        },
      })),
    };
  });

  // console.log("fulldata", fullData);

  useEffect(() => {
    console.log("fulldata changed", fullData);
  }, [fullData]);

  // Sync with DB
  // useEffect(() => {
  //     if (reflection && reflection.attendance) {
  //         setFullData(prev => {
  //             if (JSON.stringify(prev) !== JSON.stringify(reflection.attendance)) {
  //                 // Handle migration from old array format if DB has old data
  //                 if (Array.isArray(reflection.attendance)) {
  //                     return {
  //                         metadata: prev.metadata, // Keep local metadata if exists
  //                         records: reflection.attendance
  //                     };
  //                 }
  //                 return reflection.attendance;
  //             }
  //             return prev;
  //         });
  //     }
  // }, [reflection]);

  useEffect(() => {
    if (!hydrated && reflection?.attendance) {
      setFullData({
        metadata: {
          date: reflection.attendance.metadata?.date ?? "",
          game: reflection.attendance.metadata?.game ?? "",
          training: reflection.attendance.metadata?.training ?? "",
          tryout: reflection.attendance.metadata?.tryout ?? "",
          evaluation: reflection.attendance.metadata?.evaluation ?? "",
          team: reflection.attendance.metadata?.team ?? "",
        },
        records: reflection.attendance.records ?? [],
      });
      setHydrated(true);
    }
  }, [reflection, hydrated]);

  const debouncedData = useDebounce(fullData, 1000);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("playerAttendance", JSON.stringify(fullData));
  }, [fullData]);

  // Save to DB
  useEffect(() => {
    if (debouncedData) {
      updateReflection({ attendance: debouncedData });
    }
  }, [debouncedData, updateReflection]);

  const handleMetadataChange = (field, value) => {
    setFullData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
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

  return (
    <Card className="mb-6 bg-white dark:bg-[#1A1A1A] border-none shadow-none">
      <CardContent className="p-2">
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl font-black uppercase text-center text-white mb-6">
            PLAYER GRADE
          </h1>

          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-bold uppercase text-white">
              PLAYER ATTENDANCE RECORD/GRADE
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold uppercase text-white">
                DATE
              </label>
              <input
                name="date"
                type="date"
                value={fullData.metadata?.date}
                onChange={(e) => handleMetadataChange("date", e.target.value)}
                className="bg-[#E5E5E5] text-black px-2 py-1 text-sm font-bold border-none w-40"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-4">
              {["GAME", "TRAINING", "TRYOUT", "EVALUATION"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-xs font-bold uppercase text-white">
                    {type}
                  </span>
                  <div
                    onClick={() => handleMetadataChange("sessionType", type)}
                    className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                      fullData.metadata?.sessionType === type
                        ? "bg-white"
                        : "bg-transparent"
                    }`}
                  ></div>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-1">
              <label className="text-xs font-bold uppercase text-white whitespace-nowrap">
                TEAM
              </label>
              <input
                name="team"
                type="text"
                value={fullData.metadata?.team ?? ""}
                onChange={(e) => handleMetadataChange("team", e.target.value)}
                className="w-full bg-[#E5E5E5] text-black px-2 py-1 text-sm font-bold border-none"
              />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-transparent text-white">
                <th className="p-1 text-[10px] font-bold uppercase text-left w-[30px]"></th>
                <th className="p-1 text-[10px] font-bold uppercase text-left">
                  LAST NAME
                </th>
                <th className="p-1 text-[10px] font-bold uppercase text-left">
                  FIRST NAME
                </th>
                <th className="p-1 text-[10px] font-bold uppercase text-center w-[60px]">
                  AGE
                </th>
                <th className="p-1 text-[10px] font-bold uppercase text-center w-[80px]">
                  POSITION
                </th>
                <th className="p-1 text-[10px] font-bold uppercase text-center w-[40px]">
                  A
                </th>
                <th className="p-1 text-[10px] font-bold uppercase text-center w-[40px]">
                  B
                </th>
                <th className="p-1 text-[10px] font-bold uppercase text-center w-[40px]">
                  C
                </th>
              </tr>
            </thead>
            <tbody>
              {fullData.records.map((row) => (
                <tr
                  key={row.id}
                  className="bg-transparent border-b border-gray-700/50"
                >
                  {/* Row Number */}
                  <td className="p-1 text-center text-xs font-bold text-gray-400">
                    {row.id}
                  </td>

                  {/* Last Name */}
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.lastName}
                      onChange={(e) =>
                        handleRecordChange(row.id, "lastName", e.target.value)
                      }
                      className="w-full bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold border-none"
                    />
                  </td>

                  {/* First Name */}
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.firstName}
                      onChange={(e) =>
                        handleRecordChange(row.id, "firstName", e.target.value)
                      }
                      className="w-full bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold border-none"
                    />
                  </td>

                  {/* Age */}
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.age || ""}
                      onChange={(e) =>
                        handleRecordChange(row.id, "age", e.target.value)
                      }
                      className="w-full bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold border-none text-center"
                    />
                  </td>

                  {/* Position */}
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.position}
                      onChange={(e) =>
                        handleRecordChange(row.id, "position", e.target.value)
                      }
                      className="w-full bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold border-none text-center"
                    />
                  </td>

                  {/* Grade Checkboxes */}
                  {["A", "B", "C"].map((grade) => (
                    <td key={grade} className="p-1 text-center align-middle">
                      <label className="flex justify-center items-center cursor-pointer h-full w-full">
                        <input
                          type="checkbox"
                          checked={row.grades[grade]}
                          onChange={() => handleGradeToggle(row.id, grade)}
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 rounded-full bg-[#E5E5E5] peer-checked:bg-[#FF4422] transition-colors"></div>
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
