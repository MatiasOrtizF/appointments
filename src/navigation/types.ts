export type AuthStackParamList = {
  Login: undefined
  Register: undefined
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