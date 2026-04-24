export type Hour = string;

export const generateHours = (
  hourStart: string,
  hourEnd: string,
  duration: number
): Hour[] => {
  const result: Hour[] = [];

  const [startHour, startMinute] = hourStart.split(":").map(Number);
  const [endHour, endMinute] = hourEnd.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  for (
    let current = startTotalMinutes;
    current <= endTotalMinutes;
    current += duration
  ) {
    const hour = Math.floor(current / 60);
    const minute = current % 60;

    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");

    result.push(`${formattedHour}:${formattedMinute}`);
  }

  return result;
};