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

export function FootballFormation() {
    const { reflection, updateReflection } = useActiveSession();
    const [hydrated, setHydrated] = useState(false);


    // Local state with localStorage initialization
    const [formData, setFormData] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('footballFormation');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Error parsing localStorage data:', e);
                }
            }
        }
        return {
            event: '',
            date: '',
            location: '',
            teamName: '',
            age: '',
            game: '',
            session: '',
            subs: ['', '', '', '', ''],
            alts: ['', '', '', ''],
            notes: '',
            category: 'TRAINING',
            players: {
                1: '', // Goalkeeper
                2: '', // Right Back
                3: '', // Left Center Back
                4: '', // Center Back
                5: '', // Right Center Back
                6: '', // Defensive Mid
                7: '', // Right Wing
                8: '', // Center Mid
                9: '', // Striker
                10: '', // Attacking Mid
                11: '' // Left Wing
            }
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
                event: reflection.formation.event ?? '',
                date: reflection.formation.date ?? '',
                location: reflection.formation.location ?? '',
                teamName: reflection.formation.teamName ?? '',
                age: reflection.formation.age ?? '',
                game: reflection.formation.game ?? '',
                session: reflection.formation.session ?? '',
                subs: reflection.formation.subs ?? ['', '', '', '', ''],
                alts: reflection.formation.alts ?? ['', '', '', ''],
                notes: reflection.formation.notes ?? '',
                category: reflection.formation.category ?? 'TRAINING',
                players: reflection.formation.players ?? {
                    1: '', 2: '', 3: '', 4: '', 5: '',
                    6: '', 7: '', 8: '', 9: '', 10: '', 11: ''
                }
            });

            setHydrated(true);
        }
    }, [reflection, hydrated]);


    const debouncedData = useDebounce(formData, 1000);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('footballFormation', JSON.stringify(formData));
    }, [formData]);

    // Save to DB
    useEffect(() => {
        if (debouncedData) {
            updateReflection({ formation: debouncedData });
        }
    }, [debouncedData, updateReflection]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePlayerChange = (position, value) => {
        setFormData(prev => ({
            ...prev,
            players: { ...prev.players, [position]: value }
        }));
    };

    const handleSubsChange = (index, value) => {
        const newSubs = [...formData.subs];
        newSubs[index] = value;
        setFormData(prev => ({ ...prev, subs: newSubs }));
    };

    const handleAltsChange = (index, value) => {
        const newAlts = [...formData.alts];
        newAlts[index] = value;
        setFormData(prev => ({ ...prev, alts: newAlts }));
    };

    return (
        <Card className="mb-6 bg-white dark:bg-[#1A1A1A] border-none shadow-none">
            <CardContent className="p-4">
                <div className="border-4 border-gray-400 dark:border-gray-600 p-4">
                    {/* Header Section */}
                    <div className="space-y-3 mb-4">
                        {/* Event and Date */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                    EVENT
                                </label>
                                <input
                                    type="text"
                                    value={formData.event}
                                    onChange={(e) => handleInputChange('event', e.target.value)}
                                    className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                    DATE
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                    className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                LOCATION
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                            />
                        </div>

                        {/* Team Name, Age, Game, Session */}
                        <div className="grid grid-cols-4 gap-2">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                    TEAM NAME
                                </label>
                                <input
                                    type="text"
                                    value={formData.teamName}
                                    onChange={(e) => handleInputChange('teamName', e.target.value)}
                                    className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                    AGE
                                </label>
                                <input
                                    type="text"
                                    value={formData.age}
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                    className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                    GAME #
                                </label>
                                <input
                                    type="text"
                                    value={formData.game}
                                    onChange={(e) => handleInputChange('game', e.target.value)}
                                    className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                    SESSION#
                                </label>
                                <input
                                    type="text"
                                    value={formData.session}
                                    onChange={(e) => handleInputChange('session', e.target.value)}
                                    className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area - Subs, Alts, Notes, Category, Field */}
                    <div className="grid grid-cols-12 gap-3">
                        {/* Left Side - Subs */}
                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                SUBS
                            </label>
                            <div className="space-y-1">
                                {formData.subs.map((sub, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={sub}
                                        onChange={(e) => handleSubsChange(index, e.target.value)}
                                        className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Alts */}
                        <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                ALTS
                            </label>
                            <div className="space-y-1">
                                {formData.alts.map((alt, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={alt}
                                        onChange={(e) => handleAltsChange(index, e.target.value)}
                                        className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-1 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422]"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Middle - Notes */}
                        <div className="col-span-5">
                            <label className="text-[10px] font-black uppercase text-gray-800 dark:text-gray-300 block mb-1">
                                NOTES
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                rows={6}
                                className="w-full bg-[#E5E5E5] dark:bg-[#202020] text-black dark:text-white px-2 py-2 text-xs font-bold border-none focus:outline-none focus:ring-1 focus:ring-[#FF4422] resize-none"
                            />
                        </div>

                        {/* Right - Category Radio Buttons */}
                        <div className="col-span-3">
                            <div className="space-y-2">
                                {['TRAINING', 'ODP', 'POOL', 'REGION', 'ACADEMY', 'CLUB'].map((category) => (
                                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category}
                                            checked={formData.category === category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-4 h-4 rounded-full bg-[#E5E5E5] dark:bg-[#303030] border-2 border-gray-400 dark:border-gray-600 peer-checked:bg-[#FF4422] peer-checked:border-[#FF4422] transition-colors"></div>
                                        <span className="text-xs font-black uppercase text-gray-800 dark:text-gray-300">
                                            {category}
                                        </span>
                                    </label>
                                ))}
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
                            style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)' }}
                        />

                        {/* Defenders */}
                        <PlayerPosition
                            number={2}
                            name={formData.players[2]}
                            onChange={(val) => handlePlayerChange(2, val)}
                            style={{ bottom: '22%', right: '3%' }}
                        />
                        <PlayerPosition
                            number={3}
                            name={formData.players[3]}
                            onChange={(val) => handlePlayerChange(3, val)}
                            style={{ bottom: '22%', left: '3%' }}
                        />
                        <PlayerPosition
                            number={4}
                            name={formData.players[4]}
                            onChange={(val) => handlePlayerChange(4, val)}
                            style={{ bottom: '22%', right: '25%' }}
                        />
                        <PlayerPosition
                            number={5}
                            name={formData.players[5]}
                            onChange={(val) => handlePlayerChange(5, val)}
                            style={{ bottom: '22%', left: '25%' }}
                        />

                        {/* Midfielders */}
                        <PlayerPosition
                            number={6}
                            name={formData.players[6]}
                            onChange={(val) => handlePlayerChange(6, val)}
                            style={{ bottom: '42%', left: '50%', transform: 'translateX(-50%)' }}
                        />
                        <PlayerPosition
                            number={7}
                            name={formData.players[7]}
                            onChange={(val) => handlePlayerChange(7, val)}
                            style={{ bottom: '70%', right: '3%' }}
                        />
                        <PlayerPosition
                            number={8}
                            name={formData.players[8]}
                            onChange={(val) => handlePlayerChange(8, val)}
                            style={{ bottom: '55%', right: '19%' }}
                        />
                        <PlayerPosition
                            number={10}
                            name={formData.players[10]}
                            onChange={(val) => handlePlayerChange(10, val)}
                            style={{ bottom: '55%', left: '19%' }}
                        />
                        <PlayerPosition
                            number={11}
                            name={formData.players[11]}
                            onChange={(val) => handlePlayerChange(11, val)}
                            style={{ bottom: '70%', left: '3%' }}
                        />

                        {/* Striker */}
                        <PlayerPosition
                            number={9}
                            name={formData.players[9]}
                            onChange={(val) => handlePlayerChange(9, val)}
                            style={{ top: '18%', left: '50%', transform: 'translateX(-50%)' }}
                        />
                    </div>
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
                    <span className="text-white dark:text-black text-xs font-black">{number}</span>
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