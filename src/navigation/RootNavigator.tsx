import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { useAppStateStore } from '../stores/appStateStore';

import MainTabNavigator from './MainTabNavigator';
import ReorderScreen from '../screens/ReorderScreen';
import PreviewScreen from '../screens/PreviewScreen';
import FeedbackScreen from '../screens/FeedbackScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { background } = useTheme();
  const { isInitialized, initializeApp } = useAppStateStore();

  useEffect(() => {
    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="ReorderScreen" component={ReorderScreen} />
      <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
    </Stack.Navigator>
  );
}
