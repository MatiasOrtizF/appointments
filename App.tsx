import React from 'react';
import "./src/config/CalendarLocale";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LoginScreen } from './src/shared/auth/LoginScreen';
import { HomeScreen } from './src/shared/home/HomeScreen';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScheduleAppointmentScreen } from './src/shared/schedule_appointment/ScheduleAppointmentScreen';

export default function App() {
  return (
    <SafeAreaProvider>
       <ScheduleAppointmentScreen/>
    </SafeAreaProvider>
  );
}