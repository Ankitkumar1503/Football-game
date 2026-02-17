import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

export function Button({ className, variant = "primary", size = "default", children, ...props }) {
    const variants = {
        primary: "bg-[#FF4422]",
        secondary: "bg-[#1A1A1A] border border-[#FF4422]/20",
        ghost: "bg-transparent",
        success: "bg-[#22C55E]",
        danger: "bg-[#EF4444]",
        outline: "bg-transparent border border-[#FF4422]",
    };

    const textVariants = {
        primary: "text-white",
        secondary: "text-gray-200",
        ghost: "text-gray-400",
        success: "text-white",
        danger: "text-white",
        outline: "text-[#FF4422]",
    };

    const sizes = {
        sm: "px-3 py-2",
        default: "px-4 py-3",
        lg: "px-6 py-4",
        icon: "p-2 items-center justify-center aspect-square",
    };

    const textSizes = {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base font-semibold",
        icon: "",
    };

    return (
        <StyledTouchableOpacity
            className={`rounded-xl flex-row items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {typeof children === 'string' ? (
                <StyledText className={`font-medium ${textVariants[variant]} ${textSizes[size]}`}>
                    {children}
                </StyledText>
            ) : (
                children
            )}
        </StyledTouchableOpacity>
    );
}
