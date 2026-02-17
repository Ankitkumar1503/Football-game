import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { BottomBar } from "./sections/ReflectionAndFooter";
import touches from "../assets/touches.png";
import touches2 from "../assets/touches2.png";

export function Layout({ defaultMenuOpen = false }) {
  const location = useLocation();
  // We can determine if we want to show the header/bottom bar based on route if needed
  // For now, consistent layout

  return (
    <div
      id="printable-dashboard"
      className="min-h-screen pb-20 bg-[#0A0A0A] text-white font-sans selection:bg-[#FF4422] selection:text-white"
    >
      {/* Navigation Overlay */}
      <Navigation defaultOpen={defaultMenuOpen} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b-2 border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <img
            src={touches}
            alt="Football"
            className="w-56 h-20 object-contain flex-shrink-0"
          />
          <img
            src={touches2}
            alt="Football"
            className="w-16 h-20 object-contain flex-shrink-0"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 text-white">
        <Outlet />
      </main>

      {/* Sticky Bottom Bar */}
      <BottomBar />
    </div>
  );
}
