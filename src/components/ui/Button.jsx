import React from "react";
import { cn } from "../../lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "default",
  children,
  ...props
}) {
  // const variants = {
  const variants = {
    primary:
      "bg-football-accent hover:bg-football-accent-hover text-white shadow-md shadow-football-accent/30 hover:shadow-football-accent/50",
    secondary:
      "bg-football-card hover:bg-football-input text-football-text border border-football-subtle hover:border-football-accent/40",
    ghost:
      "bg-transparent hover:bg-football-text/5 text-football-text-secondary hover:text-football-text",
    success: "bg-football-success hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline:
      "bg-transparent border border-football-accent text-football-accent hover:bg-football-accent/10",
  };
  // };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base font-semibold",
    icon: "p-2 aspect-square flex items-center justify-center",
  };

  return (
    <button
      className={cn(
        "rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-medium flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
