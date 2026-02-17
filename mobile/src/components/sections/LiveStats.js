import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useActiveSession } from '../../hooks/useActiveSession';
import { db } from '../../lib/db';
import { styled } from 'nativewind';

const StatRow = ({ label, value }) => (
    <View className="flex-row items-center justify-between bg-[#FF4422] p-2 border-b border-black/20 last:border-0 h-10 px-3">
        <Text className="font-black uppercase text-white tracking-wider text-xs">{label}</Text>
        <Text className="font-black text-white text-lg">{value}</Text>
    </View>
);

const Column = styled(View, "flex-1 flex-col border-4 border-[#FF4422]");

export function LiveStats() {
    const { stats, sessionId } = useActiveSession();

    const handleReset = async () => {
        if (!sessionId) return;
        Alert.alert(
            "Reset Touches",
            "Are you sure you want to reset the touches for this session?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await db.touches.where('sessionId').equals(sessionId).delete();
                        } catch (error) {
                            console.error('Error resetting touches:', error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="mb-8">
            <View className="flex-row justify-between items-end mb-2 border-b-2 border-black/80 pb-1">
                <Text className="text-2xl font-black uppercase text-black dark:text-gray-200 tracking-tighter">
                    TOTAL TOUCHES
                </Text>
            </View>

            <View className="flex-row gap-x-2">
                {/* Left Column */}
                <Column>
                    <StatRow label="PASS" value={stats.Pass} />
                    <StatRow label="DRIBBLE" value={stats.Dribble} />
                    <StatRow label="CORNER KICK" value={stats['Corner Kick']} />
                    <StatRow label="HEADER" value={stats.Header} />
                    <StatRow label="TACKLE" value={stats.Tackle} />
                    <StatRow label="GOAL" value={stats.Goal} />
                    <StatRow label="SHOT" value={stats.Shot} />
                </Column>

                {/* Right Column */}
                <Column>
                    <StatRow label="FREE KICK" value={stats['Free Kick']} />
                    <StatRow label="PENALTY KICK" value={stats['Penalty Kick']} />
                    <StatRow label="CROSS" value={stats.Cross} />
                    <StatRow label="POSITIVE TOUCH" value={stats.good} />
                    <StatRow label="NEGATIVE TOUCH" value={stats.bad} />
                    <StatRow label="YELLOW CARDS" value={stats['Yellow Card']} />
                    <StatRow label="RED CARDS" value={stats['Red Card']} />
                </Column>
            </View>

            <View className="flex-row justify-end mt-2">
                <TouchableOpacity
                    onPress={handleReset}
                    className="flex-row items-center gap-1"
                >
                    <Text className="text-black dark:text-gray-300 font-black uppercase text-xl tracking-tighter">
                        RESET
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
