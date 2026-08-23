import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { BottomBar } from "./sections/ReflectionAndFooter";
import { useTheme } from "../contexts/ThemeContext";

export function Layout({ defaultMenuOpen = false }) {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(defaultMenuOpen);
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register" || location.pathname === "/";
  const hideHeader = isRegisterPage || location.pathname === "/dashboard";

  return (
    <div
      id="printable-dashboard"
      className={`min-h-[100dvh] ${isRegisterPage ? "pb-2" : "pb-14"} font-sans transition-colors duration-300`}
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {!hideHeader && (
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}

      <main className="max-w-md mx-auto px-4 sm:px-4 pt-2 pb-2">
        <Outlet />
      </main>

      {!isRegisterPage && <BottomBar />}
    </div>
  );
}
