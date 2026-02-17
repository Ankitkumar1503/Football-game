import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Activity,
  Timer,
  MessageSquare,
  Clipboard,
  Award,
  Users,
  FileText,
} from "lucide-react";
import touches from "../assets/touches.png";

export function Navigation({ defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  // Cleanup effect to reset scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const NAV_ITEMS = [
    { label: "REGISTER", icon: User, path: "/register" },
    { label: "PLAYER STATS", icon: Activity, path: "/stats" },
    { label: "TOUCH COUNTER", icon: Timer, path: "/touch-counter" },
    { label: "PLAYER REFLECTION", icon: MessageSquare, path: "/reflection" },
    { label: "PLAYER EVALUATION", icon: Clipboard, path: "/evaluation" },
    { label: "PLAYER GRADE", icon: Award, path: "/grade" },
    { label: "STARTING LINEUP", icon: Users, path: "/lineup" },
    { label: "USAGE POLICY", icon: FileText, path: "/policy" },
  ];

  const MenuItem = ({ icon: Icon, label, path }) => {
    const isActive = location.pathname === path;
    const bgClass = isActive ? "bg-[#FF4422]" : "bg-[#00AEEF]";

    return (
      <Link
        to={path}
        className={`w-full ${bgClass} text-white px-4 py-2.5 rounded-lg flex items-center gap-3 mb-2 shadow-md active:scale-95 transition-transform no-underline hover:bg-opacity-90`}
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold uppercase text-sm tracking-wide">
          {label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-2 left-4 z-50 p-2 text-white bg-black/50 rounded-full backdrop-blur-sm md:left-8 hover:bg-black/70 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col h-screen overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b border-gray-800">
            <div className="w-8" />
            <img src={touches} alt="TOUCHES" className="h-10 object-contain" />
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:text-[#FF4422] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex-1 px-6 py-8 flex flex-col items-center max-w-md mx-auto w-full">
            {NAV_ITEMS.map((item) => (
              <MenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
              />
            ))}

            <div className="mt-auto pt-8 text-center text-gray-500 text-xs font-bold uppercase">
              FOOTBALLER ATHLETICS
            </div>
          </div>
        </div>
      )}
    </>
  );
}
