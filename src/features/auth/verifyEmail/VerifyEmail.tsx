import { Text, View, StyleSheet, ActivityIndicator, Pressable } from "react-native"
import { useVerifyEmail } from "./useVerifyEmail";
import { lightColors, darkColors } from "../../../theme/colors";
import { useState } from "react";
import { useTheme } from "../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../theme/globalStyles";
import LoadingScreen from "../../../shared/LoadingScreen";

export default function VerifyEmailScreen() {
  const [seconds, setSeconds] = useState(0);

  const { isDarkMode } = useTheme();
  const globalStyles = createGlobalStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors

  const {
    sendEmailVerification,
    verifyEmail,
    logOut,
    loading,
    error
  } = useVerifyEmail();

  const startCounter = () => {
    sendEmailVerification()

    setSeconds(30);

    const interval = setInterval(() => {

      setSeconds((prev) => {

        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });

    }, 1000);
  };

  if (loading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>

      <Text style={[globalStyles.title, { textAlign: "center", marginBottom: 10 }]}>Verify your email</Text>

      <Text style={[globalStyles.subTitle, { textAlign: "center", marginBottom: 30 }]}>
        We sent you a verification link. Please check your inbox and verify your account to continue.
      </Text>

       {error && <Text style={globalStyles.error}>❌ {error}</Text>}

      <Pressable style={[styles.primaryButton, { backgroundColor: colors.secondary }]} onPress={verifyEmail}>
        <Text style={styles.primaryText}>I already verified my email</Text>
      </Pressable>

      <Pressable
        onPress={startCounter}
        style={[
          styles.secondaryButton,
          {
            borderColor: seconds > 0 ? "#ccc" : colors.secondary,
            backgroundColor: seconds > 0 ? "#ccc" : "transparent",
          }]}
        disabled={seconds > 0}
      >
        <Text style={[styles.secondaryText, { color: seconds > 0 ? "white" : colors.textPrimary }]}> {seconds > 0 ? `Resend email (${seconds}s)` : "Resend email verification"}</Text>
      </Pressable>

      <Pressable style={{ marginTop: 10 }} onPress={logOut}>
        <Text style={{ color: colors.error, fontWeight: "600" }}>Logout</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center"
  },

  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%"
  },

  primaryText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600"
  },

  secondaryButton: {
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%"
  },

  secondaryText: {
    textAlign: "center",
    fontWeight: "600"
  },

});