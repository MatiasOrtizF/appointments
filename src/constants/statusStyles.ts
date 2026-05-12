export const APPOINTMENT_STATUS_STYLES = {
  confirmed: {
    text: "#2e7d32",
    background: "#e8f5e9",
  },
  pending: {
    text: "#ed6c02",
    background: "#fff3e0",
  },
  cancelled: {
    text: "#d32f2f",
    background: "#fdecea",
  },
} as const;

export const EMPLOYEE_STATUS_STYLES = {
  active: {
    text: "#2e7d32",
    background: "#e8f5e9",
  },

  vacation: {
    text: "#1565c0",
    background: "#e3f2fd",
  },

  sick: {
    text: "#d32f2f",
    background: "#fdecea",
  },

  day_off: {
    text: "#ed6c02",
    background: "#fff3e0",
  }
} as const;