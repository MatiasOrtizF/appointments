import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen } from './src/shared/auth/LoginScreen';
import { HomeScreen } from './src/shared/home/HomeScreen';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
       <HomeScreen/>
    </SafeAreaProvider>
  );
}