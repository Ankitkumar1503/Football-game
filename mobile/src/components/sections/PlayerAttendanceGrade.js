import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActiveSession } from "../../hooks/useActiveSession";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

export function PlayerAttendanceGrade() {
  const { reflection, updateReflection } = useActiveSession();
  const [hydrated, setHydrated] = useState(false);

  const [fullData, setFullData] = useState({
      metadata: {
        date: "",
        game: "",
        training: "",
        tryout: "",
        evaluation: "",
        team: "",
        sessionType: "",
      },
      records: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        lastName: "",
        firstName: "",
        age: "",
        position: "",
        grades: {
          A: false,
          B: false,
          C: false,
        },
      })),
  });

  useEffect(() => {
    const loadData = async () => {
        try {
            const saved = await AsyncStorage.getItem("playerAttendance");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (!hydrated) {
                    setFullData(parsed);
                    setHydrated(true);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!hydrated && reflection?.attendance) {
      setFullData({
        metadata: {
          date: reflection.attendance.metadata?.date ?? "",
          game: reflection.attendance.metadata?.game ?? "",
          training: reflection.attendance.metadata?.training ?? "",
          tryout: reflection.attendance.metadata?.tryout ?? "",
          evaluation: reflection.attendance.metadata?.evaluation ?? "",
          team: reflection.attendance.metadata?.team ?? "",
          sessionType: reflection.attendance.metadata?.sessionType ?? "",
        },
        records: reflection.attendance.records ?? [],
      });
      setHydrated(true);
    }
  }, [reflection]);

  useEffect(() => {
    AsyncStorage.setItem("playerAttendance", JSON.stringify(fullData));
  }, [fullData]);

  useEffect(() => {
      if(hydrated) {
        const timeout = setTimeout(() => {
            updateReflection({ attendance: fullData });
        }, 1000);
        return () => clearTimeout(timeout);
      }
  }, [fullData, hydrated]);


  const handleMetadataChange = (field, value) => {
    setFullData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }));
  };

  const handleRecordChange = (id, field, value) => {
    setFullData((prev) => ({
      ...prev,
      records: prev.records.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

    const handleGradeToggle = (id, grade) => {
    setFullData((prev) => ({
      ...prev,
      records: prev.records.map((item) =>
        item.id === id
          ? {
              ...item,
              grades: {
                A: false,
                B: false,
                C: false,
                [grade]: !item.grades[grade],
              },
            }
          : item,
      ),
    }));
  };

  return (
    <View className="mb-6 bg-white dark:bg-[#1A1A1A] p-2 rounded-xl">
        <View className="mb-4">
           <StyledText className="text-xl font-black uppercase text-center text-black dark:text-white mb-4">
             PLAYER GRADE
           </StyledText>
           
           <View className="mb-4 gap-y-2">
               <View className="flex-row justify-between items-center">
                    <StyledText className="text-xs font-bold uppercase text-black dark:text-white">
                        PLAYER ATTENDANCE RECORD/GRADE
                    </StyledText>
                    <View className="w-32">
                         <StyledText className="text-[10px] font-bold uppercase text-black dark:text-white mb-1">DATE</StyledText>
                         <Input 
                            value={fullData.metadata?.date}
                            onChangeText={(text) => handleMetadataChange('date', text)}
                            className="bg-[#E5E5E5] text-black h-8 text-xs p-1 border-none"
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
               </View>

               <View className="flex-row flex-wrap gap-4 mt-2">
                   {["GAME", "TRAINING", "TRYOUT", "EVALUATION"].map((type) => (
                       <StyledTouchableOpacity 
                            key={type} 
                            onPress={() => handleMetadataChange("sessionType", type)}
                            className="flex-row items-center gap-2"
                        >
                           <StyledText className="text-[10px] font-bold uppercase text-black dark:text-white">{type}</StyledText>
                           <View className={`w-4 h-4 rounded-full border border-black dark:border-white items-center justify-center ${
                               fullData.metadata?.sessionType === type ? "bg-black dark:bg-white" : "bg-transparent"
                           }`} />
                       </StyledTouchableOpacity>
                   ))}
               </View>

               <View className="mt-2">
                   <StyledText className="text-[10px] font-bold uppercase text-black dark:text-white mb-1">TEAM</StyledText>
                   <Input 
                        value={fullData.metadata?.team}
                        onChangeText={(text) => handleMetadataChange('team', text)}
                        className="bg-[#E5E5E5] text-black h-8 text-xs p-1 border-none"
                    />
               </View>
           </View>
        </View>

        <ScrollView horizontal className="pb-4">
            <View>
                <View className="flex-row border-b border-gray-500 pb-2 mb-2">
                    <StyledText className="w-8 text-[10px] font-bold text-center text-black dark:text-white">#</StyledText>
                    <StyledText className="w-24 text-[10px] font-bold text-center text-black dark:text-white">LAST NAME</StyledText>
                    <StyledText className="w-24 text-[10px] font-bold text-center text-black dark:text-white">FIRST NAME</StyledText>
                    <StyledText className="w-10 text-[10px] font-bold text-center text-black dark:text-white">AGE</StyledText>
                    <StyledText className="w-16 text-[10px] font-bold text-center text-black dark:text-white">POS</StyledText>
                    <StyledText className="w-8 text-[10px] font-bold text-center text-black dark:text-white">A</StyledText>
                    <StyledText className="w-8 text-[10px] font-bold text-center text-black dark:text-white">B</StyledText>
                    <StyledText className="w-8 text-[10px] font-bold text-center text-black dark:text-white">C</StyledText>
                </View>

                {fullData.records.map((row) => (
                    <View key={row.id} className="flex-row items-center mb-1 border-b border-gray-800 dark:border-gray-800 pb-1">
                        <StyledText className="w-8 text-[10px] font-bold text-center text-gray-500">{row.id}</StyledText>
                        <View className="w-24 px-1">
                            <Input 
                                value={row.lastName}
                                onChangeText={(text) => handleRecordChange(row.id, 'lastName', text)}
                                className="bg-[#E5E5E5] text-black h-6 text-[10px] p-0 px-1 border-none"
                            />
                        </View>
                        <View className="w-24 px-1">
                            <Input 
                                value={row.firstName}
                                onChangeText={(text) => handleRecordChange(row.id, 'firstName', text)}
                                className="bg-[#E5E5E5] text-black h-6 text-[10px] p-0 px-1 border-none"
                            />
                        </View>
                        <View className="w-10 px-1">
                            <Input 
                                value={row.age}
                                onChangeText={(text) => handleRecordChange(row.id, 'age', text)}
                                className="bg-[#E5E5E5] text-black h-6 text-[10px] p-0 px-1 text-center border-none"
                            />
                        </View>
                        <View className="w-16 px-1">
                            <Input 
                                value={row.position}
                                onChangeText={(text) => handleRecordChange(row.id, 'position', text)}
                                className="bg-[#E5E5E5] text-black h-6 text-[10px] p-0 px-1 text-center border-none"
                            />
                        </View>
                        {["A", "B", "C"].map(grade => (
                            <View key={grade} className="w-8 items-center justify-center">
                                <StyledTouchableOpacity 
                                    onPress={() => handleGradeToggle(row.id, grade)}
                                    className={`w-4 h-4 rounded-full border border-gray-400 ${
                                        row.grades[grade] ? "bg-[#FF4422] border-[#FF4422]" : "bg-[#E5E5E5]"
                                    }`}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    </View>
  );
}
