import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { useActiveSession } from '../../hooks/useActiveSession';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const LEVELS = [
    'FUN', 'GRASSROOTS', 'REC', 'TRAINING', 'TRYOUTS',
    'CLUB', 'ACADEMY', 'COLLEGE', 'UNIVERSITY', 'PRO'
];

export function PlayerProfile() {
    const { session, updateSession } = useActiveSession();

    // Local state
    const [formData, setFormData] = useState({
        level: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        playerName: '',
        age: '',
        club: '',
        team: '',
        position: '',
        totalYearsPlaying: '',
        totalHoursTrained: '',
        gameNumber: ''
    });

    // Load session data
    useEffect(() => {
        if (session.id) {
            setFormData({
                level: session.level || '',
                date: session.date || new Date().toISOString().split('T')[0],
                time: session.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                playerName: session.playerName || '',
                age: session.age || '',
                club: session.club || '',
                team: session.team || '',
                position: session.position || '',
                totalYearsPlaying: session.totalYearsPlaying || '',
                totalHoursTrained: session.totalHoursTrained || '',
                gameNumber: session.gameNumber || ''
            });
        }
    }, [session.id, session.level, session.date, session.time, session.playerName, session.age, session.club, session.team, session.position, session.totalYearsPlaying, session.totalHoursTrained, session.gameNumber]);

    const debouncedData = useDebounce(formData, 800);

    // Auto-save
    useEffect(() => {
        if (session.id) {
            updateSession(debouncedData);
        }
    }, [debouncedData, session.id, updateSession]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleLevelSelect = (level) => {
        setFormData(prev => ({ ...prev, level }));
    };

    const handlePositionSelect = (num) => {
        setFormData(prev => ({ ...prev, position: num.toString() }));
    };

    return (
        <div className="mb-8">
            {/* Level Selector */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 px-2">
                {LEVELS.map(level => (
                    <button
                        key={level}
                        onClick={() => handleLevelSelect(level)}
                        className={`text-xs md:text-sm font-black uppercase tracking-wider transition-colors ${formData.level === level
                                ? 'text-[#FF4422] scale-105'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0 space-y-4">
                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="date" className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200">Date</label>
                            <input
                                id="date"
                                type="date"
                                className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="time" className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200">Time</label>
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
                            <label htmlFor="playerName" className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200">Name of Player</label>
                            <input
                                id="playerName"
                                type="text"
                                className="w-full bg-[#E5E5E5] text-black px-3 py-2 text-sm font-bold uppercase rounded-sm border-none focus:ring-1 focus:ring-[#FF4422]"
                                value={formData.playerName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="age" className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200">Age</label>
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
                        <label htmlFor="club" className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200">Club</label>
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
                        <label htmlFor="team" className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200">Team</label>
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
                        <label className="block text-xs font-black uppercase text-gray-800 dark:text-gray-200 mb-2">Position:</label>
                        <div className="flex justify-between items-center bg-[#E5E5E5] p-1 rounded-sm">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handlePositionSelect(num)}
                                    className={`w-7 h-7 flex items-center justify-center text-sm font-black transition-colors ${formData.position === num.toString()
                                            ? 'text-[#FF4422] bg-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Player Stats */}
                    <div className="pt-2">
                        <h3 className="text-sm font-black uppercase text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-black/80 dark:border-white/80 pb-1">Player Stats</h3>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="totalYearsPlaying" className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Total Years Playing</label>
                                <input
                                    id="totalYearsPlaying"
                                    type="number"
                                    className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                                    value={formData.totalYearsPlaying}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="totalHoursTrained" className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Total Hours Trained</label>
                                <input
                                    id="totalHoursTrained"
                                    type="number"
                                    className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm border-none"
                                    value={formData.totalHoursTrained}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Total Sessions (Read Only from DB or State) */}
                            {/* Note: This would typically be a count of all sessions for this player, but for now we'll just hardcode or leave as input if requested. 
                                 Image shows 'TOTAL NUMBER OF SESSIONS'. Let's make it inputs for now to match the "form" feel, 
                                 but ideally this is calculated. The user said "analysis this code" and "save performance". 
                                 I'll imply these are editable for now to seed data. */}
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Total Number of Sessions</label>
                                <div className="w-20 bg-[#E5E5E5] text-black px-2 py-1 text-xs font-bold text-center rounded-sm opacity-50 cursor-not-allowed">
                                    {/* Placeholder */}
                                    -
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
