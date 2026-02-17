import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

import { cn } from "../../lib/utils";

// ...

export function Input({ className, label, id, ...props }) {
    return (
        <StyledView className="flex flex-col gap-1 w-full">
            {label && (
                <StyledText className="text-xs text-gray-400 font-medium ml-1">
                    {label}
                </StyledText>
            )}
            <StyledTextInput
                className={cn("bg-[#0A0A0A] border border-[#FF4422]/30 rounded-xl px-4 py-3 text-sm text-white", className)}
                placeholderTextColor="#6B7280"
                {...props}
            />
        </StyledView>
    );
}
