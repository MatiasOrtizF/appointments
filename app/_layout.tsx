import { Slot, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ActivityIndicator, StatusBar, View } from 'react-native'

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { ThemeProvider } from '../src/data/provider/ThemeProvider'
import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { auth } from '../src/config/Firebase'

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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
   if (initializing) return;

    const inAuthGroup = segments[0] === 'auth';

     if (user && inAuthGroup) {
      router.replace('/bottom'); // ya logeado, salir de auth
    } else if (!user && !inAuthGroup) {
      router.replace('/auth/login'); // no logeado, forzar auth
    }
  }, [user, initializing, segments])

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
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Slot />
        </ThemeProvider>
      </AlertNotificationRoot>
    </SafeAreaProvider>
  )
}