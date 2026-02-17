import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { RegisterScreen } from './src/screens/RegisterScreen';
import { TouchCounterScreen } from './src/screens/TouchCounterScreen';
import { ReflectionScreen } from './src/screens/ReflectionScreen';
import { EvaluationScreen } from './src/screens/EvaluationScreen';
import { GradeScreen } from './src/screens/GradeScreen';
import { LineupScreen } from './src/screens/LineupScreen';
import { PolicyScreen } from './src/screens/PolicyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: '#0A0A0A' }
            }}
            initialRouteName="Register"
        >
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Stats" component={RegisterScreen} /> 
          <Stack.Screen name="TouchCounter" component={TouchCounterScreen} />
          <Stack.Screen name="Reflection" component={ReflectionScreen} />
          <Stack.Screen name="Evaluation" component={EvaluationScreen} />
          <Stack.Screen name="Grade" component={GradeScreen} />
          <Stack.Screen name="Lineup" component={LineupScreen} />
          <Stack.Screen name="Policy" component={PolicyScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
