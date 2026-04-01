import { Text, View, StyleSheet, ActivityIndicator, Pressable } from "react-native"
import { useVerifyEmail } from "./useVerifyEmail";
import { lightColors, darkColors } from "../../../theme/colors";
import { useState } from "react";
import { useTheme } from "../../../data/provider/ThemeProvider";

export default function VerifyEmailScreen() {
  const [seconds, setSeconds] = useState(0);

  const { isDarkMode } = useTheme();
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

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Verify your email</Text>

      <Text style={styles.subtitle}>
        We sent you a verification link. Please check your inbox and verify your account to continue.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading && <ActivityIndicator size="large" style={{ marginBottom: 20 }} />}

      <Pressable style={[styles.primaryButton]} onPress={verifyEmail}>
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
        <Text style={[styles.secondaryText, { color: seconds > 0 ? "white" : undefined }]}> {seconds > 0 ? `Resend email (${seconds}s)` : "Resend email verification"}</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center"
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555"
  },

  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center"
  },

  primaryButton: {
    //backgroundColor: colors.secondary,
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
    //borderColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%"
  },

  secondaryText: {
    textAlign: "center",
    fontWeight: "600"
  },

  logoutButton: {
    marginTop: 10
  },

  logoutText: {
    color: "red",
    fontWeight: "600"
  }

});