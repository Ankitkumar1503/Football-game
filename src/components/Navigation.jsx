import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  User,
  Activity,
  Timer,
  MessageSquare,
  Clipboard,
  Award,
  Users,
  FileText,
  StickyNote,
} from "lucide-react";
import touches from "../assets/touches.png";
import touchesLight from "../assets/touches-light.png";
import { cn } from "../lib/utils";
import { useTheme } from "../hooks/useTheme";

// NAV_ITEMS paths match EXACTLY the routes defined in app.jsx
const NAV_ITEMS = [
  { label: "REGISTER", icon: User, path: "/register" },
  { label: "PLAYER STATS", icon: Activity, path: "/stats" },
  { label: "TOUCH COUNTER", icon: Timer, path: "/touch-counter" },
  { label: "PLAYER REFLECTION", icon: MessageSquare, path: "/reflection" },
  { label: "PLAYER EVALUATION", icon: Clipboard, path: "/evaluation" },
  { label: "PLAYER GRADE", icon: Award, path: "/grade" },
  { label: "STARTING LINEUP", icon: Users, path: "/lineup" },
  { label: "NOTE TO COACH", icon: StickyNote, path: "/note-to-coach" },
  { label: "USAGE POLICY", icon: FileText, path: "/policy" },
];

export function Navigation({ isOpen, onClose }) {
  const location = useLocation();
  const { theme } = useTheme();

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col h-screen overflow-y-auto"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* ── Header ── */}
      <div
        className="p-4 flex justify-between items-center border-b flex-shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="w-10" />
        <img
          src={theme === "dark" ? touches : touchesLight}
          alt="TOUCHES"
          className="h-10 w-32 object-contain"
        />
        <button
          onClick={onClose}
          className="p-2 transition-colors rounded-md"
          style={{ color: "var(--text-primary)" }}
          aria-label="Close menu"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      {/* ── Nav Items ── */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center max-w-md mx-auto w-full">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;

          const bgClass =
            theme === "light"
              ? isActive
                ? "bg-white text-black border border-black"
                : "bg-[#00AEEF] text-white border border-[#00AEEF]"
              : isActive
                ? "bg-football-accent text-white border border-football-accent"
                : "bg-football-accent/80 text-white border border-football-accent";

          return (
            <Link
              key={label}
              to={path}
              onClick={onClose} // simply close menu on click — Link handles navigation
              className={cn(
                "w-full px-4 py-2.5 rounded-lg flex items-center gap-3 mb-2 shadow-md active:scale-95 transition-transform no-underline",
                bgClass,
              )}
            >
              <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold uppercase text-sm tracking-wide">
                {label}
              </span>
            </Link>
          );
        })}

        <div
          className="mt-auto pt-8 text-center text-xs font-bold uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          FOOTBALLER ATHLETICS
        </div>
      </div>
    </div>
  );
}
