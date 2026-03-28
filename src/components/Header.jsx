import React, { useState } from "react";
import { User, Settings, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import touches from "../assets/touches.png";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
// import touchesLight from "../assets/touches-light.png";
import touchesLight from "../assets/touches_black.png";

export function Header({ isMenuOpen, setIsMenuOpen }) {
  const { theme, toggleTheme } = useTheme();
  // const [isMenuOpen, setIsMenuOpen] = useState(false); // Controlled by parent now
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 bg-football-primary backdrop-blur-md border-b border-football-subtle transition-colors duration-300">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={theme === "dark" ? touches : touchesLight}
              alt="TOUCHES"
              className="h-8 w-auto object-contain"
              // Note: If the logo is white text, we might need to invert it for light mode if it doesn't have a background.
              // Assuming 'touches.png' is the text logo.
            />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/account")}
              className={`hover:text-football-accent transition-colors ${
                theme === "light" ? "text-[#0F172A]" : "text-white"
              }`}
            >
              <User size={24} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`hover:text-football-accent transition-colors ${
                  theme === "light" ? "text-[#0F172A]" : "text-white"
                }`}
              >
                <Settings size={28} />
              </button>

              {/* Settings Dropdown for Theme */}
              {showSettings && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettings(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-football-primary border border-white/20 rounded-xl shadow-2xl p-3 z-50">
                    {/* Theme Toggle Row */}
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-2">
                        {theme === "dark" ? (
                          <Moon
                            size={16}
                            className="text-white"
                          />
                        ) : (
                          <Sun
                            size={20}
                            className="text-white"
                          />
                        )}
                        <span className="text-[11px] font-black uppercase tracking-tight text-white/90">
                          {theme === "dark" ? "Dark" : "Light"} Mode
                        </span>
                      </div>
                      
                      {/* Professional Toggle Switch */}
                      <button
                        onClick={toggleTheme}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none flex items-center shadow-inner",
                          theme === "dark" 
                            ? "bg-white/40" 
                            : "bg-white/20"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xl ring-0 transition duration-200 ease-in-out",
                            theme === "dark" ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/20 mb-3" />

                    {/* Professional Settings Link Card */}
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setShowSettings(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all font-black uppercase tracking-tight group",
                        theme === "light" 
                          ? "bg-white text-black hover:bg-gray-100" 
                          : "bg-white/10 text-white hover:bg-white/20"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Settings
                          size={16}
                          className={theme === "light" ? "text-black" : "text-white"}
                        />
                        <span className="text-[11px]">Settings</span>
                      </div>
                      <div className="opacity-50 group-hover:translate-x-0.5 transition-transform text-xs">
                        →
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              className={`hover:text-football-accent transition-colors ${
                theme === "light" ? "text-[#0F172A]" : "text-white"
              }`}
            >
              <Menu size={32} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
