
import { Text, FlatList, ListRenderItem, View, StyleSheet } from "react-native";
import { useServices } from "./useSelectService";
import { ServiceCard } from "./ServiceCard";
import { Service } from "../../domain/models/Service";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightColors, darkColors } from "../../theme/colors";
import { router } from "expo-router";

export default function SelectServiceScreen() {
  const { services, loading } = useServices()

  if (loading) {
    return <Text>Loading...</Text>
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
    <SafeAreaView>
      <FlatList<Service>
        data={services}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 16 }}

        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Book your next</Text>
            <Text style={styles.subTitle}>appointment</Text>
          </View>
        }

        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 33,
    fontWeight: "700",
  },
  subTitle: {
    //color: colors.textSecondary,
    fontSize: 29,
    fontWeight: "700",
    marginBottom: 24,
  },
})