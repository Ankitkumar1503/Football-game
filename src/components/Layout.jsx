import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { BottomBar } from "./sections/ReflectionAndFooter";
import { useTheme } from "../contexts/ThemeContext";

export function Layout({ defaultMenuOpen = false }) {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(defaultMenuOpen);

  return (
    <div
      id="printable-dashboard"
      className="min-h-[100dvh] pb-32 font-sans transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="max-w-md mx-auto px-4 sm:px-4 pt-2 pb-8">
        <Outlet />
      </main>

      <BottomBar />
    </div>
  );
}
