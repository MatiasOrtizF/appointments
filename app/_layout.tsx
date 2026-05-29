import { Slot, useRouter, useSegments } from "expo-router"

import { SafeAreaProvider } from "react-native-safe-area-context"

import { StatusBar } from "react-native"

import { AlertNotificationRoot }
  from "react-native-alert-notification"

import { useEffect } from "react"

import {
  ThemeProvider,
  useTheme
} from "../src/data/provider/ThemeProvider"

import {
  AuthProvider,
  useAuth
} from "../src/data/provider/AuthProvider"

import LoadingScreen
  from "../src/shared/LoadingScreen"

export default function RootLayout() {

  return (
    <SafeAreaProvider>

      <AlertNotificationRoot>

        <ThemeProvider>

          <AuthProvider>
            <NavigationGuard />
          </AuthProvider>

        </ThemeProvider>

      </AlertNotificationRoot>

    </SafeAreaProvider>
  )
}

function NavigationGuard() {

  const router = useRouter()

  const segments = useSegments()

  const {
    loading,
    isAuthenticated,
    user
  } = useAuth()

  useEffect(() => {

    if (loading) return

    const inAuthGroup =
      segments[0] === "auth"

    const inVerifyScreen =
      segments.includes("verify-email")

    const isEmailVerified =
      !!user?.email_confirmed_at

    // NO autenticado
    if (!isAuthenticated) {

      if (!inAuthGroup) {
        router.replace("/auth/login")
      }

      return
    }

    // autenticado pero NO verificado
    if (!isEmailVerified) {

      if (!inVerifyScreen) {
        router.replace("/auth/verify-email")
      }

      return
    }

    // autenticado + verificado
    if (inAuthGroup) {
      router.replace("/bottom")
    }

  }, [
    loading,
    isAuthenticated,
    user,
    segments
  ])

  if (loading) {
    return <LoadingScreen />
  }

  return <AppContent />
}

function AppContent() {

  const { isDarkMode } = useTheme()

  return (
    <>
      <StatusBar
        barStyle={
          isDarkMode
            ? "light-content"
            : "dark-content"
        }

        backgroundColor={
          isDarkMode
            ? "#1f1f1f"
            : "#f5f6fa"
        }
      />

      <Slot />
    </>
  )
}