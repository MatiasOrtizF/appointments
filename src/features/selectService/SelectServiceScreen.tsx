
import { Text, FlatList, ListRenderItem, View, StyleSheet } from "react-native";
import { useServices } from "./useSelectService";
import { ServiceCard } from "../home/ServiceCard";
import { Service } from "../../domain/models/Service";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/Colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/types";

export default function SelectServiceScreen() {
  const { services, loading } = useServices()

  if (loading) {
    return <Text>Loading...</Text>
  }

  type NavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    "ScheduleAppointment"
  >;

  const navigation = useNavigation<NavigationProp>();

  const renderItem: ListRenderItem<Service> = ({ item }) => (
    <ServiceCard
      service={item}
      onBook={(service) => navigation.navigate("ScheduleAppointment", { serviceName: service.name })}
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
    color: colors.textSecondary,
    fontSize: 29,
    fontWeight: "700",
    marginBottom: 24,
  },
})