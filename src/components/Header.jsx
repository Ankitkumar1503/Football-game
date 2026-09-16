import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header({ isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#07090E] border-b border-white/10 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-md mx-auto px-3 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: TOUCHES Logo (White) */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src="/touches_icon.png"
            alt="TOUCHES Icon"
            className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
          />
          <img
            src="/touches_logo.png"
            alt="TOUCHES"
            className="h-7 sm:h-8 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Right: Settings Gear */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            className="p-1 text-white hover:text-zinc-300 transition-colors flex items-center justify-center"
          >
            <Settings size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
