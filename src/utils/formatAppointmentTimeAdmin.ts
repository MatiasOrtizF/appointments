export const formatAppointmentTimeAdmin = (date: string) => {
  return new Date(date).toLocaleTimeString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}