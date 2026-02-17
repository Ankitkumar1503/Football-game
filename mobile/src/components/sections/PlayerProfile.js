import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Footprints } from "lucide-react-native";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { useActiveSession } from "../../hooks/useActiveSession";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from "nativewind";

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function PlayerProfile() {
  const { session, updateSession } = useActiveSession();

  const [formData, setFormData] = useState({
      level: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      playerName: "",
      age: "",
      club: "",
      team: "",
      position: "",
      totalYearsPlaying: "",
      totalHoursTrained: "",
      totalSessions: "",
      gameNumber: "",
      totalGames: "",
      totalGoals: "",
      totalPenalties: "",
      yourPosition: "",
      rightFooter: "",
      leftFooter: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
      const loadLocal = async () => {
          try {
              const saved = await AsyncStorage.getItem("playerProfile");
              if (saved) {
                  const parsed = JSON.parse(saved);
                  // If DB session is empty but we have local, use local (or if not loaded yet)
                  if (!session.id || !isLoaded) {
                       setFormData(prev => ({...prev, ...parsed}));
                  }
              }
          } catch(e) {
              console.error(e);
          }
      };
      loadLocal();
  }, []);

  useEffect(() => {
    if (session.id) {
      const hasLocalData = formData.playerName || formData.club || formData.team;

      if (!isLoaded) {
        if (!hasLocalData || (session.playerName && session.playerName !== formData.playerName)) {
          setFormData(prev => ({
            ...prev,
            ...session,
            date: session.date || new Date().toISOString().split("T")[0],
            time: session.time || new Date().toTimeString().slice(0, 5),
          }));
        }
        setIsLoaded(true);
      }
    }
  }, [session, isLoaded]);

  const debouncedData = useDebounce(formData, 800);

  useEffect(() => {
    AsyncStorage.setItem("playerProfile", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (session.id && isLoaded) {
      updateSession(debouncedData);
    } else if (session.id && !isLoaded && (formData.playerName || formData.club)) {
      updateSession(debouncedData);
    }
  }, [debouncedData, session.id, isLoaded]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePositionSelect = (num) => {
    setFormData((prev) => ({ ...prev, position: num.toString() }));
  };

  return (
    <View className="mb-8">
      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-1 gap-y-4">
          {/* Date & Time */}
          <View className="flex-row gap-4">
            <View className="flex-1 space-y-1">
              <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">
                Date
              </StyledText>
              <Input
                value={formData.date}
                onChangeText={(text) => handleChange('date', text)}
                className="bg-[#E5E5E5] text-black border-none"
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View className="flex-1 space-y-1">
              <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">
                Time
              </StyledText>
              <Input
                value={formData.time}
                onChangeText={(text) => handleChange('time', text)}
                className="bg-[#E5E5E5] text-black border-none"
                placeholder="HH:MM"
              />
            </View>
          </View>

          {/* Name & Age */}
          <View className="flex-row gap-4">
            <View className="flex-1 space-y-1">
              <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">
                Name of Player
              </StyledText>
              <Input
                value={formData.playerName}
                onChangeText={(text) => handleChange('playerName', text)}
                className="bg-[#E5E5E5] text-black border-none"
              />
            </View>
            <View className="w-20 space-y-1">
              <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">
                Age
              </StyledText>
              <Input
                className="bg-[#E5E5E5] text-black border-none"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(text) => handleChange('age', text)}
              />
            </View>
          </View>

          {/* Club */}
          <View className="space-y-1">
            <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">
              Club
            </StyledText>
            <Input
              value={formData.club}
              onChangeText={(text) => handleChange('club', text)}
              className="bg-[#E5E5E5] text-black border-none"
            />
          </View>

          {/* Team */}
          <View className="space-y-1">
            <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200">
              Team
            </StyledText>
            <Input
              value={formData.team}
              onChangeText={(text) => handleChange('team', text)}
              className="bg-[#E5E5E5] text-black border-none"
            />
          </View>

          {/* Position Selector */}
          <View className="space-y-1 pb-4 border-b-2 border-white/10">
            <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 mb-2">
              Position:
            </StyledText>
            <View className="flex-row justify-between items-center bg-[#E5E5E5] p-1 rounded-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <StyledTouchableOpacity
                  key={num}
                  onPress={() => handlePositionSelect(num)}
                  className={`w-7 h-7 flex items-center justify-center rounded ${
                    formData.position === num.toString()
                      ? "bg-white shadow-sm"
                      : ""
                  }`}
                >
                  <StyledText 
                    className={`text-sm font-black ${
                        formData.position === num.toString() 
                        ? "text-[#FF4422]" 
                        : "text-gray-400"
                    }`}
                  >
                    {num}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </View>
          </View>

          {/* Right/Left Footer */}
          <View className="flex-row gap-4 pb-4 border-b-2 border-white/10 mb-4">
            <View className="flex-1 flex-row items-center justify-between">
              <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 mr-2">
                Right Footer
              </StyledText>
              <View className="flex-row items-center gap-2 flex-1">
                <Footprints size={16} className="text-gray-600 dark:text-gray-400" color="#9CA3AF" />
                <Input
                  value={formData.rightFooter}
                  onChangeText={(text) => handleChange('rightFooter', text)}
                  className="bg-[#E5E5E5] text-black w-full border-none h-8 py-1"
                />
              </View>
            </View>
            <View className="flex-1 flex-row items-center justify-between">
              <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 mr-2">
                Left Footer
              </StyledText>
              <View className="flex-row items-center gap-2 flex-1">
                <Footprints size={16} className="text-gray-600 dark:text-gray-400" color="#9CA3AF" />
                <Input
                  value={formData.leftFooter}
                  onChangeText={(text) => handleChange('leftFooter', text)}
                  className="bg-[#E5E5E5] text-black w-full border-none h-8 py-1"
                />
              </View>
            </View>
          </View>

          {/* Player Stats */}
          <View className="pt-2">
            <StyledText className="text-sm font-black uppercase text-gray-800 dark:text-gray-200 mb-4 border-b-2 border-black/80 dark:border-white/80 pb-1">
              Player Stats
            </StyledText>

            <View className="gap-y-2">
              {[
                  { label: "Total Years Playing", key: "totalYearsPlaying" },
                  { label: "Total Hours Trained", key: "totalHoursTrained" },
                  { label: "Total Number of Sessions", key: "totalSessions" },
                  { label: "Total Number of Games", key: "totalGames" },
                  { label: "Total Goals Scored", key: "totalGoals" },
                  { label: "Total Penalties Taken", key: "totalPenalties" },
                  { label: "Your Position", key: "yourPosition", type: "text" },
              ].map((item) => (
                  <View key={item.key} className="flex-row items-center justify-between">
                    <StyledText className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 flex-1">
                      {item.label}
                    </StyledText>
                    <Input
                      value={formData[item.key]}
                      onChangeText={(text) => handleChange(item.key, text)}
                      keyboardType={item.type === 'text' ? 'default' : 'numeric'}
                      className="w-20 bg-[#E5E5E5] text-black text-xs font-bold text-center border-none h-8 py-1"
                    />
                  </View>
              ))}
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
