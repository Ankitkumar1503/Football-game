import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

import { IntroScreen } from './src/screens/IntroScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TouchCounterScreen } from './src/screens/TouchCounterScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { PassportScreen } from './src/screens/PassportScreen';
import { ChallengeScreen } from './src/screens/ChallengeScreen';
import { AiAgentScreen } from './src/screens/AiAgentScreen';
import { MatchPrepScreen } from './src/screens/MatchPrepScreen';
import { ReflectionScreen } from './src/screens/ReflectionScreen';
import { EvaluationScreen } from './src/screens/EvaluationScreen';
import { GradeScreen } from './src/screens/GradeScreen';
import { LineupScreen } from './src/screens/LineupScreen';
import { NoteToCoachScreen } from './src/screens/NoteToCoachScreen';
import { PolicyScreen } from './src/screens/PolicyScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { PaymentSuccessScreen } from './src/screens/PaymentSuccessScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isRegistered, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#07090E] items-center justify-center">
        <ActivityIndicator size="large" color="#FF4422" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#07090E' },
          animation: 'fade',
        }}
      >
        {!isRegistered ? (
          // Non-registered players: registration screen is strictly required
          <Stack.Group>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Policy" component={PolicyScreen} />
          </Stack.Group>
        ) : (
          // Registered players: full app feature set is available
          <Stack.Group>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="TouchCounter" component={TouchCounterScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} />
            <Stack.Screen name="Passport" component={PassportScreen} />
            <Stack.Screen name="Challenge" component={ChallengeScreen} />
            <Stack.Screen name="AiAgent" component={AiAgentScreen} />
            <Stack.Screen name="MatchPrep" component={MatchPrepScreen} />
            <Stack.Screen name="Reflection" component={ReflectionScreen} />
            <Stack.Screen name="Evaluation" component={EvaluationScreen} />
            <Stack.Screen name="Grade" component={GradeScreen} />
            <Stack.Screen name="Lineup" component={LineupScreen} />
            <Stack.Screen name="NoteToCoach" component={NoteToCoachScreen} />
            <Stack.Screen name="Policy" component={PolicyScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
      <StatusBar style="light" backgroundColor="#07090E" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
