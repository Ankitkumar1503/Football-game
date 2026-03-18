import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Footprints } from "lucide-react-native";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { useActiveSession } from "../../hooks/useActiveSession";
import { useCumulativeStats } from "../../hooks/useCumulativeStats";
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
  const cumulativeStats = useCumulativeStats();

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
            <StyledText className="text-sm font-black uppercase text-gray-800 dark:text-gray-200 mb-1 border-b-2 border-black/80 dark:border-white/80 pb-1">
              Player Stats
            </StyledText>
            <StyledText className="text-[8px] uppercase tracking-widest text-center text-gray-500 dark:text-gray-400 mb-3 font-bold">
              ⚡ These stats accumulate across all sessions
            </StyledText>

            <View className="gap-y-2">
              {/* Editable: Years Playing */}
              <View className="flex-row items-center justify-between">
                <StyledText className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 flex-1">
                  Years Playing
                </StyledText>
                <Input
                  value={formData.totalYearsPlaying}
                  onChangeText={(text) => handleChange('totalYearsPlaying', text)}
                  keyboardType="numeric"
                  className="w-20 bg-[#E5E5E5] text-black text-xs font-bold text-center border-none h-8 py-1"
                />
              </View>

              {/* Editable: Hours Trained (this session) */}
              <View className="flex-row items-center justify-between">
                <StyledText className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 flex-1">
                  Hours Trained (this session)
                </StyledText>
                <Input
                  value={formData.totalHoursTrained}
                  onChangeText={(text) => handleChange('totalHoursTrained', text)}
                  keyboardType="numeric"
                  className="w-20 bg-[#E5E5E5] text-black text-xs font-bold text-center border-none h-8 py-1"
                />
              </View>

              {/* Auto-computed stats */}
              {[
                { label: "Total Hours Trained", value: cumulativeStats.totalHoursTrained },
                { label: "Number of Sessions", value: cumulativeStats.totalSessions },
                { label: "Number of Games", value: cumulativeStats.totalGames },
                { label: "Goals Scored", value: cumulativeStats.totalGoals },
                { label: "Penalties Taken", value: cumulativeStats.totalPenalties },
                { label: "Total Touches", value: cumulativeStats.totalTouches },
              ].map((item) => (
                <View key={item.label} className="flex-row items-center justify-between">
                  <StyledText className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 flex-1">
                    {item.label}
                  </StyledText>
                  <View className="w-20 items-center border-b-2 border-[#FF4422] py-1">
                    <StyledText className="text-xs font-black text-[#FF4422] text-center">
                      {item.value}
                    </StyledText>
                  </View>
                </View>
              ))}

              {/* Editable: Your Position */}
              <View className="flex-row items-center justify-between">
                <StyledText className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 flex-1">
                  Your Position
                </StyledText>
                <Input
                  value={formData.yourPosition}
                  onChangeText={(text) => handleChange('yourPosition', text)}
                  className="w-20 bg-[#E5E5E5] text-black text-xs font-bold text-center border-none h-8 py-1"
                />
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
