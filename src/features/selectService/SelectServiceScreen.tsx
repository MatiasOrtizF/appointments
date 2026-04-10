
import { Text, FlatList, ListRenderItem, View, StyleSheet } from "react-native";
import { useServices } from "./useSelectService";
import { ServiceCard } from "./ServiceCard";
import { Service } from "../../domain/models/Service";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightColors, darkColors } from "../../theme/colors";
import { router } from "expo-router";
import { useTheme } from "../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../theme/globalStyles";
import LoadingScreen from "../../shared/LoadingScreen";

export default function SelectServiceScreen() {
  const { services, loading } = useServices()

  const { isDarkMode } = useTheme();
  const globalStyles = createGlobalStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors;

  if (loading) {
    return <LoadingScreen/>
  }

  const renderItem: ListRenderItem<Service> = ({ item }) => (
    <ServiceCard
      service={item}
      onBook={(serviceName) => router.push({
        pathname: '/bottom/select-service/schedule-appointment',
        params: { serviceName }
      })}
    />
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 29,
    fontWeight: "700",
    marginBottom: 24,
  },
})