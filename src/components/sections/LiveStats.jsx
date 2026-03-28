import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/Card";
import { useActiveSession } from "../../hooks/useActiveSession";
import { RotateCcw } from "lucide-react";
import { db } from "../../lib/db";

export function LiveStats({ isPdf }) {
  const { stats, sessionId } = useActiveSession();

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

  const handleReset = async () => {
    if (!sessionId) return;
    if (
      confirm("Are you sure you want to reset the touches for this session?")
    ) {
      try {
        await db.touches.where("sessionId").equals(sessionId).delete();
      } catch (error) {
        console.error("Error resetting touches:", error);
      }
    }
  };

  const StatRow = ({ label, value }) => {
    if (isPdf) {
      // PDF: Clean white rows with black text and thin borders
      return (
        <div className="flex mb-0">
          <div className="flex-1 bg-white text-black px-3 py-2 flex items-center" style={{ border: "1px solid #000" }}>
            <span className="font-black uppercase tracking-wider text-xs leading-tight">
              {label}
            </span>
          </div>
          <div className="w-[60px] bg-white text-black px-3 py-2 flex items-center justify-center" style={{ border: "1px solid #000", borderLeft: "none" }}>
            <span className="font-black text-base">{value}</span>
          </div>
        </div>
      );
    }

    // App: Dynamic styles based on theme
    const bgColor = isLightTheme
      ? "bg-white"
      : "bg-[var(--color-accent)]";

    const textColor = isLightTheme ? "text-[#0F172A]" : "text-white";

    return (
      <div className="flex gap-[2px] mb-[2px] last:mb-0">
        <div
          className={`flex-1 ${bgColor} ${textColor} px-3 py-2 flex items-center`}
        >
          <span className="font-black uppercase tracking-wider text-xs md:text-sm leading-tight">
            {label}
          </span>
        </div>
        <div
          className={`w-[60px] md:w-[80px] ${bgColor} ${textColor} px-3 py-2 flex items-center justify-center`}
        >
          <span className="font-black text-base md:text-lg">{value}</span>
        </div>
      </div>
    );
  };

  // Header styling
  const headerBg = isPdf ? "bg-white" : isLightTheme ? "bg-white" : "bg-[var(--color-accent)]";
  const headerText = isPdf ? "text-black" : isLightTheme ? "text-[#0F172A]" : "text-white";
  const headerBorder = isPdf ? { borderBottom: "2px solid #000" } : {};

  return (
    <div className="mb-8">
      <div
        className={`${headerBg} py-2 text-center mb-[2px]`}
        style={headerBorder}
      >
        <h2
          className={`text-sm md:text-base font-black uppercase ${headerText} tracking-widest px-4`}
        >
          TOTAL TOUCHES
        </h2>
      </div>

      <div className="flex flex-col">
        <StatRow label="PASS" value={stats.Pass} />
        <StatRow label="DRIBBLE" value={stats.Dribble} />
        <StatRow label="SHOT" value={stats.Shot} />
        <StatRow label="CROSS" value={stats.Cross} />
        <StatRow label="GOAL" value={stats.Goal} />
        <StatRow label="HEADER" value={stats.Header} />
        <StatRow label="TACKLE" value={stats.Tackle} />
        <StatRow label="THROW-IN" value={stats["Throw-In"]} />
        <StatRow label="CORNER KICK" value={stats["Corner Kick"]} />
        <StatRow label="FREE KICK" value={stats["Free Kick"]} />
        <StatRow label="PENALTY KICK" value={stats["Penalty Kick"]} />
        <StatRow label="POSITIVE TOUCH" value={stats.good} />
        <StatRow label="NEGATIVE TOUCH" value={stats.bad} />
        <StatRow label="YELLOW CARD" value={stats["Yellow Card"]} />
        <StatRow label="RED CARD" value={stats["Red Card"]} />
      </div>

      {/* <div className="flex justify-end mt-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-football-text dark:text-gray-300 font-black uppercase hover:text-[var(--color-accent)] transition-colors"
        >
          <span className="text-xl tracking-tighter">RESET</span>
        </button>
      </div> */}

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
