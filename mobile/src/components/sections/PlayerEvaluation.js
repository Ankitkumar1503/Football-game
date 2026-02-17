import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { styled } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActiveSession } from "../../hooks/useActiveSession";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";

const StyledText = styled(Text);
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

const EVALUATION_CATEGORIES = {
  TECHNIQUE: [
    "Ability to play with both feet",
    "Passing",
    "Controlling and releasing the ball",
    "Feinting and dribbling",
    "Shooting at goal finishing technique",
    "Heading",
    "Tackling",
    "Playing without the ball",
  ],
  "PHYSICAL ATTRIBUTES": [
    "Strength (Explosiveness)",
    "Speed",
    "Endurance",
    "Suppleness (Mobility)",
    "Core Muscles",
  ],
  "TACTICAL AWARENESS / COGNITIVE SKILLS": [
    "Reading the game",
    "Attacking play attacking one-on-one",
    "Defensive play defending one-on-one",
    "Technique under pressure",
  ],
  "CO-ORDINATION": [
    "Orientation",
    "Endurance",
    "Rhythm",
    "Differentiation",
    "Reaction",
    "Balance",
  ],
  "MENTAL STRENGTHS": [
    "Concentration",
    "Willpower will to win",
    "Perseverance",
    "Confidence",
    "Willingness to take risks",
    "Creativity",
    "Aggression",
  ],
  "SOCIAL SKILLS AND ATTRIBUTES": [
    "Communication",
    "Behavior positive attitude",
    "Charisma / Personality",
  ],
};

export function PlayerEvaluation() {
  const { reflection, updateReflection } = useActiveSession();

  const [evaluatedBy, setEvaluatedBy] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState("");
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const loadData = async () => {
        try {
            const savedBy = await AsyncStorage.getItem("playerEvaluationBy");
            const savedName = await AsyncStorage.getItem("playerEvaluationName");
            const savedAge = await AsyncStorage.getItem("playerEvaluationAge");
            const savedRatings = await AsyncStorage.getItem("playerEvaluation");

            if (savedBy) setEvaluatedBy(savedBy);
            if (savedName) setPlayerName(savedName);
            if (savedAge) setPlayerAge(savedAge);
            if (savedRatings) setRatings(JSON.parse(savedRatings));
        } catch (e) {
            console.error(e);
        }
    };
    loadData();
  }, []);

  useEffect(() => {
      AsyncStorage.setItem("playerEvaluationBy", evaluatedBy);
      AsyncStorage.setItem("playerEvaluationName", playerName);
      AsyncStorage.setItem("playerEvaluationAge", playerAge);
      AsyncStorage.setItem("playerEvaluation", JSON.stringify(ratings));
  }, [evaluatedBy, playerName, playerAge, ratings]);

  useEffect(() => {
    if (reflection) {
      if (reflection.detailedEvaluation) setRatings(prev => ({...prev, ...reflection.detailedEvaluation}));
      if (reflection.evaluatedBy) setEvaluatedBy(reflection.evaluatedBy);
      if (reflection.playerEvaluationName) setPlayerName(reflection.playerEvaluationName);
      if (reflection.playerEvaluationAge) setPlayerAge(reflection.playerEvaluationAge);
    }
  }, [reflection]);

  const handleRatingChange = async (category, skill, rating) => {
    const newRatings = {
      ...ratings,
      [category]: {
        ...(ratings[category] || {}),
        [skill]: rating,
      },
    };
    setRatings(newRatings);
    await updateReflection({ detailedEvaluation: newRatings });
  };

  const updateField = async (setter, key, value) => {
      setter(value);
      await updateReflection({ [key]: value });
  };

  return (
    <View className="mb-6 bg-white dark:bg-[#1A1A1A] p-2 rounded-xl">
        <View className="mb-4 border-b-2 border-black dark:border-white pb-2">
          <StyledText className="text-xl font-black uppercase text-black dark:text-white">
            PLAYER EVALUATIONS
          </StyledText>
        </View>

        <View className="gap-y-4 mb-4">
            <View className="flex-row gap-4">
                <View className="flex-1">
                    <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 mb-1">NAME:</StyledText>
                    <Input 
                        value={playerName} 
                        onChangeText={(text) => updateField(setPlayerName, 'playerEvaluationName', text)}
                        className="bg-[#E5E5E5] text-black border-none"
                    />
                </View>
                <View className="w-24">
                     <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 mb-1">AGE:</StyledText>
                     <Input 
                        value={playerAge} 
                        onChangeText={(text) => updateField(setPlayerAge, 'playerEvaluationAge', text)}
                        className="bg-[#E5E5E5] text-black border-none"
                    />
                </View>
            </View>

            <View>
                 <StyledText className="text-xs font-black uppercase text-gray-800 dark:text-gray-200 mb-1">PLAYER EVALUATION BY:</StyledText>
                 <Input 
                    value={evaluatedBy} 
                    onChangeText={(text) => updateField(setEvaluatedBy, 'evaluatedBy', text)}
                    className="bg-[#E5E5E5] text-black border-none"
                />
            </View>
        </View>

        <View className="flex-row justify-between items-center mb-4">
            <StyledText className="text-[10px] font-black uppercase text-black dark:text-white">EVALUATION:</StyledText>
            <View className="flex-row gap-2">
                {[
                    {id: 1, label: "VERY GOOD"},
                    {id: 2, label: "GOOD"},
                    {id: 3, label: "AVERAGE"},
                    {id: 4, label: "POOR"}
                ].map(item => (
                    <StyledText key={item.id} className="text-[10px] font-bold text-black dark:text-white">
                        {item.id}: {item.label}
                    </StyledText>
                ))}
            </View>
        </View>

        <View className="mb-2 flex-row px-1">
            <View className="flex-1" />
            {[1, 2, 3, 4].map(num => (
                <View key={num} className="w-8 items-center justify-center border border-black/20 dark:border-white/20">
                    <StyledText className="text-xs font-bold text-black dark:text-white">{num}</StyledText>
                </View>
            ))}
        </View>

        <View className="gap-y-6">
            {Object.entries(EVALUATION_CATEGORIES).map(([category, skills]) => (
                <View key={category}>
                    <StyledText className="text-sm font-black uppercase mb-1 border-b border-gray-200 dark:border-gray-700 pb-1 text-black dark:text-white">
                        {category}
                    </StyledText>
                    <View className="gap-y-1">
                        {skills.map(skill => {
                            const currentRating = ratings[category]?.[skill];
                            return (
                                <View key={skill} className="flex-row items-center min-h-[40px] py-1">
                                    <StyledText className="flex-1 text-[10px] font-bold uppercase text-gray-800 dark:text-gray-300 pr-2">
                                        {skill}
                                    </StyledText>
                                    {[1, 2, 3, 4].map(rating => (
                                        <StyledTouchableOpacity
                                            key={rating}
                                            onPress={() => handleRatingChange(category, skill, rating)}
                                            className="w-8 h-8 items-center justify-center p-1"
                                        >
                                            <View className={`w-5 h-5 rounded-sm border border-gray-300 ${
                                                currentRating === rating ? "bg-[#FF4422] border-[#FF4422]" : "bg-transparent"
                                            }`} />
                                        </StyledTouchableOpacity>
                                    ))}
                                </View>
                            );
                        })}
                    </View>
                </View>
            ))}
        </View>
    </View>
  );
}
