import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { useActiveSession } from '../../hooks/useActiveSession';

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
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('playerAttendance');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Check if it's the old array format or new object format
                    if (Array.isArray(parsed)) {
                        return {
                            metadata: {
                                date: parsed.metadata?.date ?? '',
                                game: parsed.metadata?.game ?? '',
                                training: parsed.metadata?.training ?? '',
                                tryout: parsed.metadata?.tryout ?? '',
                                evaluation: parsed.metadata?.evaluation ?? '',
                                team: parsed.metadata?.team ?? '',
                            },
                            records: parsed.records ?? []
                        };
                        ;
                    }
                    return parsed;
                } catch (e) {
                    console.error('Error parsing localStorage data:', e);
                }
            }
        }
        return {
            metadata: {
                date: '',
                game: '',
                training: '',
                tryout: '',
                evaluation: '',
                team: ''
            },
            records: Array.from({ length: 25 }, (_, i) => ({
                id: i + 1,
                lastName: '',
                firstName: '',
                dob: '',
                position: '',
                grades: {
                    A: false,
                    'B+': false,
                    B: false,
                    'C+': false,
                    C: false
                }
            }))
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
                    date: reflection.attendance.metadata?.date ?? '',
                    game: reflection.attendance.metadata?.game ?? '',
                    training: reflection.attendance.metadata?.training ?? '',
                    tryout: reflection.attendance.metadata?.tryout ?? '',
                    evaluation: reflection.attendance.metadata?.evaluation ?? '',
                    team: reflection.attendance.metadata?.team ?? '',
                },
                records: reflection.attendance.records ?? []
            });
            setHydrated(true);
        }
    }, [reflection, hydrated]);




    const debouncedData = useDebounce(fullData, 1000);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('playerAttendance', JSON.stringify(fullData));
    }, [fullData]);

    // Save to DB
    useEffect(() => {
        if (debouncedData) {
            updateReflection({ attendance: debouncedData });
        }
    }, [debouncedData, updateReflection]);

    const handleMetadataChange = (field, value) => {
        setFullData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [field]: value
            }
        }));
    };

    const handleRecordChange = (id, field, value) => {
        setFullData(prev => ({
            ...prev,
            records: prev.records.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleGradeToggle = (id, grade) => {
        setFullData(prev => ({
            ...prev,
            records: prev.records.map(item =>
                item.id === id
                    ? {
                        ...item,
                        grades: {
                            A: false,
                            'B+': false,
                            B: false,
                            'C+': false,
                            C: false,
                            [grade]: !item.grades[grade]
                        }
                    }
                    : item
            )
        }));
    };

    return (
        <Card className="mb-6 bg-white dark:bg-[#1A1A1A] border-none shadow-none">
            <CardContent className="p-2">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-black dark:border-white pb-2">
                    <h2 className="text-2xl font-black uppercase text-black dark:text-white">
                        PLAYER ATTENDANCE RECORD/GRADE
                    </h2>
                </div>

                {/* Date, Game, Training, Tryout, Evaluation, Team inputs */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                            DATE
                        </label>
                        <input
                            name='date'
                            type="date"
                            value={fullData.metadata?.date}
                            onChange={(e) => handleMetadataChange('date', e.target.value)}
                            className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                            GAME
                        </label>
                        <input
                            name='game'
                            type="text"
                            value={fullData.metadata?.game ?? ''}
                            onChange={(e) => handleMetadataChange('game', e.target.value)}
                            className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                            TRAINING
                        </label>
                        <input
                            type="text"
                            value={fullData.metadata.training}
                            onChange={(e) => handleMetadataChange('training', e.target.value)}
                            className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                            TRYOUT
                        </label>
                        <input
                            type="text"
                            value={fullData.metadata.tryout}
                            onChange={(e) => handleMetadataChange('tryout', e.target.value)}
                            className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                            EVALUATION
                        </label>
                        <input
                            type="text"
                            value={fullData.metadata.evaluation}
                            onChange={(e) => handleMetadataChange('evaluation', e.target.value)}
                            className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                            TEAM
                        </label>
                        <input
                            type="text"
                            value={fullData.metadata.team}
                            onChange={(e) => handleMetadataChange('team', e.target.value)}
                            className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                        />
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#E5E5E5] dark:bg-[#202020]">
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[40px]">
                                    #
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-left">
                                    LAST NAME
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-left">
                                    FIRST NAME
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[80px]">
                                    D.O.B.
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[80px]">
                                    POSITION
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[40px]">
                                    A
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[40px]">
                                    B+
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[40px]">
                                    B
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[40px]">
                                    C+
                                </th>
                                <th className="border-2 border-black dark:border-white/20 p-2 text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 text-center w-[40px]">
                                    C
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {fullData.records.map((row) => (
                                <tr key={row.id} className="bg-white dark:bg-[#1A1A1A]">
                                    {/* Row Number */}
                                    <td className="border-2 border-black dark:border-white/20 p-2 text-center text-xs font-bold text-gray-800 dark:text-gray-300">
                                        {row.id}
                                    </td>

                                    {/* Last Name */}
                                    <td className="border-2 border-black dark:border-white/20 p-1">
                                        <input
                                            type="text"
                                            value={row.lastName}
                                            onChange={(e) => handleRecordChange(row.id, 'lastName', e.target.value)}
                                            className="w-full bg-transparent text-xs font-bold text-gray-800 dark:text-gray-300 border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422] px-1"
                                        />
                                    </td>

                                    {/* First Name */}
                                    <td className="border-2 border-black dark:border-white/20 p-1">
                                        <input
                                            type="text"
                                            value={row.firstName}
                                            onChange={(e) => handleRecordChange(row.id, 'firstName', e.target.value)}
                                            className="w-full bg-transparent text-xs font-bold text-gray-800 dark:text-gray-300 border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422] px-1"
                                        />
                                    </td>

                                    {/* D.O.B. */}
                                    <td className="border-2 border-black dark:border-white/20 p-1">
                                        <input
                                            type="text"
                                            value={row.dob}
                                            onChange={(e) => handleRecordChange(row.id, 'dob', e.target.value)}
                                            className="w-full bg-transparent text-xs font-bold text-gray-800 dark:text-gray-300 border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422] px-1 text-center"
                                        />
                                    </td>

                                    {/* Position */}
                                    <td className="border-2 border-black dark:border-white/20 p-1">
                                        <input
                                            type="text"
                                            value={row.position}
                                            onChange={(e) => handleRecordChange(row.id, 'position', e.target.value)}
                                            className="w-full bg-transparent text-xs font-bold text-gray-800 dark:text-gray-300 border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422] px-1 text-center"
                                        />
                                    </td>

                                    {/* Grade Checkboxes */}
                                    {['A', 'B+', 'B', 'C+', 'C'].map((grade) => (
                                        <td
                                            key={grade}
                                            className="border-2 border-black dark:border-white/20 p-2 text-center"
                                        >
                                            <label className="flex justify-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={row.grades[grade]}
                                                    onChange={() => handleGradeToggle(row.id, grade)}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-5 h-5 rounded-full bg-[#E5E5E5] dark:bg-[#303030] border-2 border-gray-400 dark:border-gray-600 peer-checked:bg-[#FF4422] peer-checked:border-[#FF4422] transition-colors"></div>
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
