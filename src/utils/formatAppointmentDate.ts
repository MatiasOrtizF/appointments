export const formatAppointmentDate = (
  appointmentAt: string
): string => {

  const date = new Date(appointmentAt);

  const datePart = date.toLocaleDateString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).replace(",", "");

  const timePart = date.toLocaleTimeString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const capitalizedDate =
    datePart.charAt(0).toUpperCase() + datePart.slice(1);

  return `${capitalizedDate} · ${timePart} hs`;
};