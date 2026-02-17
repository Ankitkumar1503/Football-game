import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { styled } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActiveSession } from "../../hooks/useActiveSession";

const WELL_DONE_TAGS = [
  "ATTACKING", "FINISHING", "DEFENDING", "TACKLING", "LONG BALLS",
  "TRAPPING", "TRANSITION", "FREE KICKS", "MARKING", "SPEED",
  "PENALTIES", "ENDURANCE", "CORNERS", "PASSING", "LEADERSHIP",
  "DECISIONS", "SUPPORT", "CREATE SPACE", "BALL CONTROL",
  "THROW-IN", "HEADING",
];

const PERFORMANCE_METRICS = [
  "ENDURANCE", "ENERGY", "DECISION MAKING", "CONFIDENCE",
  "MOTIVATION", "ENJOYMENT", "FOCUS", "PERFORMANCE",
  "FIRST TOUCH", "PASSING", "RECEIVING", "WILL",
  "FITNESS", "FUN", "WILL TO WIN", "TEAM PLAYER",
];

const StyledInput = styled(TextInput, "bg-white text-black px-3 py-2 text-sm font-bold uppercase border border-gray-200 rounded");

export function PlayerReflection() {
  const { sessionId, reflection, updateReflection } = useActiveSession();
  
  const [formData, setFormData] = useState({
    wellDoneTags: [],
    playerName: "",
    playerAge: "",
    achievedGoal: "",
    whatLearned: "",
    whatWouldChange: "",
    detailedPerformance: {},
  });

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const saved = await AsyncStorage.getItem("playerReflection");
        if (saved) {
          setFormData(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Error loading reflection:", e);
      }
    };
    loadSaved();
  }, []);

  // Save to AsyncStorage on change
  useEffect(() => {
    AsyncStorage.setItem("playerReflection", JSON.stringify(formData));
  }, [formData]);

  // Sync with DB
  useEffect(() => {
    if (reflection) {
        // Merge logic could be improved, but for now simple sync if DB has data
        if (Object.keys(reflection).length > 0) {
             setFormData(prev => ({ ...prev, ...reflection }));
        }
    }
  }, [reflection]);

  const handleTagToggle = async (tag) => {
    const currentTags = formData.wellDoneTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    const newData = { ...formData, wellDoneTags: newTags };
    setFormData(newData);
    await updateReflection({ wellDoneTags: newTags });
  };

  const handleTextChange = async (key, value) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    // Debounce this in a real app, but for now direct update is fine for local dev
    await updateReflection({ [key]: value });
  };

  const handleMetricChange = async (metric, value) => {
    const numValue = parseInt(value) || 0;
    // Limit 1-10
    if (numValue < 0 || numValue > 10) return;

    const newMetrics = {
      ...formData.detailedPerformance,
      [metric]: numValue,
    };
    const newData = { ...formData, detailedPerformance: newMetrics };
    setFormData(newData);
    await updateReflection({ detailedPerformance: newMetrics });
  };

  return (
    <View className="mb-6 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl">
      <View className="mb-6 border-b-2 border-black dark:border-white pb-2">
        <Text className="text-xl font-black uppercase text-black dark:text-white">
          PLAYER REFLECTION
        </Text>
        <View className="flex-row gap-4 mb-1 mt-2">
            <View className="flex-1">
                <Text className="text-xs font-black uppercase text-black dark:text-white mb-1">NAME:</Text>
                <StyledInput 
                    value={formData.playerName}
                    onChangeText={(text) => handleTextChange('playerName', text)}
                    placeholder="NAME"
                />
            </View>
            <View className="w-20">
                <Text className="text-xs font-black uppercase text-black dark:text-white mb-1">AGE:</Text>
                <StyledInput 
                    value={formData.playerAge}
                    onChangeText={(text) => handleTextChange('playerAge', text)}
                    placeholder="AGE"
                    keyboardType="numeric"
                />
            </View>
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-sm font-black uppercase mb-3 text-black dark:text-white">
          WHAT DID YOU DO WELL:
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {WELL_DONE_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => handleTagToggle(tag)}
              className={`flex-row items-center gap-2 p-1 ${formData.wellDoneTags?.includes(tag) ? 'bg-gray-100' : ''}`}
            >
              <View className={`w-4 h-4 border-2 items-center justify-center bg-white border-black`}>
                {formData.wellDoneTags?.includes(tag) && <View className="w-2 h-2 bg-black" />}
              </View>
              <Text className="text-[10px] font-bold uppercase text-black dark:text-white">
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="gap-y-4 mb-8">
        <View>
            <Text className="text-sm font-black uppercase mb-1 text-black dark:text-white">DID YOU ACHIEVE YOUR GOAL?</Text>
            <StyledInput 
                value={formData.achievedGoal}
                onChangeText={(text) => handleTextChange('achievedGoal', text)}
            />
        </View>
        <View>
            <Text className="text-sm font-black uppercase mb-1 text-black dark:text-white">WHAT DID YOU LEARN?</Text>
             <StyledInput 
                value={formData.whatLearned}
                onChangeText={(text) => handleTextChange('whatLearned', text)}
            />
        </View>
        <View>
            <Text className="text-sm font-black uppercase mb-1 text-black dark:text-white">WHAT WOULD YOU CHANGE?</Text>
             <StyledInput 
                value={formData.whatWouldChange}
                onChangeText={(text) => handleTextChange('whatWouldChange', text)}
            />
        </View>
      </View>

      <View>
        <Text className="text-sm font-black uppercase mb-4 text-black dark:text-white">
          REFLECT ON YOUR GAME PERFORMANCE: 1-10
        </Text>
        <View className="flex-row flex-wrap gap-x-8 gap-y-2">
          {PERFORMANCE_METRICS.map((metric) => (
            <View key={metric} className="flex-row items-center gap-2 w-[45%]">
              <StyledInput
                className="w-12 h-8 text-center"
                keyboardType="numeric"
                maxLength={2}
                value={String(formData.detailedPerformance?.[metric] || "")}
                onChangeText={(text) => handleMetricChange(metric, text)}
              />
              <Text className="text-[10px] font-bold uppercase text-black dark:text-white flex-1">
                {metric}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
