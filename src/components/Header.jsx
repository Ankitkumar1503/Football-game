import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useActiveSession } from "../hooks/useActiveSession";
import { useAuth } from "../contexts/AuthContext";

export function Header({ isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();
  const { session } = useActiveSession();
  const { user } = useAuth();

  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem("playerProfile") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const playerName =
    user?.name ||
    user?.firstName ||
    user?.fullName ||
    user?.playerName ||
    savedUser?.name ||
    savedUser?.firstName ||
    savedUser?.fullName ||
    savedUser?.playerName ||
    savedProfile?.fullName ||
    savedProfile?.name ||
    session?.playerName ||
    session?.fullName ||
    "Player";

  const activeFoot = (
    session?.activeFooter ||
    user?.footer ||
    user?.activeFooter ||
    savedProfile?.activeFooter ||
    "RIGHT"
  ).toUpperCase();

  const footIconSrc = activeFoot === "LEFT" ? "/left_foot.png" : "/right_foot.png";
  const playerInitial =
    playerName && playerName.trim().length > 0
      ? playerName.trim().charAt(0).toUpperCase()
      : "P";

  return (
    <header className="sticky top-0 z-40 bg-[#07090E] border-b border-white/10 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-md mx-auto px-3 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Yellow Ü Icon + Yellow TOUCHES Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src="/touches_icon.png"
            alt="TOUCHES Icon"
            className="h-8 sm:h-9 w-auto object-contain"
          />
          <img
            src="/touches_logo.png"
            alt="TOUCHES"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </div>

        {/* Right: User's Foot Icon (Display only), Settings Gear, User Initial Avatar Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Dominant Foot Icon (No link, dynamic according to DB/state) */}
          <div className="flex items-center justify-center">
            <img
              src={footIconSrc}
              alt={`${activeFoot} Foot Icon`}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
          </div>

          {/* Settings Gear */}
          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            className="p-1 text-white hover:text-yellow-400 transition-colors flex items-center justify-center"
          >
            <Settings size={24} strokeWidth={2} />
          </button>

          {/* Profile Initial Badge */}
          <button
            onClick={() => navigate("/account")}
            title={`Account (${playerName})`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FF4422] text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md border border-white/20 hover:scale-105 transition-transform"
          >
            {playerInitial}
          </button>
        </div>
      </div>
    </header>
  );
}
