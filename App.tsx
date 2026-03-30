import React from 'react';
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from './src/navigation/RootNavigation';
import { AlertNotificationRoot } from 'react-native-alert-notification';

export default function App() {
  return (
    <SafeAreaProvider>
      <AlertNotificationRoot>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <RootNavigator/>
      </AlertNotificationRoot>
    </SafeAreaProvider>
  );
}