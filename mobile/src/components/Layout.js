import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Text } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Menu, X, User, Activity, Timer, MessageSquare, Clipboard, Award, Users, FileText } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Assets (Placeholder - you might need to copy these images or use placeholders)
// import touches from "../assets/touches.png"; 
// import touches2 from "../assets/touches2.png";

const NAV_ITEMS = [
    { label: "REGISTER", icon: User, path: "Register" },
    { label: "PLAYER STATS", icon: Activity, path: "Stats" }, // Reusing Register for Stats logic if needed
    { label: "TOUCH COUNTER", icon: Timer, path: "TouchCounter" },
    { label: "PLAYER REFLECTION", icon: MessageSquare, path: "Reflection" },
    { label: "PLAYER EVALUATION", icon: Clipboard, path: "Evaluation" },
    { label: "PLAYER GRADE", icon: Award, path: "Grade" },
    { label: "STARTING LINEUP", icon: Users, path: "Lineup" },
    { label: "USAGE POLICY", icon: FileText, path: "Policy" },
];

export function Layout({ children }) {
    const navigation = useNavigation();
    const route = useRoute();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (screenName) => {
        setIsMenuOpen(false);
        navigation.navigate(screenName);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0A0A0A]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b-2 border-gray-800 bg-[#0A0A0A]/95 z-40">
                <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                    <Menu className="text-white" size={32} color="white" />
                </TouchableOpacity>
                <View className="flex-row items-center gap-3">
                    <Text className="text-white font-black text-xl">FOOTBALLER</Text>
                    {/* <Image source={require('../../assets/touches.png')} className="w-32 h-10" resizeMode="contain" /> */}
                </View>
                <View className="w-8" />
            </View>

            {/* Menu Overlay */}
            {isMenuOpen && (
                <View className="absolute inset-0 z-50 bg-[#0A0A0A]">
                    <SafeAreaView className="flex-1">
                        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
                            <View className="w-8" />
                            <Text className="text-white font-black text-xl">MENU</Text>
                            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                                <X size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView className="flex-1 px-6 py-8">
                            {NAV_ITEMS.map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    onPress={() => handleNavigate(item.path)}
                                    className={`w-full px-4 py-3 rounded-xl flex-row items-center gap-3 mb-2 ${
                                        route.name === item.path ? "bg-[#FF4422]" : "bg-[#00AEEF]"
                                    }`}
                                >
                                    <View className="bg-white/20 p-1.5 rounded-full">
                                        <item.icon size={16} color="white" />
                                    </View>
                                    <Text className="font-bold uppercase text-sm tracking-wide text-white">
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </SafeAreaView>
                </View>
            )}

import { KeyboardAvoidingView, Platform } from 'react-native';

// ... inside Layout return
            {/* Main Content */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1">
                    {children}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
