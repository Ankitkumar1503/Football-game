import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Check, X, RotateCcw, Activity, Undo2 } from 'lucide-react';
import { useActiveSession } from '../../hooks/useActiveSession';

export function ActionWheelOld() {
    const [selectedAction, setSelectedAction] = useState(null);
    const { addTouch } = useActiveSession();

    const handleActionClick = (action) => {
        setSelectedAction(action);
    };

    const handleRating = async (quality) => {
        if (selectedAction) {
            await addTouch(selectedAction, quality === 'positive' ? 'Positive' : 'Negative');
            setTimeout(() => setSelectedAction(null), 300);
        }
    };

    const resetSelection = () => {
        setSelectedAction(null);
    };

    return (
        <>
            <div className="pt-2">
                <h3 className="text-2xl font-black uppercase text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-black/80 dark:border-white/80 pb-1">TOUCHES</h3>
            </div>
            <div className="w-full max-w-5xl mx-auto mb-12 select-none flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[420px] md:max-w-[540px] bg-[#0A0A0A] rounded-full">

                    {/* Overlay Menu */}
                    {selectedAction ? (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0A0A]/98 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-200 border-4 border-[#FF4422] shadow-[0_0_30px_rgba(255,68,34,0.5)]">
                            <h3 className="text-4xl font-black mb-8 uppercase text-white font-display tracking-wider text-glow text-center px-4">{selectedAction}</h3>
                            <div className="flex gap-8">
                                <button onClick={() => handleRating('positive')} className="flex flex-col items-center gap-2 group transition-transform hover:scale-105">
                                    <div className="w-20 h-20 rounded-full bg-[#FF4422] flex items-center justify-center border-4 border-white shadow-lg shadow-[#FF4422]/50">
                                        <Check className="size-10 text-white stroke-[4]" />
                                    </div>
                                    <span className="text-white font-black text-lg tracking-widest mt-2">POS</span>
                                </button>
                                <button onClick={() => handleRating('negative')} className="flex flex-col items-center gap-2 group transition-transform hover:scale-105">
                                    <div className="w-20 h-20 rounded-full bg-[#2A2A2A] flex items-center justify-center border-4 border-white shadow-lg">
                                        <X className="size-10 text-white stroke-[4]" />
                                    </div>
                                    <span className="text-white font-black text-lg tracking-widest mt-2">NEG</span>
                                </button>
                            </div>
                            <button onClick={resetSelection} className="mt-10 text-sm text-gray-400 hover:text-[#FF4422] font-bold uppercase tracking-[0.2em] transition-colors">Cancel</button>
                        </div>
                    ) : null}

                    <svg viewBox="0 0 500 500" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 68, 34, 0.3))' }}>

                        {/* TOP ARCHES (Pos/Neg) */}
                        <path d="M205,120 L120,145 L65,110 A235,235 0 0,1 250,15 L250,80 Z" className="fill-[#FF4422] cursor-pointer hover:brightness-110" onClick={() => handleRating('negative')} />
                        <path d="M295,120 L380,145 L435,110 A235,235 0 0,0 250,15 L250,80 Z" className="fill-[#FF4422] cursor-pointer hover:brightness-110" onClick={() => handleRating('positive')} />

                        <g className="stroke-[#FF4422] stroke-[3] fill-transparent" style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}>

                            {/* CENTER: PASS */}
                            <path d="M250,175 L315,212.5 L315,287.5 L250,325 L185,287.5 L185,212.5 Z"
                                className="fill-[#FF4422] cursor-pointer hover:brightness-110" onClick={() => handleActionClick('Pass')} />

                            {/* INNER RING (Top CW) */}
                            {/* Top: Corner Kick */}
                            <path d="M185,212.5 L250,175 L315,212.5 L295,120 L205,120 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Corner Kick')} />

                            {/* Top Right: Long Pass (Mapped from First Touch slot) */}
                            <path d="M315,212.5 L295,120 L380,145 L390,240 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Long Pass')} />

                            {/* Bot Right: Header (Mapped from Tackle slot) */}
                            <path d="M315,212.5 L390,240 L370,340 L315,287.5 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Header')} />

                            {/* Bot: Penalty Kick (Mapped from Shot slot) */}
                            <path d="M315,287.5 L250,325 L185,287.5 L210,390 L290,390 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Penalty Kick')} />

                            {/* Bot Left: Cross (Mapped from Controlling slot) */}
                            <path d="M185,287.5 L210,390 L125,360 L130,260 L185,212.5 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Cross')} />

                            {/* Top Left: Dribble */}
                            <path d="M185,212.5 L130,260 L120,145 L205,120 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Dribble')} />


                            {/* OUTER RING */}
                            {/* Left: Free Kick */}
                            <path d="M130,260 L25,260 A235,235 0 0,1 65,110 L120,145 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Free Kick')} />

                            {/* Bot Left: Shot (Mapped from Free Kick slot roughly) */}
                            <path d="M125,360 L80,410 A235,235 0 0,1 25,260 L130,260 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Shot')} />

                            {/* Bot Center: Tackle (Mapped from Goal Kick slot) */}
                            <path d="M210,390 L180,470 A235,235 0 0,1 80,410 L125,360 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Tackle')} />

                            {/* Bot Right: Goal (Mapped from Red Card slot) */}
                            <path d="M290,390 L320,470 A235,235 0 0,1 180,470 L210,390 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Goal')} />

                            {/* Right: ??? (Empty / Extra slot - Mapped from Goal slot) */}
                            <path d="M370,340 L420,410 A235,235 0 0,1 320,470 L290,390 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Cross')} />

                            {/* Right Top: ??? (Mapped from Penalty Kick slot - wait, mapping is tricky) */}
                            <path d="M390,240 L475,260 A235,235 0 0,1 420,410 L370,340 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Long Pass')} />

                            {/* Right High: ??? (Mapped from Header slot) */}
                            <path d="M380,145 L435,110 A235,235 0 0,1 475,260 L390,240 Z" className="hover:fill-[#FF4422]/20 cursor-pointer" onClick={() => handleActionClick('Long Pass')} />

                        </g>

                        {/* LABELS */}
                        <g className="fill-white stroke-none font-display font-black pointer-events-none uppercase" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}>
                            <text x="250" y="262" textAnchor="middle" className="text-[36px] tracking-widest">PASS</text>

                            <text x="250" y="155" textAnchor="middle" className="text-[16px]">
                                <tspan x="250" dy="-6">CORNER</tspan><tspan x="250" dy="16">KICK</tspan>
                            </text>
                            <text x="160" y="210" textAnchor="middle" className="text-[16px]">DRIBBLE</text>
                            <text x="165" y="325" textAnchor="middle" className="text-[16px]">CROSS</text>
                            <text x="250" y="375" textAnchor="middle" className="text-[16px]">PENALTY</text>
                            <text x="345" y="295" textAnchor="middle" className="text-[16px]">HEADER</text>
                            <text x="340" y="200" textAnchor="middle" className="text-[14px]">
                                <tspan x="340" dy="-6">LONG</tspan><tspan x="340" dy="16">PASS</tspan>
                            </text>

                            {/* OUTERS */}
                            <text x="70" y="200" textAnchor="middle" className="text-[15px]">
                                <tspan x="70" dy="0">FREE</tspan><tspan x="70" dy="18">KICK</tspan>
                            </text>
                            <text x="60" y="330" textAnchor="middle" className="text-[18px]">SHOT</text>
                            <text x="130" y="435" textAnchor="middle" className="text-[16px]">TACKLE</text>
                            <text x="250" y="455" textAnchor="middle" className="text-[16px]">GOAL</text>

                            {/* Arches Text */}
                            <text x="170" y="80" transform="rotate(-20, 170, 80)" textAnchor="middle" className="text-[12px]">NEGATIVE</text>
                            <text x="330" y="80" transform="rotate(20, 330, 80)" textAnchor="middle" className="text-[12px]">POSITIVE</text>
                        </g>
                    </svg>
                </div>

                {/* Red/Yellow Cards */}
                <div className="flex justify-between w-full max-w-md px-4">
                    <button
                        onClick={() => handleActionClick('Red Card')}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-12 h-14 bg-[#FF4422] rounded-sm shadow-[0_0_15px_rgba(255,68,34,0.5)] group-hover:scale-110 transition-transform cursor-pointer"></div>
                        <span className="text-white font-black uppercase text-sm">RED CARD</span>
                    </button>
                    <button
                        onClick={() => handleActionClick('Yellow Card')}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-12 h-14 bg-[#EAB308] rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform cursor-pointer"></div>
                        <span className="text-white font-black uppercase text-sm">YELLOW CARD</span>
                    </button>
                </div>
            </div>
        </>
    );
}
