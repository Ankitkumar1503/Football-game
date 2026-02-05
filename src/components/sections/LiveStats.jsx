import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { useActiveSession } from '../../hooks/useActiveSession';
import { RotateCcw } from 'lucide-react';
import { db } from '../../lib/db';

export function LiveStats() {
    const { stats, sessionId } = useActiveSession();

    const handleReset = async () => {
        if (!sessionId) return;
        if (confirm('Are you sure you want to reset the touches for this session?')) {
            try {
                await db.touches.where('sessionId').equals(sessionId).delete();
            } catch (error) {
                console.error('Error resetting touches:', error);
            }
        }
    };

    const StatRow = ({ label, value }) => (
        <div className="flex items-center justify-between bg-[#FF4422] text-white p-2 border-b border-black/20 last:border-0">
            <span className="font-black uppercase tracking-wider text-sm md:text-base">{label}</span>
            <span className="font-black text-lg md:text-xl">{value}</span>
        </div>
    );

    return (
        <div className="mb-8">
            <div className="flex justify-between items-end mb-2 border-b-2 border-black/80 dark:border-white/80 pb-1">
                <h2 className="text-2xl font-black uppercase text-black dark:text-gray-200 tracking-tighter">TOTAL TOUCHES</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-2">
                {/* Left Column */}
                <div className="flex flex-col border-4 border-[#FF4422]">
                    <StatRow label="PASS" value={stats.Pass} />
                    <StatRow label="DRIBBLE" value={stats.Dribble} />
                    <StatRow label="CORNER KICK" value={stats['Corner Kick']} />
                    <StatRow label="HEADER" value={stats.Header} />
                    <StatRow label="TACKLE" value={stats.Tackle} />
                    <StatRow label="GOAL" value={stats.Goal} />
                    <StatRow label="SHOT" value={stats.Shot} />
                </div>

                {/* Right Column */}
                <div className="flex flex-col border-4 border-[#FF4422]">
                    <StatRow label="FREE KICK" value={stats['Free Kick']} />
                    <StatRow label="PENALTY KICK" value={stats['Penalty Kick']} />
                    <StatRow label="CROSS" value={stats.Cross} />
                    <StatRow label="POSITIVE TOUCH" value={stats.good} />
                    <StatRow label="NEGATIVE TOUCH" value={stats.bad} />
                    <StatRow label="YELLOW CARDS" value={stats['Yellow Card']} />
                    <StatRow label="RED CARDS" value={stats['Red Card']} />
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-black dark:text-gray-300 font-black uppercase hover:text-[#FF4422] transition-colors"
                >
                    <span className="text-xl tracking-tighter">RESET</span>
                </button>
            </div>

            {/* <div className="mt-8 space-y-4">
                <div>
                    <h3 className="font-bold text-sm uppercase mb-1 dark:text-gray-200">FIVE FUNDAMENTAL ACTIONS:</h3>
                    <h4 className="font-black text-lg uppercase mb-2 dark:text-white">Passing, dribbling, shooting, receiving, controlling, tackling.</h4>
                    <ul className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>* Passing: This involves kicking the ball to a teammate, usually with the inside or instep of the foot for accuracy.</li>
                        <li>* Dribbling: This is the act of running with the ball and keeping it under close control.</li>
                        <li>* Shooting: Players strike the ball with power towards the opponent's goal.</li>
                        <li>* Receiving/Controlling (Trapping): This skill involves stopping or slowing down a moving ball to gain control.</li>
                        <li>* Tackling: This is a defensive technique where a player uses their feet to take the ball away from an opponent.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-sm uppercase mb-2 dark:text-gray-200">Key Actions</h3>
                    <ul className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>* Kick-off: Used to start the game, the second half, and after a goal is scored.</li>
                        <li>* Throw-in: Awarded when the whole ball passes over the touchline.</li>
                        <li>* Goal Kick: Awarded when the attacking team is the last to touch the ball before it crosses the goal line.</li>
                        <li>* Corner Kick: Awarded when the defending team is the last to touch the ball before it crosses their own goal line.</li>
                        <li>* Free Kicks: Awarded for various fouls or infringements.</li>
                        <li>* Penalty Kick: A direct free kick awarded when a defending player commits a foul within their own penalty area.</li>
                    </ul>
                </div>
            </div> */}
        </div>
    );
}
