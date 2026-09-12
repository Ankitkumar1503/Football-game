import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function IntroScreen() {
  const navigation = useNavigation();

  const handleStart = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('playerProfile');
      const authToken = await AsyncStorage.getItem('authToken');

      if (savedProfile || authToken) {
        navigation.replace('Dashboard');
      } else {
        navigation.replace('Register');
      }
    } catch (e) {
      navigation.replace('Register');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E8470A] items-center justify-between p-6">
      <View className="items-center pt-8">
        <Text
          style={{ letterSpacing: 3 }}
          className="text-[11px] font-black uppercase text-white/80"
        >
          FOOTBALLER ATHLETICS™
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleStart}
        activeOpacity={0.85}
        className="items-center justify-center space-y-6"
      >
        <View className="w-56 h-56 rounded-full bg-white/10 items-center justify-center border-4 border-white/20 shadow-2xl">
          <Image
            source={require('../../assets/touches-intro.png')}
            className="w-48 h-48"
            resizeMode="contain"
          />
        </View>

        <View className="items-center space-y-1">
          <Text
            style={{ letterSpacing: 2.5 }}
            className="text-white text-xs font-black uppercase"
          >
            TAP TO ENTER
          </Text>
          <Text className="text-white/60 text-[10px] font-semibold">
            Track your touches. Master your game.
          </Text>
        </View>
      </TouchableOpacity>

      <View className="items-center pb-4">
        <Text className="text-[9px] font-bold uppercase tracking-widest text-white/60">
          TOUCHES™ MOBILE · FOUNDED BY COACH CLEM MURDOCK
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default IntroScreen;
