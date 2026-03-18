import React, { useState } from "react";
import { User, Settings, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import touches from "../assets/touches.png";
import { useNavigate } from "react-router-dom";
import touchesLight from "../assets/touches-light.png";

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
              className="text-football-text hover:text-football-accent transition-colors"
            >
              <User size={24} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-football-text hover:text-football-accent transition-colors"
              >
                <Settings size={24} />
              </button>

              {/* Settings Dropdown for Theme */}
              {showSettings && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettings(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-xl p-2 z-50">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2">
                        {theme === "dark" ? (
                          <Moon
                            size={16}
                            style={{ color: "var(--text-primary)" }}
                          />
                        ) : (
                          <Sun
                            size={16}
                            style={{ color: "var(--text-primary)" }}
                          />
                        )}
                        <span
                          className="text-[11px] font-black uppercase tracking-wider"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </span>
                      </div>
                      {/* Toggle Switch */}
                      <button
                        onClick={toggleTheme}
                        className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
                        style={{
                          backgroundColor:
                            theme === "dark"
                              ? "var(--color-accent)"
                              : "var(--bg-input)",
                          border: "2px solid var(--border-color)",
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
                          style={{
                            transform:
                              theme === "dark"
                                ? "translateX(20px)"
                                : "translateX(2px)",
                          }}
                        />
                      </button>
                    </div>

                    {/* Divider */}
                    <div
                      className="my-1 border-t"
                      style={{ borderColor: "var(--border-color)" }}
                    />

                    {/* Settings Page Link */}
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setShowSettings(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:opacity-80"
                      style={{ backgroundColor: "transparent" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--bg-input)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <Settings
                        size={16}
                        style={{ color: "var(--color-accent)" }}
                      />
                      <span
                        className="text-[11px] font-black uppercase tracking-wider"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Settings
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-football-text hover:text-football-accent transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
