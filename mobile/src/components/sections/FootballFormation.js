import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActiveSession } from "../../hooks/useActiveSession";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";

const StyledText = styled(Text);
const StyledView = styled(View);

const PlayerPosition = ({ number, name, onChange, style }) => (
    <View className="absolute items-center" style={style}>
        <View className="w-6 h-6 rounded-full bg-black dark:bg-white border border-white dark:border-black items-center justify-center mb-1">
            <StyledText className="text-white dark:text-black text-[10px] font-black">{number}</StyledText>
        </View>
        <Input 
            value={name}
            onChangeText={onChange}
            className="w-16 bg-white/90 dark:bg-black/90 text-black dark:text-white h-5 text-[8px] p-0 text-center border border-white dark:border-black"
            placeholder="Name"
        />
    </View>
);

export function FootballFormation() {
  const { reflection, updateReflection } = useActiveSession();
  const [hydrated, setHydrated] = useState(false);

  const [formData, setFormData] = useState({
      teamName: "",
      date: "",
      players: {
        1: "", 2: "", 3: "", 4: "", 5: "", 
        6: "", 7: "", 8: "", 9: "", 10: "", 11: ""
      },
  });

  useEffect(() => {
    const loadData = async () => {
        try {
            const saved = await AsyncStorage.getItem("footballFormation");
            if (saved && !hydrated) {
                setFormData(JSON.parse(saved));
                setHydrated(true);
            }
        } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!hydrated && reflection?.formation) {
      setFormData({
        teamName: reflection.formation.teamName ?? "",
        date: reflection.formation.date ?? "",
        players: reflection.formation.players ?? formData.players,
      });
      setHydrated(true);
    }
  }, [reflection]);

  useEffect(() => {
    AsyncStorage.setItem("footballFormation", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if(hydrated) {
        const timeout = setTimeout(() => {
            updateReflection({ formation: formData });
        }, 1000);
        return () => clearTimeout(timeout);
    }
  }, [formData, hydrated]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlayerChange = (position, value) => {
    setFormData((prev) => ({
      ...prev,
      players: { ...prev.players, [position]: value },
    }));
  };

  return (
    <View className="mb-6 bg-white dark:bg-[#1A1A1A] p-4 rounded-xl">
        <StyledText className="text-xl font-black uppercase text-center text-black dark:text-white mb-6">
            STARTING LINEUP
        </StyledText>

        <View className="gap-y-4 mb-4">
            <View>
                <StyledText className="text-xs font-bold uppercase text-black dark:text-white mb-1">TEAM</StyledText>
                <Input 
                    value={formData.teamName}
                    onChangeText={(text) => handleInputChange('teamName', text)}
                    className="bg-[#E5E5E5] text-black border-none"
                />
            </View>
            <View>
                <StyledText className="text-xs font-bold uppercase text-black dark:text-white mb-1">DATE</StyledText>
                <Input 
                    value={formData.date}
                    onChangeText={(text) => handleInputChange('date', text)}
                    className="bg-[#E5E5E5] text-black border-none"
                    placeholder="YYYY-MM-DD"
                />
            </View>
        </View>

        {/* Football Field */}
        <View className="mt-4 relative bg-green-600 dark:bg-green-800 aspect-[3/4] w-full border-2 border-white rounded-lg overflow-hidden">
             {/* Center line */}
            <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-50" />
            
            {/* Center circle */}
            <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full opacity-50" />

            {/* Goal boxes */}
            <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 border-2 border-b-0 border-white opacity-50" />
            <View className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 border-2 border-t-0 border-white opacity-50" />

            {/* Penalty boxes */}
            <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-b-0 border-white opacity-50" />
            <View className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-t-0 border-white opacity-50" />


            {/* Players - Fixed Absolute Positioning to match Image */}
            <PlayerPosition number={1} name={formData.players[1]} onChange={(v) => handlePlayerChange(1, v)} style={{ bottom: '2%', left: '40%' }} />
            
            <PlayerPosition number={2} name={formData.players[2]} onChange={(v) => handlePlayerChange(2, v)} style={{ bottom: '15%', right: '5%' }} />
            <PlayerPosition number={3} name={formData.players[3]} onChange={(v) => handlePlayerChange(3, v)} style={{ bottom: '15%', left: '5%' }} />
            <PlayerPosition number={4} name={formData.players[4]} onChange={(v) => handlePlayerChange(4, v)} style={{ bottom: '15%', right: '28%' }} />
            <PlayerPosition number={5} name={formData.players[5]} onChange={(v) => handlePlayerChange(5, v)} style={{ bottom: '15%', left: '28%' }} />

            <PlayerPosition number={6} name={formData.players[6]} onChange={(v) => handlePlayerChange(6, v)} style={{ top: '60%', left: '40%' }} />
            
            <PlayerPosition number={7} name={formData.players[7]} onChange={(v) => handlePlayerChange(7, v)} style={{ top: '45%', right: '10%' }} />
            <PlayerPosition number={8} name={formData.players[8]} onChange={(v) => handlePlayerChange(8, v)} style={{ top: '45%', right: '30%' }} />
            <PlayerPosition number={10} name={formData.players[10]} onChange={(v) => handlePlayerChange(10, v)} style={{ top: '45%', left: '30%' }} />
            <PlayerPosition number={11} name={formData.players[11]} onChange={(v) => handlePlayerChange(11, v)} style={{ top: '45%', left: '10%' }} />
            
            <PlayerPosition number={9} name={formData.players[9]} onChange={(v) => handlePlayerChange(9, v)} style={{ top: '15%', left: '40%' }} />

        </View>
    </View>
  );
}
