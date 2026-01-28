import React from 'react';
import { cn } from '../../lib/utils';

export function Button({ className, variant = "primary", size = "default", children, ...props }) {
    const variants = {
        primary: "bg-[#FF4422] hover:bg-[#FF6B35] text-white shadow-md shadow-[#FF4422]/30 hover:shadow-[#FF4422]/50",
        secondary: "bg-[#1A1A1A] hover:bg-[#2A2A2A] text-gray-200 border border-[#FF4422]/20 hover:border-[#FF4422]/40",
        ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
        success: "bg-[#22C55E] hover:bg-[#16A34A] text-white",
        danger: "bg-[#EF4444] hover:bg-[#DC2626] text-white",
        outline: "bg-transparent border border-[#FF4422] text-[#FF4422] hover:bg-[#FF4422]/10",
    };

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
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
