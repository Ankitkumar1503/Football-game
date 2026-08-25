import React from "react";
import { User, Menu } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import touches from "../assets/touches.png";
import { useNavigate } from "react-router-dom";
import touchesLight from "../assets/touches_black.png";

export function Header({ isMenuOpen, setIsMenuOpen }) {
  const { theme } = useTheme();
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
