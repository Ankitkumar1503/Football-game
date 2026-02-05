import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "bg-[#1A1A1A] text-white shadow-lg border border-[#FF4422]/20 overflow-hidden backdrop-blur-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("p-4 border-b border-[#FF4422]/20", className)} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("p-4", className)} {...props}>
            {children}
        </div>
    );
}
