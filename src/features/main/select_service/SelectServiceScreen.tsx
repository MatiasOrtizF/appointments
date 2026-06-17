
import { Text, FlatList, ListRenderItem, View, StyleSheet, RefreshControl, TouchableOpacity, Modal, TextInput } from "react-native";
import { useServices } from "./useSelectService";
import { ServiceCard } from "./ServiceCard";
import { Service } from "../../../domain/models/service/Service";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightColors, darkColors } from "../../../theme/colors";
import { router } from "expo-router";
import { useTheme } from "../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../theme/globalStyles";
import LoadingScreen from "../../../shared/components/LoadingScreen";
import { useState } from "react";

export default function SelectServiceScreen() {
  const [chatVisible, setChatVisible] = useState(false)
  const { services, message, setMessage, messages, loading, refreshing, onRefresh, sendMessage } = useServices()

  const { isDarkMode } = useTheme();
  const globalStyles = createGlobalStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors;

  if (loading) {
    return <LoadingScreen />
  }

  const renderItem: ListRenderItem<Service> = ({ item }) => (
    <ServiceCard
      service={item}
      onBook={(serviceId) => router.push({
        pathname: '/bottom/select-service/service-detail',
        params: { serviceId }
      })}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList<Service>
        data={services}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 16 }}

        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text style={globalStyles.title}>Book your next</Text>
            <Text style={[styles.subTitle, { color: colors.textSecondary }]}>appointment</Text>
          </View>
        }

        renderItem={renderItem}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setChatVisible(true)}
      >
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={chatVisible}
        transparent
        onRequestClose={() => setChatVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.chatContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Asistente Virtual</Text>

              <TouchableOpacity
                onPress={() => setChatVisible(false)}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesContainer}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.message,
                    item.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage,
                  ]}
                >
                  <Text>{item.text}</Text>
                </View>
              )}
            />
            <View style={styles.inputContainer}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Escribí un mensaje..."
                style={styles.input}
              />

              <TouchableOpacity
                onPress={sendMessage}
                style={styles.sendButton}
              >
                <Text style={styles.sendText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 29,
    fontWeight: "700",
    marginBottom: 24,
  },

  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 32,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  chatButtonText: {
    fontSize: 28,
    color: "#fff",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  chatContainer: {
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  header: {
    height: 60,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  closeButton: {
    fontSize: 20,
  },

  messagesContainer: {
    padding: 16,
  },

  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d9fdd3",
  },

  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#efefef",
  },

  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  padding: 12,
  borderTopWidth: 1,
  borderColor: "#eee",
},

input: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 20,
  paddingHorizontal: 12,
  height: 42,
},

sendButton: {
  marginLeft: 8,
  paddingHorizontal: 16,
},

sendText: {
  fontWeight: "600",
},
})