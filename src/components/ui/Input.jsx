import React from 'react';
import { cn } from '../../lib/utils';

// Themed input that responds to the current CSS-variable theme
export function Input({ className, label, id, ...props }) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={id} className="text-xs text-[var(--text-secondary)] font-medium ml-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={cn(
                    "bg-[var(--bg-input)] border border-[var(--border-color)] focus:border-[var(--color-accent)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-all focus:ring-2 focus:ring-[var(--color-accent)]/30",
                    className
                )}
                {...props}
            />
        </div>
    );
}
