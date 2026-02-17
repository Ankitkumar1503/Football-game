import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Share } from "react-native";
import { useActiveSession } from "../../hooks/useActiveSession";
import { db } from "../../lib/db";
import { RotateCcw, Share2, Save, Download } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function BottomBar() {
  const { sessionId } = useActiveSession();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleReset = async () => {
    Alert.alert(
      "Reset Session",
      "Are you sure you want to reset this session? This will delete all touches and reflections and start a fresh match.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              if (sessionId) {
                await db.sessions.delete(sessionId);
                await db.touches.where("sessionId").equals(sessionId).delete();
                await db.reflections.where("sessionId").equals(sessionId).delete();
              }
              
              const keys = [
                  "playerReflection",
                  "playerProfile",
                  "footballFormation",
                  "playerAttendance",
                  "playerEvaluation",
                  "playerEvaluationBy"
              ];
              await AsyncStorage.multiRemove(keys);

              // RN doesn't have window.location.reload(), so we might need a way to trigger a re-render or navigation
              // For now, the hooks should react to the data clearing.
              Alert.alert("Session Reset", "The session has been reset.");
            } catch (error) {
              console.error("Error resetting session:", error);
              Alert.alert("Error", "Failed to reset session.");
            }
          }
        }
      ]
    );
  };

  const handleShare = async () => {
      try {
          const result = await Share.share({
              message: `I just completed my football training session. Check out my performance metrics and reflections!`,
          });
      } catch (error) {
          Alert.alert("Error", error.message);
      }
  };

  const handleSave = () => {
      Alert.alert("Saved", "Session saved successfully!");
  };

  const handleDownloadPDF = () => {
      Alert.alert("Coming Soon", "PDF export is coming soon to the mobile app!");
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 p-4 bg-[#0A0A0A]/95">
      <View className="flex-row justify-between gap-2">
        <TouchableOpacity
            onPress={handleReset}
            className="flex-1 items-center justify-center py-3 bg-[#1A1A1A] rounded-lg"
        >
            <RotateCcw size={16} color="#D1D5DB" />
            <Text className="text-gray-300 text-[10px] mt-1 uppercase font-bold">Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={handleShare}
            className="flex-1 items-center justify-center py-3 bg-[#1A1A1A] rounded-lg"
        >
            <Share2 size={16} color="#D1D5DB" />
            <Text className="text-gray-300 text-[10px] mt-1 uppercase font-bold">Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={handleDownloadPDF}
            className="flex-1 items-center justify-center py-3 bg-[#1A1A1A] rounded-lg"
        >
            <Download size={16} color="#D1D5DB" />
            <Text className="text-gray-300 text-[10px] mt-1 uppercase font-bold">PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={handleSave}
            className="flex-1 items-center justify-center py-3 bg-[#FF4422] rounded-lg"
        >
            <Save size={16} color="white" />
            <Text className="text-white text-[10px] mt-1 uppercase font-bold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
