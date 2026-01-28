import React from 'react';
import { ActionWheel } from './sections/ActionWheel';
import { PlayerProfile } from './sections/PlayerProfile';
import { LiveStats } from './sections/LiveStats';
import { PlayerEvaluation } from './sections/PlayerEvaluation';
import { PlayerReflection, BottomBar } from './sections/ReflectionAndFooter';
import footballImage from '../assets/football.png';
import { useActiveSession } from '../hooks/useActiveSession';

export function Dashboard() {
    // Initialize the active session hook - this will create/load a session automatically
    useActiveSession();

    return (
        <div id="printable-dashboard" className="min-h-screen pb-20 bg-[#0A0A0A] text-white font-sans selection:bg-[#FF4422] selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b-2 border-[#FF4422]/40 shadow-[0_4px_20px_rgba(255,68,34,0.3)]">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-center relative">
                    <div className="flex items-center gap-3">
                        <img
                            src={footballImage}
                            alt="Football"
                            className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(255,68,34,0.8)] animate-pulse"
                        />
                        <h1 className="text-xl font-bold font-display tracking-tight text-white text-glow">TOUCHES</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-md mx-auto px-4 py-6">
                <PlayerProfile />
                <LiveStats />
                <ActionWheel />
                <PlayerEvaluation />
                <PlayerReflection />
            </main>

            {/* Sticky Bottom Bar */}
            <BottomBar />
        </div>
    );
}
