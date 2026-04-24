const DAYS = [
  "domingo",   // 0
  "lunes",     // 1
  "martes",    // 2
  "miercoles", // 3
  "jueves",    // 4
  "viernes",   // 5
  "sabado"     // 6
];

export const getMissingDaysIndexes = (
  selectedDays: string[]
): number[] => {
  const normalized = selectedDays.map(day =>
    day
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );

  return DAYS
    .map((day, index) => ({ day, index }))
    .filter(item => !normalized.includes(item.day))
    .map(item => item.index);
};