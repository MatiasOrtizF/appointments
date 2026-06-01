export type Hour = string;

export const generateHours = (
  hourStart: string,
  hourEnd: string,
  duration: number,
  hoursNotAvailable: string[],
  day: string
): Hour[] => {
  console.log("los horarios no disponibles son: ", hoursNotAvailable, "hour start: ", hourStart, "hour end: ", hourEnd)
  const result: Hour[] = [];

  const [startHour, startMinute] = hourStart.split(":").map(Number);
  const [endHour, endMinute] = hourEnd.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const now = new Date();
  const todayString = now.toISOString().split("T")[0];
  const isNow = todayString === day
  const currentTotalMinutes = isNow ? now.getHours() * 60 + now.getMinutes() : 0;

  for (
    let current = startTotalMinutes;
    current <= endTotalMinutes;
    current += duration
  ) {
    const hour = Math.floor(current / 60);
    const minute = current % 60;

    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");

    const time = `${formattedHour}:${formattedMinute}`;

    const isFutureHour = current > currentTotalMinutes;
    const isAvailable = !hoursNotAvailable.includes(time);

    if (isFutureHour && isAvailable) {
      result.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  return result;
};