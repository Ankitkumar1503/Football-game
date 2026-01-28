import React from 'react';
import { cn } from '../../lib/utils';

export function Input({ className, label, id, ...props }) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={id} className="text-xs text-gray-400 font-medium ml-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={cn(
                    "bg-[#0A0A0A] border border-[#FF4422]/30 focus:border-[#FF4422] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-[#FF4422]/30",
                    className
                )}
                {...props}
            />
        </div>
    );
}
