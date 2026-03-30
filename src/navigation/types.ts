export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  RecoveryPasswordScreen: undefined
}

export type MainStackParamList = {
  Tabs: undefined;
  ScheduleAppointment: { serviceName: string };
  AdminAppointments: undefined;
}

export type MainTabParamList = {
  SelectService: undefined
  Booking: undefined
  Profile: undefined
}

export type SettingsStackParamList = {
  SettingsHome: undefined
  ChangePassword: undefined
}