import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useScheduleAppointment } from "./useScheduleAppointment";
import LoadingScreen from "../../shared/LoadingScreen";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useTheme } from "../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../theme/globalStyles";
import { darkColors, lightColors } from "../../theme/colors";
import Divider from "../../shared/Divider";

/* ======================
   TYPES & CONSTANTS
====================== */
type Hour = string;

/*const HOURS: Hour[] = [
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
];*/

/* ======================
   HELPERS (FUERA)
====================== */
const isWeekendOrWednesday = (dateString: string, disabledDays: number[]) => {
  const dayIndex = new Date(dateString).getDay();
  return disabledDays.includes(dayIndex);
  //return day === 0 || day === 3; // domingo o miércoles
};

/* ======================
   SCREEN
====================== */

export const ScheduleAppointmentScreen: React.FC = () => {
  const { serviceId, employeeImg, employeeName, employeeId } = useLocalSearchParams<{
    serviceId?: string
    employeeImg?: string
    employeeName?: string
    employeeId?: string
  }>()

  const route = useRoute();
  const { serviceName } = useLocalSearchParams<{ serviceName?: string }>()
  const { service, hours, daysNotAvailable, today, todayString, selectedDate, setSelectedDate, selectedTime, setSelectedTime, success, loading, error, fetchHourAvailable, fetchService, createApointment } = useScheduleAppointment()

  const navigation = useNavigation()

  const { isDarkMode } = useTheme();
  const globalStyles = createGlobalStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors;

  const handleContinue = () => {

    createApointment(selectedDate, selectedTime, employeeImg, employeeName, employeeId)
    //console.log(serviceName + selectedDate + "T" + selectedTime+":00")
  };

  useEffect(() => {
    if (serviceId) {
      fetchHourAvailable(serviceId)
    }
  }, [])

  useEffect(() => {
    if (success) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Turno reservado',
        textBody: 'Puedes ver todos tus turnos en la seccion de booking',
        button: 'Continuar',
        closeOnOverlayTap: false,
        onPressButton: () => {
          Dialog.hide();
          navigation.goBack();
        },
      });
    }

    if (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error,
        button: "Cerrar",
        closeOnOverlayTap: false,
      });
    }
  }, [success, error])

  /* ===== LIMITES DE NAVEGACIÓN ===== */
  const minDate = useMemo(() => {
    return today.toISOString().split("T")[0];
    /*const d = new Date(today.getFullYear(), today.getMonth(), 1);
    return d.toISOString().split("T")[0];*/
  }, [today]);

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
      if (daysNotAvailable) {
        if (isWeekendOrWednesday(dateString, daysNotAvailable)) {
          result[dateString] = {
            disabled: true,
            disableTouchEvent: true,
          };
        }
      }

      d.setDate(d.getDate() + 1);
    }

    return result;
  }, [minDate, maxDate, daysNotAvailable]);

  /* ===== MARKED DATES SIMPLE ===== */
  const markedDates = useMemo(() => {
    return {
      ...disabledDays,
      [selectedDate]: {
        selected: true,
        selectedColor: colors.primary,
      },
    };
  }, [disabledDays, selectedDate]);

  /* ===== HANDLERS ===== */
  const onDayPress = useCallback((day: any) => {
    if (daysNotAvailable) {
      if (isWeekendOrWednesday(day.dateString, daysNotAvailable)) return;
    }

    setSelectedDate(day.dateString);
    setSelectedTime(null); // reset hora al cambiar día
  }, [daysNotAvailable]);

  const handleSelectHour = (hour: Hour) => {
    if (hour === selectedTime) {
      setSelectedTime(null);
    } else {
      setSelectedTime(hour);
    }
  };

  if (loading || !daysNotAvailable) {
    return (
      <LoadingScreen />
    )
  }

  /* ======================
     RENDER
  ====================== */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 📅 CALENDARIO */}
        <Calendar
          current={todayString}
          minDate={minDate}
          maxDate={maxDate}
          markedDates={markedDates}
          onDayPress={onDayPress}
          enableSwipeMonths={false}
          hideExtraDays
          theme={{
            calendarBackground: colors.background,
            arrowColor: colors.textPrimary,
            monthTextColor: colors.textPrimary,

            textSectionTitleColor: colors.textSecondary,
            textDisabledColor: colors.textSecondary,

            dayTextColor: colors.textPrimary,

            selectedDayTextColor: '#000',
          }}
        />

        <View style={{ flexDirection: 'row', marginVertical: 15, gap: 20 }}>
          <View style={globalStyles.status}>
            <View style={[
              globalStyles.statusDot,
              { backgroundColor: colors.primary }
            ]} />
            <Text style={{ color: colors.textSecondary }}>Selected</Text>
          </View>

          <View style={globalStyles.status}>
            <View style={[
              globalStyles.statusDot,
              { backgroundColor: colors.textPrimary }
            ]} />
            <Text style={{ color: colors.textSecondary }}>Disponible</Text>
          </View>

          <View style={globalStyles.status}>
            <View style={[
              globalStyles.statusDot,
              { backgroundColor: colors.textSecondary }
            ]} />
            <Text style={{ color: colors.textSecondary }}>No Disponible</Text>
          </View>
        </View>

        <Divider />

        {/* ⏰ HORARIOS */}
        <Text style={[globalStyles.subTitle, { color: colors.textPrimary, marginTop: 15 }]}>Horarios disponibles</Text>

        <View style={styles.hoursContainer}>
          {hours?.map((hour) => {
            const selected = hour === selectedTime;

            return (
              <TouchableOpacity
                key={hour}
                onPress={() => handleSelectHour(hour)}
                style={[
                  styles.hourItem,
                  { borderColor: colors.textPrimary },
                  selected && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    { color: colors.textPrimary },
                    selected && { color: "#1f1f1f", fontWeight: "600" }
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
      <View style={[styles.bottomBar, { borderColor: colors.textPrimary }]}>
        <View>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>SELECTED TIME</Text>
          <Text style={[styles.selectedValue, { color: colors.textPrimary }]}>
            {selectedTime
              ? `${selectedDate} · ${selectedTime}`
              : "Seleccioná un horario"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedTime}
          style={[
            globalStyles.primaryButton,
            !selectedTime && styles.buttonDisabled,
            { flex: 1 }
          ]}
        >
          <Text style={globalStyles.primaryButtonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 15
  },
  selectedValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.5,
  }
});