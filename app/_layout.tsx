import { Slot, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ActivityIndicator, StatusBar, View } from 'react-native'

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { ThemeProvider } from '../src/data/provider/ThemeProvider'
import { AuthProvider } from '../src/data/provider/AuthProvider'
import { Activity, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../src/config/Firebase'

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: User | null) => {
    console.log("onAuthChanged", user)
    setUser(user);

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged)
    return subscriber;
  }, [])


  useEffect(() => {
    if(initializing) return;

    if(user) {
      router.replace('/bottom')
    }
  }, [user, initializing])

  if (initializing)
    return (
      <View style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1
      }}>
        <ActivityIndicator size="large" />
      </View>
    )

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