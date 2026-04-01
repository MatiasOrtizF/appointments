import { Slot } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { ThemeProvider } from '../src/data/provider/ThemeProvider'
import { AuthProvider } from '../src/data/provider/AuthProvider'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AlertNotificationRoot>
        <ThemeProvider>
          <AuthProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Slot />
          </AuthProvider>
        </ThemeProvider>
      </AlertNotificationRoot>
    </SafeAreaProvider>
  )
}