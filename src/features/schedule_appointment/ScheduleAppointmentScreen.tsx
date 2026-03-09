import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainStackParamList } from "../../navigation/types";

/* ======================
   TYPES & CONSTANTS
====================== */
type Hour = string;

const HOURS: Hour[] = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

/* ======================
   HELPERS (FUERA)
====================== */
const isWeekendOrWednesday = (dateString: string) => {
  const day = new Date(dateString).getDay();
  return day === 0 || day === 3; // domingo o miércoles
};

/* ======================
   SCREEN
====================== */

type ScheduleRouteProp = RouteProp<
  MainStackParamList,
  "ScheduleAppointment"
>;

export const ScheduleAppointmentScreen: React.FC = () => {
  const route = useRoute<ScheduleRouteProp>();
  const { serviceName } = route.params;

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(todayString);
  const [selectedTime, setSelectedTime] = useState<Hour | null>(null);

  const handleContinue  = () => {
    console.log(serviceName +  selectedDate + "-" + selectedTime)
};

  /* ===== LIMITES DE NAVEGACIÓN ===== */
  const minDate = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return d.toISOString().split("T")[0];
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  /* ===== DÍAS DESHABILITADOS ===== */
  const disabledDays = useMemo(() => {
    const result: Record<string, any> = {};
    let d = new Date(minDate);
    const end = new Date(maxDate);

    while (d <= end) {
      const dateString = d.toISOString().split("T")[0];

      if (isWeekendOrWednesday(dateString)) {
        result[dateString] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }

      d.setDate(d.getDate() + 1);
    }

    return result;
  }, [minDate, maxDate]);

  /* ===== MARKED DATES SIMPLE ===== */
  const markedDates = useMemo(() => {
    return {
      ...disabledDays,
      [selectedDate]: {
        selected: true,
        selectedColor: "#000",
      },
    };
  }, [disabledDays, selectedDate]);

  /* ===== HANDLERS ===== */
  const onDayPress = useCallback((day: any) => {
    if (isWeekendOrWednesday(day.dateString)) return;

    setSelectedDate(day.dateString);
    setSelectedTime(null); // reset hora al cambiar día
  }, []);

  const onSelectHour = (hour: Hour) => {
    setSelectedTime(hour);
  };

  /* ======================
     RENDER
  ====================== */
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 📅 CALENDARIO */}
        <Text style={styles.title}>Seleccionar fecha</Text>

        <Calendar
          current={todayString}
          minDate={minDate}
          maxDate={maxDate}
          markedDates={markedDates}
          onDayPress={onDayPress}
          enableSwipeMonths={false}
          hideExtraDays
          theme={{
            arrowColor: "#000",
            todayTextColor: "#000",
            textDisabledColor: "#B0B0B0",
          }}
        />

        {/* ⏰ HORARIOS */}
        <Text style={styles.sectionTitle}>Horarios disponibles</Text>

        <View style={styles.hoursContainer}>
          {HOURS.map((hour) => {
            const selected = hour === selectedTime;

            return (
              <TouchableOpacity
                key={hour}
                onPress={() => onSelectHour(hour)}
                style={[
                  styles.hourItem,
                  selected && styles.hourSelected,
                ]}
              >
                <Text
                  style={[
                    styles.hourText,
                    selected && styles.hourTextSelected,
                  ]}
                >
                  {hour}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ✅ FOOTER */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.selectedLabel}>Selected time</Text>
          <Text style={styles.selectedValue}>
            {selectedTime
              ? `${selectedDate} · ${selectedTime}`
              : "Seleccioná un horario"}
          </Text>
        </View>

        <TouchableOpacity
            onPress={handleContinue }
          disabled={!selectedTime}
          style={[
            styles.continueButton,
            !selectedTime && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
      selected: {
    marginTop: 16,
    fontSize: 16,
  },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
    calendar: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    calendarTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    calendarDate: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "700",
    },

    sectionTitle: {
        marginTop: 24,
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: "600",
    },

    hoursContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 16,
        gap: 12,
    },
    hourItem: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    hourSelected: {
        backgroundColor: "#000",
        borderColor: "#000",
    },
    hourText: {
        fontSize: 14,
    },
    hourTextSelected: {
        color: "#fff",
    },

    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#eee",
    },
    selectedLabel: {
        fontSize: 12,
        color: "#666",
    },
    selectedValue: {
        fontSize: 14,
        fontWeight: "600",
    },

    continueButton: {
        backgroundColor: "#000",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    continueText: {
        color: "#fff",
        fontWeight: "600",
    },
});