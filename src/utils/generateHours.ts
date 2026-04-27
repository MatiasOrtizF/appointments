export type Hour = string;

export const generateHours = (
  hourStart: string,
  hourEnd: string,
  duration: number,
  hoursNotAvailable: string[]
): Hour[] => {
  const result: Hour[] = [];

  const [startHour, startMinute] = hourStart.split(":").map(Number);
  const [endHour, endMinute] = hourEnd.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

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

    console.log(isAvailable)

    if (isFutureHour && isAvailable) {
      result.push(`${formattedHour}:${formattedMinute}`);
    }
  }

  return result;
};